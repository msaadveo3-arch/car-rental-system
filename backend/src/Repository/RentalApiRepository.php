<?php

namespace App\Repository;

use App\Exception\ApiProblem;
use Doctrine\DBAL\Connection;

final class RentalApiRepository
{
    public function __construct(private readonly Connection $connection) {}

    /** @return list<array<string, mixed>> */
    public function findAll(): array
    {
        return $this->connection->executeQuery(
            'SELECT rental.*, customer.name AS customer_name, customer.phone AS customer_phone,
                    car.plate_number, make.name AS make, model.name AS model, staff.username AS staff_name
             FROM rentals rental
             JOIN customers customer ON customer.id = rental.customer_id
             JOIN cars car ON car.id = rental.car_id
             LEFT JOIN car_models catalog ON catalog.id = car.model_id
             LEFT JOIN vehicle_makes make ON make.id = catalog.make_id
             LEFT JOIN vehicle_models model ON model.id = catalog.model_id
             LEFT JOIN users staff ON staff.id = rental.staff_id
             ORDER BY rental.id DESC'
        )->fetchAllAssociative();
    }

    /** @return array<string, mixed>|null */
    public function findDetails(int $id): ?array
    {
        $row = $this->connection->executeQuery(
            'SELECT rental.*, customer.name AS customer_name, customer.phone AS customer_phone,
                    customer.email AS customer_email, customer.nationality AS customer_nationality,
                    customer.gender AS customer_gender, customer.birth_date AS customer_birth_date,
                    customer.job AS customer_job, customer.national_id AS customer_national_id,
                    customer.license_number AS customer_license_number,
                    customer.license_expiry_date AS customer_license_expiry,
                    license.name AS customer_license_type, car.plate_number, car.vin,
                    car.registration_number, car.mileage, engine.name AS engine_capacity,
                    transmission.name AS transmission, make.name AS make, model.name AS model,
                    car_group.name AS car_group, color.name AS color, pickup.name AS pickup_branch,
                    return_branch.name AS return_branch, border.name AS cross_border,
                    source.name AS hirer_source, payment.name AS deposit_method,
                    currency.name AS currency, staff.username AS staff_name
             FROM rentals rental
             JOIN customers customer ON customer.id = rental.customer_id
             LEFT JOIN license_types license ON license.id = customer.license_type_id
             JOIN cars car ON car.id = rental.car_id
             LEFT JOIN car_models catalog ON catalog.id = car.model_id
             LEFT JOIN vehicle_makes make ON make.id = catalog.make_id
             LEFT JOIN vehicle_models model ON model.id = catalog.model_id
             LEFT JOIN car_groups car_group ON car_group.id = catalog.group_id
             LEFT JOIN colors color ON color.id = car.color_id
             LEFT JOIN engine_capacities engine ON engine.id = catalog.engine_capacity_id
             LEFT JOIN transmissions transmission ON transmission.id = catalog.transmission_id
             LEFT JOIN branches pickup ON pickup.id = rental.pickup_branch_id
             LEFT JOIN branches return_branch ON return_branch.id = rental.return_branch_id
             LEFT JOIN borders border ON border.id = rental.cross_border_id
             LEFT JOIN sources source ON source.id = rental.hirer_source_id
             LEFT JOIN payment_methods payment ON payment.id = rental.security_deposit_method_id
             LEFT JOIN currencies currency ON currency.id = rental.currency_id
             LEFT JOIN users staff ON staff.id = rental.staff_id
             WHERE rental.id = :id',
            ['id' => $id]
        )->fetchAssociative();

        return $row === false ? null : $row;
    }

