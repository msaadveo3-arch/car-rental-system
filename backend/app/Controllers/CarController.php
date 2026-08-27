<?php

namespace App\Controllers;

use App\Database;

class CarController
{
    /** GET /api/cars */
    public function index(): void
    {
        $cars = Database::connection()
            ->query(
                'SELECT c.id, c.model_id, c.plate_number, c.vin, c.registration_number, c.registration_expiry,
                        c.year, c.manufacture_year, c.daily_rate, c.monthly_rate, c.status, c.location,
                        c.mileage, c.fuel_level,
                        c.color_id, c.technical_status_id, m.engine_capacity_id,
                        col.name AS color, ts.name AS technical_status,
                        vm.name AS make, vmo.name AS model,
                        m.make_id AS make_lookup_id, m.model_id AS model_lookup_id,
                        m.seats, ec.name AS engine_capacity, m.horsepower,
                        m.body_type_id, m.fuel_type_id, m.transmission_id, m.group_id,
                        bt.name AS body_type, ft.name AS fuel_type, tr.name AS transmission, g.name AS car_group,
                        m.image_url
                 FROM cars c
                 LEFT JOIN car_models m ON m.id = c.model_id
                 LEFT JOIN vehicle_makes vm ON vm.id = m.make_id
                 LEFT JOIN vehicle_models vmo ON vmo.id = m.model_id
                 LEFT JOIN engine_capacities ec ON ec.id = m.engine_capacity_id
                 LEFT JOIN colors col ON col.id = c.color_id
                 LEFT JOIN technical_statuses ts ON ts.id = c.technical_status_id
                 LEFT JOIN body_types bt ON bt.id = m.body_type_id
                 LEFT JOIN fuel_types ft ON ft.id = m.fuel_type_id
                 LEFT JOIN transmissions tr ON tr.id = m.transmission_id
                 LEFT JOIN car_groups g ON g.id = m.group_id
                 WHERE c.deleted_at IS NULL
                 ORDER BY c.id'
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $cars]);
    }

    /** GET /api/car-models */
    public function models(): void
    {
        $models = Database::connection()
            ->query(
                "SELECT m.id, m.make_id, m.model_id, vm.name AS make, vmo.name AS model
                 FROM car_models m
                 JOIN vehicle_makes vm ON vm.id = m.make_id
                 JOIN vehicle_models vmo ON vmo.id = m.model_id
                 WHERE m.status = 'active'
                 ORDER BY vm.name, vmo.name"
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $models]);
    }

    /** قوائم الفورم (النشط فقط) */
    public function lookups(): void
    {
        $pdo = Database::connection();

        json_response([
            'success' => true,
            'data' => [
                'body_types'         => $pdo->query("SELECT id, name FROM body_types WHERE status = 'active' ORDER BY id")->fetchAll(),
                'fuel_types'         => $pdo->query("SELECT id, name FROM fuel_types WHERE status = 'active' ORDER BY id")->fetchAll(),
                'transmissions'      => $pdo->query("SELECT id, name FROM transmissions WHERE status = 'active' ORDER BY id")->fetchAll(),
                'car_groups'         => $pdo->query("SELECT id, name FROM car_groups WHERE status = 'active' ORDER BY id")->fetchAll(),
                'vehicle_makes'      => $pdo->query("SELECT id, name FROM vehicle_makes WHERE status = 'active' ORDER BY id")->fetchAll(),
                'vehicle_models'     => $pdo->query("SELECT id, make_id, name FROM vehicle_models WHERE status = 'active' ORDER BY id")->fetchAll(),
                'engine_capacities'  => $pdo->query("SELECT id, name FROM engine_capacities WHERE status = 'active' ORDER BY id")->fetchAll(),
                'technical_statuses' => $pdo->query("SELECT id, name FROM technical_statuses WHERE status = 'active' ORDER BY id")->fetchAll(),
                'colors'             => $pdo->query("SELECT id, name FROM colors WHERE status = 'active' ORDER BY id")->fetchAll(),
            ],
        ]);
    }

    /** يحلّ كتالوج الـ specs من make_id + vehicle_model_id — أو ينشئه لو لسه مفيش */
    private function resolveModelId(array $input): int
    {
        $pdo = Database::connection();
        $makeId = nullable_int($input['make_id'] ?? null);
        $vehModelId = nullable_int($input['vehicle_model_id'] ?? null);

        if (!$makeId || !$vehModelId) {
            json_response(['success' => false, 'message' => 'Make and model are required'], 422);
        }

        $find = $pdo->prepare('SELECT id FROM car_models WHERE make_id = ? AND model_id = ?');
        $find->execute([$makeId, $vehModelId]);
        $id = $find->fetchColumn();

        if ($id !== false) {
            $this->updateModelSpecs((int) $id, $input);
            return (int) $id;
        }

        $uid = current_user()['id'] ?? null;
        $pdo->prepare(
            'INSERT INTO car_models (make_id, model_id, body_type_id, seats, fuel_type_id, engine_capacity_id,
                                      horsepower, transmission_id, group_id, created_by, updated_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $makeId,
            $vehModelId,
            nullable_int($input['body_type_id'] ?? null),
            nullable_int($input['seats'] ?? null),
            nullable_int($input['fuel_type_id'] ?? null),
            nullable_int($input['engine_capacity_id'] ?? null),
            nullable_int($input['horsepower'] ?? null),
            nullable_int($input['transmission_id'] ?? null),
            nullable_int($input['group_id'] ?? null),
            $uid,
            $uid,
        ]);

        return (int) $pdo->lastInsertId();
    }

        /** يحدّث الـ specs المبعوطة بس — الباقي يفضل زي ما هو */
    private function updateModelSpecs(int $modelId, array $input): void
    {
        $pdo = Database::connection();
        $map = [
            'body_type_id'       => nullable_int($input['body_type_id'] ?? null),
            'seats'              => nullable_int($input['seats'] ?? null),
            'fuel_type_id'       => nullable_int($input['fuel_type_id'] ?? null),
            'engine_capacity_id' => nullable_int($input['engine_capacity_id'] ?? null),
            'horsepower'         => nullable_int($input['horsepower'] ?? null),
            'transmission_id'    => nullable_int($input['transmission_id'] ?? null),
            'group_id'           => nullable_int($input['group_id'] ?? null),
        ];

        $sets = [];
        $values = [];
        foreach ($map as $col => $val) {
            if ($val !== null) {
                $sets[] = "$col = ?";
                $values[] = $val;
            }
        }
        if ($sets === []) {
            return;
        }
        $values[] = $modelId;

        $pdo->prepare('UPDATE car_models SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);
    }


    /** يجيب الكتالوج بالأسماء من الـ lookups */
    private function fetchModel(int $modelId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT m.*, vm.name AS make, vmo.name AS model, g.name AS group_name
             FROM car_models m
             LEFT JOIN vehicle_makes vm ON vm.id = m.make_id
             LEFT JOIN vehicle_models vmo ON vmo.id = m.model_id
             LEFT JOIN car_groups g ON g.id = m.group_id
             WHERE m.id = ?'
        );
        $stmt->execute([$modelId]);

        return $stmt->fetch();
    }

    /** POST /api/cars */
    public function store(): void
    {
        $input = json_input();
        $pdo = Database::connection();

        if (empty($input['plate_number']) || empty($input['year'])) {
            json_response(['success' => false, 'message' => 'Plate number and year are required'], 422);
        }

        $modelId = $this->resolveModelId($input);

        $pdo->prepare(
            'INSERT INTO cars (model_id, plate_number, vin, registration_number, registration_expiry,
                               year, manufacture_year, color_id, technical_status_id,
                               daily_rate, monthly_rate, status, location, mileage, fuel_level)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $modelId,
            trim($input['plate_number']),
            nullable($input['vin'] ?? null),
            nullable($input['registration_number'] ?? null),
            nullable($input['registration_expiry'] ?? null),
            (int) $input['year'],
            nullable_int($input['manufacture_year'] ?? null),
            nullable_int($input['color_id'] ?? null),
            nullable_int($input['technical_status_id'] ?? null),
            nullable($input['daily_rate'] ?? null),
            nullable($input['monthly_rate'] ?? null),
            $input['status'] ?? 'available',
            nullable($input['location'] ?? null),
            nullable_int($input['mileage'] ?? null) ?? 0,
            $input['fuel_level'] ?? 'full',
        ]);

        json_response(['success' => true, 'data' => ['id' => (int) $pdo->lastInsertId()]], 201);
    }

    /** PUT /api/cars/{id} */
    public function update(string $id): void
    {
        $input = json_input();
        $pdo = Database::connection();

        $check = $pdo->prepare('SELECT id FROM cars WHERE id = ? AND deleted_at IS NULL');
        $check->execute([(int) $id]);
        if (!$check->fetch()) {
            json_response(['success' => false, 'message' => 'Car not found'], 404);
        }

        if (empty($input['plate_number']) || empty($input['year'])) {
            json_response(['success' => false, 'message' => 'Plate number and year are required'], 422);
        }

        $modelId = $this->resolveModelId($input);

        $pdo->prepare(
            'UPDATE cars SET model_id = ?, plate_number = ?, vin = ?, registration_number = ?, registration_expiry = ?,
             year = ?, manufacture_year = ?, color_id = ?, technical_status_id = ?,
             daily_rate = ?, monthly_rate = ?, status = ?, location = ?,
             mileage = ?, fuel_level = ? WHERE id = ?'
        )->execute([
            $modelId,
            trim($input['plate_number']),
            nullable($input['vin'] ?? null),
            nullable($input['registration_number'] ?? null),
            nullable($input['registration_expiry'] ?? null),
            (int) $input['year'],
            nullable_int($input['manufacture_year'] ?? null),
            nullable_int($input['color_id'] ?? null),
            nullable_int($input['technical_status_id'] ?? null),
            nullable($input['daily_rate'] ?? null),
            nullable($input['monthly_rate'] ?? null),
            $input['status'] ?? 'available',
            nullable($input['location'] ?? null),
            nullable_int($input['mileage'] ?? null) ?? 0,
            $input['fuel_level'] ?? 'full',
            (int) $id,
        ]);

        json_response(['success' => true]);
    }

    /** DELETE /api/cars/{id} — حذف آمن */
    public function destroy(string $id): void
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('UPDATE cars SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL');
        $stmt->execute([(int) $id]);

        if ($stmt->rowCount() === 0) {
            json_response(['success' => false, 'message' => 'Car not found'], 404);
        }

        json_response(['success' => true, 'message' => 'Car soft-deleted']);
    }
}