<?php

namespace App\Controllers;

use App\Database;

class KmPolicyController
{
    /** GET /api/km-policies */
    public function index(): void
    {
        $rows = Database::connection()
            ->query(
                'SELECT k.*, rt.name AS rental_type, g.name AS group_name
                 FROM km_policies k
                 JOIN rental_types rt ON rt.id = k.rental_type_id
                 JOIN car_groups g ON g.id = k.group_id
                 ORDER BY k.id'
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $rows]);
    }

    /** POST /api/km-policies */
    public function store(): void
    {
        $user = require_auth();
        $input = json_input();
        $pdo = Database::connection();

        $typeId = (int) ($input['rental_type_id'] ?? 0);
        $groupId = (int) ($input['group_id'] ?? 0);
        if (!$typeId || !$groupId) {
            json_response(['success' => false, 'message' => 'Rental type and vehicle group are required'], 422);
        }

        $maxKm = max(0, (int) ($input['max_km'] ?? 0));
        $extraRate = max(0, (float) ($input['extra_km_rate'] ?? 0));
        $unlimited = max(0, (float) ($input['unlimited_daily_amount'] ?? 0));

        try {
            $pdo->prepare(
                'INSERT INTO km_policies (rental_type_id, group_id, max_km, extra_km_rate, unlimited_daily_amount, created_by, updated_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?)'
            )->execute([$typeId, $groupId, $maxKm, $extraRate, $unlimited, $user['id'], $user['id']]);
        } catch (\PDOException $e) {
            json_response(['success' => false, 'message' => 'This combination already exists'], 422);
        }

        json_response(['success' => true], 201);
    }

    /** PUT /api/km-policies/{id} */
    public function update(string $id): void
    {
        $user = require_auth();
        $input = json_input();
        $pdo = Database::connection();

        $sets = [];
        $values = [];
        if (isset($input['max_km'])) { $sets[] = 'max_km = ?'; $values[] = max(0, (int) $input['max_km']); }
        if (isset($input['extra_km_rate'])) { $sets[] = 'extra_km_rate = ?'; $values[] = max(0, (float) $input['extra_km_rate']); }
        if (isset($input['unlimited_daily_amount'])) { $sets[] = 'unlimited_daily_amount = ?'; $values[] = max(0, (float) $input['unlimited_daily_amount']); }
        if (isset($input['status'])) { $sets[] = 'status = ?'; $values[] = $input['status'] === 'active' ? 'active' : 'inactive'; }

        if ($sets === []) {
            json_response(['success' => false, 'message' => 'Nothing to update'], 422);
        }
        $sets[] = 'updated_by = ?';
        $values[] = $user['id'];
        $values[] = (int) $id;

        $pdo->prepare('UPDATE km_policies SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);
        json_response(['success' => true]);
    }

    /** DELETE /api/km-policies/{id} */
    public function destroy(string $id): void
    {
        require_auth();
        Database::connection()->prepare('DELETE FROM km_policies WHERE id = ?')->execute([(int) $id]);
        json_response(['success' => true]);
    }
}