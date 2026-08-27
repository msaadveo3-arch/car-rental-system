<?php

namespace App\Controllers;

use App\Database;

class TariffController
{
    /** GET /api/tariffs */
    public function index(): void
    {
        $rows = Database::connection()
            ->query(
                'SELECT t.*, cu.username AS created_by_name, uu.username AS updated_by_name
                 FROM tariffs t
                 LEFT JOIN users cu ON cu.id = t.created_by
                 LEFT JOIN users uu ON uu.id = t.updated_by
                 ORDER BY t.id'
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $rows]);
    }

    /** POST /api/tariffs */
    public function store(): void
    {
        $user = require_auth();
        $input = json_input();
        $name = trim((string) ($input['name'] ?? ''));

        if ($name === '') {
            json_response(['success' => false, 'message' => 'Name is required'], 422);
        }

        try {
            Database::connection()
                ->prepare('INSERT INTO tariffs (name, description, created_by, updated_by) VALUES (?, ?, ?, ?)')
                ->execute([
                    $name,
                    trim((string) ($input['description'] ?? '')) ?: null,
                    $user['id'],
                    $user['id'],
                ]);
        } catch (\PDOException $e) {
            json_response(['success' => false, 'message' => 'This tariff already exists'], 422);
        }

        json_response(['success' => true], 201);
    }

    /** PUT /api/tariffs/{id} */
    public function update(string $id): void
    {
        $user = require_auth();
        $input = json_input();
        $pdo = Database::connection();

        $sets = [];
        $values = [];
        if (isset($input['name']) && trim((string) $input['name']) !== '') {
            $sets[] = 'name = ?';
            $values[] = trim((string) $input['name']);
        }
        if (isset($input['description'])) {
            $sets[] = 'description = ?';
            $values[] = trim((string) $input['description']) ?: null;
        }
        if (isset($input['status'])) {
            $sets[] = 'status = ?';
            $values[] = $input['status'] === 'active' ? 'active' : 'inactive';
        }
        if ($sets === []) {
            json_response(['success' => false, 'message' => 'Nothing to update'], 422);
        }
        $sets[] = 'updated_by = ?';
        $values[] = $user['id'];
        $values[] = (int) $id;

        $pdo->prepare('UPDATE tariffs SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);

        json_response(['success' => true]);
    }

    /** DELETE /api/tariffs/{id} */
    public function destroy(string $id): void
    {
        require_auth();
        $pdo = Database::connection();

        $used = $pdo->prepare('SELECT COUNT(*) FROM tariff_details WHERE tariff_id = ?');
        $used->execute([(int) $id]);
        if ((int) $used->fetchColumn() > 0) {
            json_response(['success' => false, 'message' => 'Cannot delete: tariff has price lines'], 409);
        }

        $pdo->prepare('DELETE FROM tariffs WHERE id = ?')->execute([(int) $id]);
        json_response(['success' => true]);
    }

    /** GET /api/tariff-details */
    public function details(): void
    {
        $rows = Database::connection()
            ->query(
                'SELECT d.*, t.name AS tariff_name, g.name AS group_name, b.name AS branch_name,
                        pm.name AS pricing_mode, rt.name AS rental_type
                 FROM tariff_details d
                 JOIN tariffs t ON t.id = d.tariff_id
                 JOIN car_groups g ON g.id = d.group_id
                 LEFT JOIN branches b ON b.id = d.branch_id
                 JOIN pricing_modes pm ON pm.id = d.pricing_mode_id
                 JOIN rental_types rt ON rt.id = d.rental_type_id
                 ORDER BY d.id'
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $rows]);
    }

    /** POST /api/tariff-details */
    public function storeDetail(): void
    {
        $user = require_auth();
        $input = json_input();
        $pdo = Database::connection();

        $tariffId = (int) ($input['tariff_id'] ?? 0);
        $groupId = (int) ($input['group_id'] ?? 0);
        $modeId = (int) ($input['pricing_mode_id'] ?? 0);
        $typeId = (int) ($input['rental_type_id'] ?? 0);

        if (!$tariffId || !$groupId || !$modeId || !$typeId) {
            json_response(['success' => false, 'message' => 'Tariff, group, pricing mode and rental type are required'], 422);
        }

        $rack = (float) ($input['rack_rate'] ?? 0);
        $floor = (float) ($input['floor_rate'] ?? 0);
        if ($rack <= 0 || $floor <= 0 || $floor > $rack) {
            json_response(['success' => false, 'message' => 'Rates must be positive and floor cannot exceed rack'], 422);
        }

        try {
            $pdo->prepare(
                'INSERT INTO tariff_details (tariff_id, group_id, branch_id, pricing_mode_id, rental_type_id,
                                             rack_rate, floor_rate, is_default, created_by, updated_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            )->execute([
                $tariffId,
                $groupId,
                !empty($input['branch_id']) ? (int) $input['branch_id'] : null,
                $modeId,
                $typeId,
                $rack,
                $floor,
                !empty($input['is_default']) ? 1 : 0,
                $user['id'],
                $user['id'],
            ]);
        } catch (\PDOException $e) {
            json_response(['success' => false, 'message' => 'This combination already exists'], 422);
        }

        json_response(['success' => true], 201);
    }

    /** PUT /api/tariff-details/{id} */
    public function updateDetail(string $id): void
    {
        $user = require_auth();
        $input = json_input();
        $pdo = Database::connection();

        $sets = [];
        $values = [];

        if (isset($input['rack_rate'])) { $sets[] = 'rack_rate = ?'; $values[] = (float) $input['rack_rate']; }
        if (isset($input['floor_rate'])) { $sets[] = 'floor_rate = ?'; $values[] = (float) $input['floor_rate']; }
        if (isset($input['is_default'])) { $sets[] = 'is_default = ?'; $values[] = !empty($input['is_default']) ? 1 : 0; }
        if (isset($input['status'])) { $sets[] = 'status = ?'; $values[] = $input['status'] === 'active' ? 'active' : 'inactive'; }

        if ($sets === []) {
            json_response(['success' => false, 'message' => 'Nothing to update'], 422);
        }
        $sets[] = 'updated_by = ?';
        $values[] = $user['id'];
        $values[] = (int) $id;

        $pdo->prepare('UPDATE tariff_details SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);
        json_response(['success' => true]);
    }

    /** DELETE /api/tariff-details/{id} */
    public function destroyDetail(string $id): void
    {
        require_auth();
        Database::connection()
            ->prepare('DELETE FROM tariff_details WHERE id = ?')
            ->execute([(int) $id]);
        json_response(['success' => true]);
    }
}