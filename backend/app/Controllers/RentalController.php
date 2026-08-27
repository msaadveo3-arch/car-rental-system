<?php

namespace App\Controllers;

use App\Database;

class RentalController
{
    /** GET /api/rentals */
    public function index(): void
    {
        $rows = Database::connection()
            ->query(
                'SELECT r.*,
                        cu.name AS customer_name, cu.phone AS customer_phone,
                        c.plate_number, vm.name AS make, vmo.name AS model,
                        u.username AS staff_name
                 FROM rentals r
                 JOIN customers cu ON cu.id = r.customer_id
                 JOIN cars c ON c.id = r.car_id
                 LEFT JOIN car_models cm ON cm.id = c.model_id
                 LEFT JOIN vehicle_makes vm ON vm.id = cm.make_id
                 LEFT JOIN vehicle_models vmo ON vmo.id = cm.model_id
                 LEFT JOIN users u ON u.id = r.staff_id
                 ORDER BY r.id DESC'
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $rows]);
    }

    /** GET /api/rentals/{id} — تفاصيل العقد كاملة */
    public function show(string $id): void
    {
        $stmt = Database::connection()->prepare(
            'SELECT r.*,
                    cu.name AS customer_name, cu.phone AS customer_phone, cu.email AS customer_email,
                    cu.nationality AS customer_nationality, cu.gender AS customer_gender,
                    cu.birth_date AS customer_birth_date, cu.job AS customer_job,
                    cu.national_id AS customer_national_id,
                    cu.license_number AS customer_license_number,
                    cu.license_expiry_date AS customer_license_expiry,
                    lt.name AS customer_license_type,
                    c.plate_number, c.vin, c.registration_number, c.mileage,
                    ec.name AS engine_capacity, tr.name AS transmission,
                    vm.name AS make, vmo.name AS model, g.name AS car_group, col.name AS color,
                    pb.name AS pickup_branch, rb.name AS return_branch,
                    b.name AS cross_border, hs.name AS hirer_source,
                    dm.name AS deposit_method, cur.name AS currency,
                    u.username AS staff_name
             FROM rentals r
             JOIN customers cu ON cu.id = r.customer_id
             LEFT JOIN license_types lt ON lt.id = cu.license_type_id
             JOIN cars c ON c.id = r.car_id
             LEFT JOIN car_models cm ON cm.id = c.model_id
             LEFT JOIN vehicle_makes vm ON vm.id = cm.make_id
             LEFT JOIN vehicle_models vmo ON vmo.id = cm.model_id
             LEFT JOIN car_groups g ON g.id = cm.group_id
             LEFT JOIN colors col ON col.id = c.color_id
             LEFT JOIN engine_capacities ec ON ec.id = cm.engine_capacity_id
             LEFT JOIN transmissions tr ON tr.id = cm.transmission_id
             LEFT JOIN branches pb ON pb.id = r.pickup_branch_id
             LEFT JOIN branches rb ON rb.id = r.return_branch_id
             LEFT JOIN borders b ON b.id = r.cross_border_id
             LEFT JOIN sources hs ON hs.id = r.hirer_source_id
             LEFT JOIN payment_methods dm ON dm.id = r.security_deposit_method_id
             LEFT JOIN currencies cur ON cur.id = r.currency_id
             LEFT JOIN users u ON u.id = r.staff_id
             WHERE r.id = ?'
        );
        $stmt->execute([(int) $id]);
        $row = $stmt->fetch();

        if (!$row) {
            json_response(['success' => false, 'message' => 'Rental not found'], 404);
        }

        json_response(['success' => true, 'data' => $row]);
    }

    /** POST /api/rentals — إنشاء عقد بكل قواعد الحماية */
    public function store(): void
    {
        $staff = require_auth();
        $input = json_input();
        $pdo = Database::connection();

        $customerId = nullable_int($input['customer_id'] ?? null);
        $carId      = nullable_int($input['car_id'] ?? null);
        $startDate  = nullable($input['start_date'] ?? null);
        $endDate    = nullable($input['end_date'] ?? null);

        if (!$customerId || !$carId || !$startDate || !$endDate) {
            json_response(['success' => false, 'message' => 'Customer, car, start and end dates are required'], 422);
        }

        $start = strtotime($startDate);
        $end   = strtotime($endDate);
        if ($start === false || $end === false || $end <= $start) {
            json_response(['success' => false, 'message' => 'End date must be after start date'], 422);
        }

        $cs = $pdo->prepare('SELECT * FROM customers WHERE id = ? AND deleted_at IS NULL');
        $cs->execute([$customerId]);
        if (!$cs->fetch()) {
            json_response(['success' => false, 'message' => 'Customer not found'], 404);
        }

        $cs = $pdo->prepare('SELECT c.* FROM cars c WHERE c.id = ? AND c.deleted_at IS NULL');
        $cs->execute([$carId]);
        $car = $cs->fetch();
        if (!$car) {
            json_response(['success' => false, 'message' => 'Car not found'], 404);
        }
        if ($car['status'] !== 'available') {
            json_response(['success' => false, 'message' => 'Car is not available for rent'], 422);
        }

        $cs = $pdo->prepare(
            "SELECT COUNT(*) FROM rentals
             WHERE car_id = ? AND status IN ('booked', 'active')
             AND start_date < ? AND end_date > ?"
        );
        $cs->execute([$carId, $endDate, $startDate]);
        if ((int) $cs->fetchColumn() > 0) {
            json_response(['success' => false, 'message' => 'Car is already booked for these dates'], 422);
        }

        $pdo->prepare(
            "INSERT INTO rentals (
                customer_id, car_id, staff_id, start_date, end_date, rental_type,
                pickup_branch_id, return_branch_id, pickup_address, dropoff_address,
                hirer_source_id, cross_border_id, km_policy, allowed_km, extra_km_fee,
                daily_rate, monthly_rate, with_driver,
                security_deposit, security_deposit_method_id, deposit_received, deposit_ref, currency_id,
                notes, tariff_name, pricing_mode, rental_band, units, rack_rate,
                gross_amount, discount_amount, unlimited_addon, border_fee, vat_amount, total_amount,
                status
             ) VALUES (
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                'booked'
             )"
        )->execute([
            $customerId,
            $carId,
            (int) $staff['id'],
            $startDate,
            $endDate,
            $input['rental_type'] ?? 'daily',
            nullable_int($input['pickup_branch_id'] ?? null),
            nullable_int($input['return_branch_id'] ?? null),
            nullable($input['pickup_address'] ?? null),
            nullable($input['dropoff_address'] ?? null),
            nullable_int($input['hirer_source_id'] ?? null),
            nullable_int($input['cross_border_id'] ?? null),
            $input['km_policy'] ?? 'limited',
            nullable_int($input['allowed_km'] ?? null),
            $input['extra_km_fee'] !== null && $input['extra_km_fee'] !== '' ? (float) $input['extra_km_fee'] : null,
            $input['daily_rate'] ?? $car['daily_rate'],
            $input['monthly_rate'] ?? $car['monthly_rate'],
            !empty($input['with_driver']) ? 1 : 0,
            isset($input['security_deposit']) ? (float) $input['security_deposit'] : null,
            nullable_int($input['security_deposit_method_id'] ?? null),
            !empty($input['deposit_received']) ? 1 : 0,
            nullable($input['deposit_ref'] ?? null),
            nullable_int($input['currency_id'] ?? null),
            nullable($input['notes'] ?? null),
            nullable($input['tariff_name'] ?? null),
            nullable($input['pricing_mode'] ?? null),
            nullable($input['rental_band'] ?? null),
            nullable_int($input['units'] ?? null),
            $input['rack_rate'] !== null && $input['rack_rate'] !== '' ? (float) $input['rack_rate'] : null,
            $input['gross_amount'] !== null && $input['gross_amount'] !== '' ? (float) $input['gross_amount'] : null,
            $input['discount_amount'] !== null && $input['discount_amount'] !== '' ? (float) $input['discount_amount'] : null,
            $input['unlimited_addon'] !== null && $input['unlimited_addon'] !== '' ? (float) $input['unlimited_addon'] : null,
            $input['border_fee'] !== null && $input['border_fee'] !== '' ? (float) $input['border_fee'] : null,
            $input['vat_amount'] !== null && $input['vat_amount'] !== '' ? (float) $input['vat_amount'] : null,
            $input['total_amount'] !== null && $input['total_amount'] !== '' ? (float) $input['total_amount'] : null,
        ]);

        $newId = (int) $pdo->lastInsertId();

        $pdo->prepare("UPDATE rentals SET booking_number = CONCAT('BK-', LPAD(id, 5, '0')) WHERE id = ?")
            ->execute([$newId]);

        $row = $pdo->prepare('SELECT id, booking_number FROM rentals WHERE id = ?');
        $row->execute([$newId]);

        json_response(['success' => true, 'data' => $row->fetch()], 201);
    }

    /** PUT /api/rentals/{id} */
    public function update(string $id): void
    {
        $user = require_auth();
        $input = json_input();
        $pdo = Database::connection();

        $newStatus = (string) ($input['status'] ?? '');
        if (!in_array($newStatus, ['booked', 'active', 'returned', 'completed', 'cancelled'], true)) {
            json_response(['success' => false, 'message' => 'Invalid status'], 422);
        }
        // 🔒 التفعيل (التسليم) حق المفتش وحده — حتى الأدمن يستنى
        if ($newStatus === 'active' && $user['role'] !== 'inspector') {
            json_response(['success' => false, 'message' => 'Only the inspector can activate a contract after inspection'], 403);
        }

        $cs = $pdo->prepare('SELECT * FROM rentals WHERE id = ?');
        $cs->execute([(int) $id]);
        $rental = $cs->fetch();
        if (!$rental) {
            json_response(['success' => false, 'message' => 'Rental not found'], 404);
        }

        $pdo->beginTransaction();
        try {
            $staff = current_user();
            $uid = $staff ? (int) $staff['id'] : null;

            $contractNumber = null;
            if ($newStatus === 'active' && empty($rental['contract_number'])) {
                $contractNumber = 'CON-' . str_pad((string) $rental['id'], 5, '0', STR_PAD_LEFT);
            }

            $pdo->prepare(
                'UPDATE rentals
                 SET status = ?,
                     actual_return_date = COALESCE(?, actual_return_date),
                     final_charges = COALESCE(?, final_charges),
                     notes = COALESCE(?, notes),
                     contract_number = COALESCE(?, contract_number),
                     updated_by = COALESCE(?, updated_by)
                 WHERE id = ?'
            )->execute([
                $newStatus,
                nullable($input['actual_return_date'] ?? null),
                isset($input['final_charges']) ? (float) $input['final_charges'] : null,
                nullable($input['notes'] ?? null),
                $contractNumber,
                $uid,
                (int) $id,
            ]);

            if ($newStatus === 'active') {
                $pdo->prepare("UPDATE cars SET status = 'rented' WHERE id = ?")->execute([$rental['car_id']]);
            }
            if (in_array($newStatus, ['returned', 'completed', 'cancelled'], true)) {
                $pdo->prepare("UPDATE cars SET status = 'available' WHERE id = ?")->execute([$rental['car_id']]);
            }

            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            json_response(['success' => false, 'message' => 'Failed to update rental'], 500);
        }

        json_response(['success' => true]);
    }
}