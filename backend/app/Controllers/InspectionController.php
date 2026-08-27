<?php

namespace App\Controllers;

use App\Database;

class InspectionController
{
    /** GET /api/inspections/pickup — فحوصات الاستلام المكتملة */
    public function indexPickup(): void
    {
        $rows = Database::connection()
            ->query(
                "SELECT i.id AS inspection_id, i.inspection_date, i.notes, i.damage_report, i.photos,
                        r.id AS rental_id, r.booking_number, r.contract_number, r.status AS rental_status,
                        r.start_date, r.end_date,
                        cu.name AS customer_name, cu.phone AS customer_phone,
                        c.plate_number, c.vin, c.mileage, col.name AS color,
                        vm.name AS make, vmo.name AS model, g.name AS car_group,
                        u.username AS inspector_name
                 FROM inspections i
                 JOIN rentals r ON r.id = i.rental_id
                 JOIN customers cu ON cu.id = r.customer_id
                 JOIN cars c ON c.id = r.car_id
                 LEFT JOIN car_models cm ON cm.id = c.model_id
                 LEFT JOIN vehicle_makes vm ON vm.id = cm.make_id
                 LEFT JOIN vehicle_models vmo ON vmo.id = cm.model_id
                 LEFT JOIN car_groups g ON g.id = cm.group_id
                 LEFT JOIN colors col ON col.id = c.color_id
                 LEFT JOIN users u ON u.id = i.inspector_id
                 WHERE i.inspection_type = 'pickup' AND i.status = 'completed'
                 ORDER BY i.id DESC"
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $rows]);
    }

    /** POST /api/inspections/pickup — حفظ تقرير فحص الاستلام + تفعيل العقد */
    public function storePickup(): void
    {
        $user = require_auth();
        if ($user['role'] !== 'inspector') {
            json_response(['success' => false, 'message' => 'Only the inspector can save pickup inspections'], 403);
        }

        $input = json_input();
        $rentalId = nullable_int($input['rental_id'] ?? null);
        if (!$rentalId) {
            json_response(['success' => false, 'message' => 'rental_id is required'], 422);
        }

        $pdo = Database::connection();

        $cs = $pdo->prepare("SELECT * FROM rentals WHERE id = ? AND status = 'booked'");
        $cs->execute([$rentalId]);
        $rental = $cs->fetch();
        if (!$rental) {
            json_response(['success' => false, 'message' => 'Rental not found or not pending inspection'], 404);
        }

        $pdo->beginTransaction();
        try {
            $pdo->prepare(
                "INSERT INTO inspections (rental_id, inspection_type, inspector_id, damage_report, photos, notes, status)
                 VALUES (?, 'pickup', ?, ?, ?, ?, 'completed')"
            )->execute([
                $rentalId,
                (int) $user['id'],
                json_encode($input['damage_report'] ?? []),
                json_encode($input['photos'] ?? []),
                nullable($input['notes'] ?? null),
            ]);

            $contractNumber = null;
            if (empty($rental['contract_number'])) {
                $contractNumber = 'CON-' . str_pad((string) $rental['id'], 5, '0', STR_PAD_LEFT);
            }

            $pdo->prepare(
                "UPDATE rentals SET status = 'active', contract_number = COALESCE(contract_number, ?), updated_by = ? WHERE id = ?"
            )->execute([$contractNumber, (int) $user['id'], $rentalId]);

            $pdo->prepare("UPDATE cars SET status = 'rented' WHERE id = ?")->execute([$rental['car_id']]);

            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            json_response(['success' => false, 'message' => 'Failed to save inspection'], 500);
        }

        json_response(['success' => true, 'message' => 'Inspection saved — contract activated'], 201);
    }
}