    /** @param array<string, mixed> $input @return array{id:int,booking_number:string} */
    public function create(array $input, int $staffId): array
    {
        return $this->connection->transactional(function () use ($input, $staffId): array {
            $customerId = (int) $input['customer_id'];
            $carId = (int) $input['car_id'];
            $customer = $this->connection->executeQuery('SELECT id FROM customers WHERE id = :id AND deleted_at IS NULL', ['id' => $customerId])->fetchOne();
            if ($customer === false) throw new ApiProblem('Customer not found', 404);

            $car = $this->connection->executeQuery('SELECT * FROM cars WHERE id = :id AND deleted_at IS NULL FOR UPDATE', ['id' => $carId])->fetchAssociative();
            if ($car === false) throw new ApiProblem('Car not found', 404);
            if ($car['status'] !== 'available') throw new ApiProblem('Car is not available for rent', 422);

            $overlap = $this->connection->createQueryBuilder()->select('COUNT(*)')->from('rentals')
                ->where('car_id = :car')->andWhere('status IN (:statuses)')
                ->andWhere('start_date < :end')->andWhere('end_date > :start')
                ->setParameter('car', $carId)->setParameter('statuses', ['booked', 'active'], \Doctrine\DBAL\ArrayParameterType::STRING)
                ->setParameter('end', $input['end_date'])->setParameter('start', $input['start_date'])->fetchOne();
            if ((int) $overlap > 0) throw new ApiProblem('Car is already booked for these dates', 422);

            $values = $this->rentalValues($input, $car);
            $values['customer_id'] = $customerId;
            $values['car_id'] = $carId;
            $values['staff_id'] = $staffId;
            $values['status'] = 'booked';
            $this->insert('rentals', $values);
            $id = (int) $this->connection->lastInsertId();
            $booking = 'BK-'.str_pad((string) $id, 5, '0', STR_PAD_LEFT);
            $this->updateTable('rentals', $id, ['booking_number' => $booking]);

            return ['id' => $id, 'booking_number' => $booking];
        });
    }

    /** @param array<string, mixed> $input */
    public function updateStatus(int $id, string $status, array $input, int $userId): void
    {
        $this->connection->transactional(function () use ($id, $status, $input, $userId): void {
            $rental = $this->connection->executeQuery('SELECT * FROM rentals WHERE id = :id FOR UPDATE', ['id' => $id])->fetchAssociative();
            if ($rental === false) throw new ApiProblem('Rental not found', 404);

            $contract = $status === 'active' && empty($rental['contract_number']) ? 'CON-'.str_pad((string) $id, 5, '0', STR_PAD_LEFT) : $rental['contract_number'];
            $values = ['status' => $status, 'contract_number' => $contract, 'updated_by' => $userId];
            foreach (['actual_return_date', 'notes'] as $field) if (array_key_exists($field, $input) && $input[$field] !== '') $values[$field] = $input[$field];
            if (array_key_exists('final_charges', $input) && $input['final_charges'] !== '') $values['final_charges'] = (float) $input['final_charges'];
            $this->updateTable('rentals', $id, $values);

            if ($status === 'active') $this->updateTable('cars', (int) $rental['car_id'], ['status' => 'rented']);
            if (in_array($status, ['returned', 'completed', 'cancelled'], true)) $this->updateTable('cars', (int) $rental['car_id'], ['status' => 'available']);
        });
    }

    /** @return list<array<string, mixed>> */
    public function pickupInspections(): array
    {
        return $this->connection->executeQuery(
            "SELECT inspection.id AS inspection_id, inspection.inspection_date, inspection.notes,
                    inspection.damage_report, inspection.photos, rental.id AS rental_id,
                    rental.booking_number, rental.contract_number, rental.status AS rental_status,
                    rental.start_date, rental.end_date, customer.name AS customer_name,
                    customer.phone AS customer_phone, car.plate_number, car.vin, car.mileage,
                    color.name AS color, make.name AS make, model.name AS model,
                    car_group.name AS car_group, inspector.username AS inspector_name
             FROM inspections inspection
             JOIN rentals rental ON rental.id = inspection.rental_id
             JOIN customers customer ON customer.id = rental.customer_id
             JOIN cars car ON car.id = rental.car_id
             LEFT JOIN car_models catalog ON catalog.id = car.model_id
             LEFT JOIN vehicle_makes make ON make.id = catalog.make_id
             LEFT JOIN vehicle_models model ON model.id = catalog.model_id
             LEFT JOIN car_groups car_group ON car_group.id = catalog.group_id
             LEFT JOIN colors color ON color.id = car.color_id
             LEFT JOIN users inspector ON inspector.id = inspection.inspector_id
             WHERE inspection.inspection_type = 'pickup' AND inspection.status = 'completed'
             ORDER BY inspection.id DESC"
        )->fetchAllAssociative();
    }

