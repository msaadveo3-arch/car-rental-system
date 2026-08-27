<?php

namespace App\Controllers;

use App\Database;
use PDOException;

class LookupController
{
    /** جدول الـ lookup => [الجدول اللي بيستخدمه، العمود] — لمنع حذف قيمة مستخدمة (null = بدون فحص حاليًا) */
    private const TABLES = [
        'body_types'      => ['car_models', 'body_type_id'],
        'fuel_types'      => ['car_models', 'fuel_type_id'],
        'transmissions'   => ['car_models', 'transmission_id'],
        'car_groups'      => ['car_models', 'group_id'],
        'branches'        => ['cars', 'branch_id'],
        'sources'         => ['rentals', 'hirer_source_id'],
        'borders'         => ['rentals', 'cross_border_id'],
        'payment_methods' => ['rentals', 'security_deposit_method_id'],
        'currencies'      => ['rentals', 'currency_id'],
        'vehicle_makes'   => ['vehicle_models', 'make_id'],
        'vehicle_models'    => ['car_models', 'model_id'],
        'engine_capacities' => ['car_models', 'engine_capacity_id'],
        'technical_statuses'=> ['cars', 'technical_status_id'],
        'colors'            => ['cars', 'color_id'],
        'customer_types'    => ['customers', 'customer_type_id'],
        'license_types'     => ['customers', 'license_type_id'],
        'pricing_modes'     => ['tariff_details', 'pricing_mode_id'],
        'rental_types'      => ['tariff_details', 'rental_type_id'],
    ];

    private const EXTRA_COLS = [
        'currencies'    => ['label', 'rate'],
        'vehicle_models'=> ['make_id'],
        'pricing_modes' => ['description'],
        'rental_types'  => ['description', 'min_days', 'max_days'],
    ];

    private function ref(string $type): ?array
    {
        if (!array_key_exists($type, self::TABLES)) {
            json_response(['success' => false, 'message' => 'Unknown lookup type'], 404);
        }
        return self::TABLES[$type];
    }

    private function userId(): ?int
    {
        $user = current_user();
        return $user ? (int) $user['id'] : null;
    }

    /** GET /api/lookups/{type} */
    public function index(string $type): void
    {
        $this->ref($type);

        $rows = Database::connection()
            ->query(
                "SELECT t.*, cu.username AS created_by_name, uu.username AS updated_by_name
                 FROM `$type` t
                 LEFT JOIN users cu ON cu.id = t.created_by
                 LEFT JOIN users uu ON uu.id = t.updated_by
                 ORDER BY t.id"
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $rows]);
    }

    /** POST /api/lookups/{type} */
    public function store(string $type): void
    {
        require_auth();
        $this->ref($type);
        $input = json_input();
        $name = trim((string) ($input['name'] ?? ''));

        if ($name === '') {
            json_response(['success' => false, 'message' => 'Name is required'], 422);
        }

        $uid = $this->userId();
        $columns = ['name', 'created_by', 'updated_by'];
        $values = [$name, $uid, $uid];

        foreach (self::EXTRA_COLS[$type] ?? [] as $col) {
            if (isset($input[$col]) && $input[$col] !== '') {
                $columns[] = $col;
                if ($col === 'rate') {
                    $values[] = (float) $input[$col];
                } elseif (in_array($col, ['min_days', 'max_days'], true)) {
                    $values[] = max(1, (int) $input[$col]);
                } elseif ($col === 'make_id') {
                    $values[] = (int) $input[$col];
                } else {
                    $values[] = trim((string) $input[$col]);
                }
            }
        }

        try {
            Database::connection()
                ->prepare(
                    "INSERT INTO `$type` (" . implode(', ', $columns) . ")
                     VALUES (" . implode(', ', array_fill(0, count($columns), '?')) . ")"
                )
                ->execute($values);
        } catch (PDOException $e) {
            json_response(['success' => false, 'message' => 'This value already exists'], 422);
        }

        json_response(['success' => true], 201);
    }

    /** PUT /api/lookups/{type}/{id} */
    public function update(string $type, string $id): void
    {
        require_auth();
        $this->ref($type);
        $input = json_input();
        $uid = $this->userId();

        $sets = [];
        $values = [];

        if (isset($input['name']) && trim((string) $input['name']) !== '') {
            $sets[] = 'name = ?';
            $values[] = trim((string) $input['name']);
        }

        if (isset($input['status'])) {
            $sets[] = 'status = ?';
            $values[] = $input['status'] === 'active' ? 'active' : 'inactive';
        }

        foreach (self::EXTRA_COLS[$type] ?? [] as $col) {
            if (isset($input[$col]) && $input[$col] !== '') {
                $sets[] = "`$col` = ?";
                $values[] = $col === 'rate'
                    ? (float) $input[$col]
                    : (in_array($col, ['make_id', 'min_days', 'max_days'], true)
                        ? (int) $input[$col]
                        : trim((string) $input[$col]));
            }
        }

        if ($sets === []) {
            json_response(['success' => false, 'message' => 'Nothing to update'], 422);
        }

        $sets[] = 'updated_by = ?';
        $values[] = $uid;
        $values[] = (int) $id;

        Database::connection()
            ->prepare('UPDATE `' . $type . '` SET ' . implode(', ', $sets) . ' WHERE id = ?')
            ->execute($values);

        json_response(['success' => true]);
    }

    /** DELETE /api/lookups/{type}/{id} */
    public function destroy(string $type, string $id): void
    {
        require_auth();
        $ref = $this->ref($type);
        $pdo = Database::connection();

        if ($ref !== null) {
            [$refTable, $refColumn] = $ref;
            $used = $pdo->prepare("SELECT COUNT(*) FROM `$refTable` WHERE `$refColumn` = ?");
            $used->execute([(int) $id]);
            if ((int) $used->fetchColumn() > 0) {
                json_response(['success' => false, 'message' => 'Cannot delete: this value is in use'], 409);
            }
        }
        if ($type === 'car_groups') {
            $used2 = $pdo->prepare('SELECT COUNT(*) FROM border_fees WHERE group_id = ?');
            $used2->execute([(int) $id]);
            if ((int) $used2->fetchColumn() > 0) {
                json_response(['success' => false, 'message' => 'Cannot delete: used in Border Fees'], 409);
            }
        }

        $pdo->prepare("DELETE FROM `$type` WHERE id = ?")->execute([(int) $id]);

        json_response(['success' => true, 'message' => 'Deleted']);
    }
}