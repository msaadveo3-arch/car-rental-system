<?php

namespace App\Controllers;

use App\Database;

class BorderFeeController
{
    /** GET /api/border-fees */
    public function index(): void
    {
        $rows = Database::connection()
            ->query(
                'SELECT bf.*, b.name AS border_name, g.name AS group_name
                 FROM border_fees bf
                 JOIN borders b ON b.id = bf.border_id
                 JOIN car_groups g ON g.id = bf.group_id
                 ORDER BY bf.id'
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $rows]);
    }

    /** POST /api/border-fees */
    public function store(): void
    {
        $user = require_auth();
        $input = json_input();
        $pdo = Database::connection();

        $borderId = (int) ($input['border_id'] ?? 0);
        $groupId = (int) ($input['group_id'] ?? 0);

        if (!$borderId || !$groupId) {
            json_response(['success' => false, 'message' => 'Border and group are required'], 422);
        }

        try {
            $pdo->prepare(
                'INSERT INTO border_fees (border_id, group_id, fee, created_by, updated_by)
                 VALUES (?, ?, ?, ?, ?)'
            )->execute([$borderId, $groupId, (float) ($input['fee'] ?? 0), $user['id'], $user['id']]);
        } catch (\PDOException $e) {
            json_response(['success' => false, 'message' => 'This border/group combination already exists'], 422);
        }

        json_response(['success' => true], 201);
    }

    /** PUT /api/border-fees/{id} */
    public function update(string $id): void
    {
        $user = require_auth();
        $input = json_input();
        $pdo = Database::connection();

        if (!isset($input['fee']) || $input['fee'] === '') {
            json_response(['success' => false, 'message' => 'Nothing to update'], 422);
        }

        $pdo->prepare('UPDATE border_fees SET fee = ?, updated_by = ? WHERE id = ?')
            ->execute([(float) $input['fee'], $user['id'], (int) $id]);

        json_response(['success' => true]);
    }

    /** DELETE /api/border-fees/{id} */
    public function destroy(string $id): void
    {
        require_auth();
        Database::connection()
            ->prepare('DELETE FROM border_fees WHERE id = ?')
            ->execute([(int) $id]);

        json_response(['success' => true]);
    }
}