    /** @param array<string, mixed> $input */
    public function createPickupInspection(int $rentalId, array $input, int $inspectorId): int
    {
        return $this->connection->transactional(function () use ($rentalId, $input, $inspectorId): int {
            $rental = $this->connection->executeQuery("SELECT * FROM rentals WHERE id = :id AND status = 'booked' FOR UPDATE", ['id' => $rentalId])->fetchAssociative();
            if ($rental === false) throw new ApiProblem('Rental not found or not pending inspection', 404);
            $this->insert('inspections', [
                'rental_id' => $rentalId, 'inspection_type' => 'pickup', 'inspector_id' => $inspectorId,
                'damage_report' => json_encode($input['damage_report'] ?? [], JSON_THROW_ON_ERROR),
                'photos' => json_encode($input['photos'] ?? [], JSON_THROW_ON_ERROR),
                'notes' => $this->nullable($input['notes'] ?? null), 'status' => 'completed',
            ]);
            $inspectionId = (int) $this->connection->lastInsertId();
            $contract = $rental['contract_number'] ?: 'CON-'.str_pad((string) $rentalId, 5, '0', STR_PAD_LEFT);
            $this->updateTable('rentals', $rentalId, ['status' => 'active', 'contract_number' => $contract, 'updated_by' => $inspectorId]);
            $this->updateTable('cars', (int) $rental['car_id'], ['status' => 'rented']);
            return $inspectionId;
        });
    }

    /** @param array<string, mixed> $input @param array<string, mixed> $car @return array<string, mixed> */
    private function rentalValues(array $input, array $car): array
    {
        $values = [
            'start_date' => $input['start_date'], 'end_date' => $input['end_date'],
            'rental_type' => $input['rental_type'] ?? 'daily', 'km_policy' => $input['km_policy'] ?? 'limited',
            'daily_rate' => $input['daily_rate'] ?? $car['daily_rate'], 'monthly_rate' => $input['monthly_rate'] ?? $car['monthly_rate'],
            'with_driver' => !empty($input['with_driver']) ? 1 : 0, 'deposit_received' => !empty($input['deposit_received']) ? 1 : 0,
        ];
        foreach (['pickup_branch_id', 'return_branch_id', 'hirer_source_id', 'cross_border_id', 'allowed_km', 'security_deposit_method_id', 'currency_id', 'units'] as $field) $values[$field] = $this->nullableInt($input[$field] ?? null);
        foreach (['pickup_address', 'dropoff_address', 'deposit_ref', 'notes', 'tariff_name', 'pricing_mode', 'rental_band'] as $field) $values[$field] = $this->nullable($input[$field] ?? null);
        foreach (['extra_km_fee', 'security_deposit', 'rack_rate', 'gross_amount', 'discount_amount', 'unlimited_addon', 'border_fee', 'vat_amount', 'total_amount'] as $field) $values[$field] = $this->nullableFloat($input[$field] ?? null);
        return $values;
    }

    /** @param array<string, mixed> $values */
    private function insert(string $table, array $values): void
    {
        $builder = $this->connection->createQueryBuilder()->insert($table);
        foreach ($values as $column => $value) $builder->setValue($column, ':'.$column)->setParameter($column, $value);
        $builder->executeStatement();
    }

    /** @param array<string, mixed> $values */
    private function updateTable(string $table, int $id, array $values): void
    {
        $builder = $this->connection->createQueryBuilder()->update($table)->where('id = :id')->setParameter('id', $id);
        foreach ($values as $column => $value) $builder->set($column, ':'.$column)->setParameter($column, $value);
        $builder->executeStatement();
    }

    private function nullable(mixed $value): mixed { return $value === null || $value === '' ? null : $value; }
    private function nullableInt(mixed $value): ?int { return $value === null || $value === '' ? null : (int) $value; }
    private function nullableFloat(mixed $value): ?float { return $value === null || $value === '' ? null : (float) $value; }
}
