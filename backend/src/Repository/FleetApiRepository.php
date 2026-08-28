<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;

final class FleetApiRepository
{
    public function __construct(private readonly Connection $connection) {}

    /** @return list<array<string, mixed>> */
    public function findCars(): array
    {
        return $this->connection->executeQuery(
            'SELECT c.id, c.model_id, c.plate_number, c.vin, c.registration_number, c.registration_expiry,
                    c.year, c.manufacture_year, c.daily_rate, c.monthly_rate, c.status, c.location,
                    c.mileage, c.fuel_level, c.color_id, c.technical_status_id, m.engine_capacity_id,
                    col.name AS color, ts.name AS technical_status, vm.name AS make, vmo.name AS model,
                    m.make_id AS make_lookup_id, m.model_id AS model_lookup_id, m.seats,
                    ec.name AS engine_capacity, m.horsepower, m.body_type_id, m.fuel_type_id,
                    m.transmission_id, m.group_id, bt.name AS body_type, ft.name AS fuel_type,
                    tr.name AS transmission, g.name AS car_group, m.image_url
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
             WHERE c.deleted_at IS NULL ORDER BY c.id'
        )->fetchAllAssociative();
    }

    /** @return list<array<string, mixed>> */
    public function findModels(): array
    {
        return $this->connection->createQueryBuilder()
            ->select('m.id', 'm.make_id', 'm.model_id', 'vm.name AS make', 'vmo.name AS model')
            ->from('car_models', 'm')
            ->innerJoin('m', 'vehicle_makes', 'vm', 'vm.id = m.make_id')
            ->innerJoin('m', 'vehicle_models', 'vmo', 'vmo.id = m.model_id')
            ->where('m.status = :status')
            ->setParameter('status', 'active')
            ->orderBy('vm.name', 'ASC')
            ->addOrderBy('vmo.name', 'ASC')
            ->fetchAllAssociative();
    }

    /** @return array<string, list<array<string, mixed>>> */
    public function activeLookups(): array
    {
        $tables = ['body_types', 'fuel_types', 'transmissions', 'car_groups', 'vehicle_makes', 'vehicle_models', 'engine_capacities', 'technical_statuses', 'colors'];
        $result = [];
        foreach ($tables as $table) {
            $columns = $table === 'vehicle_models' ? ['id', 'make_id', 'name'] : ['id', 'name'];
            $result[$table] = $this->connection->createQueryBuilder()
                ->select(...$columns)
                ->from($table)
                ->where('status = :status')
                ->setParameter('status', 'active')
                ->orderBy('id', 'ASC')
                ->fetchAllAssociative();
        }

        return $result;
    }

    public function exists(int $id): bool
    {
        return false !== $this->connection->createQueryBuilder()->select('id')->from('cars')
            ->where('id = :id')->andWhere('deleted_at IS NULL')->setParameter('id', $id)->fetchOne();
    }

    /** @param array<string, mixed> $input */
    public function create(array $input, int $userId): int
    {
        return $this->connection->transactional(function () use ($input, $userId): int {
            $modelId = $this->resolveModel($input, $userId);
            $this->insert('cars', $this->carValues($input, $modelId));

            return (int) $this->connection->lastInsertId();
        });
    }

    /** @param array<string, mixed> $input */
    public function update(int $id, array $input, int $userId): void
    {
        $this->connection->transactional(function () use ($id, $input, $userId): void {
            $modelId = $this->resolveModel($input, $userId);
            $this->updateTable('cars', $this->carValues($input, $modelId), $id);
        });
    }

    public function softDelete(int $id): bool
    {
        return $this->connection->createQueryBuilder()->update('cars')
            ->set('deleted_at', 'NOW()')->where('id = :id')->andWhere('deleted_at IS NULL')
            ->setParameter('id', $id)->executeStatement() > 0;
    }

    /** @param array<string, mixed> $input */
    private function resolveModel(array $input, int $userId): int
    {
        $makeId = (int) ($input['make_id'] ?? 0);
        $vehicleModelId = (int) ($input['vehicle_model_id'] ?? 0);
        $id = $this->connection->createQueryBuilder()->select('id')->from('car_models')
            ->where('make_id = :make')->andWhere('model_id = :model')
            ->setParameter('make', $makeId)->setParameter('model', $vehicleModelId)->fetchOne();

        $specs = [];
        foreach (['body_type_id', 'seats', 'fuel_type_id', 'engine_capacity_id', 'horsepower', 'transmission_id', 'group_id'] as $column) {
            if (isset($input[$column]) && $input[$column] !== '') {
                $specs[$column] = (int) $input[$column];
            }
        }

        if ($id !== false) {
            if ($specs !== []) {
                $specs['updated_by'] = $userId;
                $this->updateTable('car_models', $specs, (int) $id);
            }

            return (int) $id;
        }

        $this->insert('car_models', array_merge([
            'make_id' => $makeId,
            'model_id' => $vehicleModelId,
            'created_by' => $userId,
            'updated_by' => $userId,
        ], $specs));

        return (int) $this->connection->lastInsertId();
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    private function carValues(array $input, int $modelId): array
    {
        return [
            'model_id' => $modelId,
            'plate_number' => trim((string) $input['plate_number']),
            'vin' => $this->nullable($input['vin'] ?? null),
            'registration_number' => $this->nullable($input['registration_number'] ?? null),
            'registration_expiry' => $this->nullable($input['registration_expiry'] ?? null),
            'year' => (int) $input['year'],
            'manufacture_year' => $this->nullableInt($input['manufacture_year'] ?? null),
            'color_id' => $this->nullableInt($input['color_id'] ?? null),
            'technical_status_id' => $this->nullableInt($input['technical_status_id'] ?? null),
            'daily_rate' => $this->nullable($input['daily_rate'] ?? null),
            'monthly_rate' => $this->nullable($input['monthly_rate'] ?? null),
            'status' => $input['status'] ?? 'available',
            'location' => $this->nullable($input['location'] ?? null),
            'mileage' => $this->nullableInt($input['mileage'] ?? null) ?? 0,
            'fuel_level' => $input['fuel_level'] ?? 'full',
        ];
    }

    /** @param array<string, mixed> $values */
    private function insert(string $table, array $values): void
    {
        $builder = $this->connection->createQueryBuilder()->insert($table);
        foreach ($values as $column => $value) {
            $builder->setValue($column, ':'.$column)->setParameter($column, $value);
        }
        $builder->executeStatement();
    }

    /** @param array<string, mixed> $values */
    private function updateTable(string $table, array $values, int $id): void
    {
        $builder = $this->connection->createQueryBuilder()->update($table)->where('id = :id')->setParameter('id', $id);
        foreach ($values as $column => $value) {
            $builder->set($column, ':'.$column)->setParameter($column, $value);
        }
        $builder->executeStatement();
    }

    private function nullable(mixed $value): mixed
    {
        return $value === null || $value === '' ? null : $value;
    }

    private function nullableInt(mixed $value): ?int
    {
        return $value === null || $value === '' ? null : (int) $value;
    }
}
