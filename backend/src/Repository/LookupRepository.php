<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;

final class LookupRepository
{
    private const DEFINITIONS = [
        'body_types' => [['car_models', 'body_type_id']],
        'fuel_types' => [['car_models', 'fuel_type_id']],
        'transmissions' => [['car_models', 'transmission_id']],
        'car_groups' => [['car_models', 'group_id'], ['border_fees', 'group_id'], ['km_policies', 'group_id'], ['tariff_details', 'group_id']],
        'branches' => [['rentals', 'pickup_branch_id'], ['rentals', 'return_branch_id'], ['tariff_details', 'branch_id']],
        'sources' => [['rentals', 'hirer_source_id']],
        'borders' => [['rentals', 'cross_border_id'], ['border_fees', 'border_id']],
        'payment_methods' => [['rentals', 'security_deposit_method_id']],
        'currencies' => [['rentals', 'currency_id']],
        'vehicle_makes' => [['vehicle_models', 'make_id']],
        'vehicle_models' => [['car_models', 'model_id']],
        'engine_capacities' => [['car_models', 'engine_capacity_id']],
        'technical_statuses' => [['cars', 'technical_status_id']],
        'colors' => [['cars', 'color_id']],
        'customer_types' => [['customers', 'customer_type_id']],
        'license_types' => [['customers', 'license_type_id']],
        'pricing_modes' => [['tariff_details', 'pricing_mode_id']],
        'rental_types' => [['tariff_details', 'rental_type_id'], ['km_policies', 'rental_type_id']],
    ];

    private const EXTRA_COLUMNS = [
        'currencies' => ['label', 'rate'],
        'vehicle_models' => ['make_id'],
        'pricing_modes' => ['description'],
        'rental_types' => ['description', 'min_days', 'max_days'],
    ];

    public function __construct(private readonly Connection $connection) {}

    public function supports(string $type): bool
    {
        return isset(self::DEFINITIONS[$type]);
    }

    /** @return list<string> */
    public function extraColumns(string $type): array
    {
        return self::EXTRA_COLUMNS[$type] ?? [];
    }

    /** @return list<array<string, mixed>> */
    public function findAll(string $type): array
    {
        return $this->connection->createQueryBuilder()
            ->select('t.*', 'creator.username AS created_by_name', 'updater.username AS updated_by_name')
            ->from($type, 't')
            ->leftJoin('t', 'users', 'creator', 'creator.id = t.created_by')
            ->leftJoin('t', 'users', 'updater', 'updater.id = t.updated_by')
            ->orderBy('t.id', 'ASC')
            ->fetchAllAssociative();
    }

    public function exists(string $type, int $id): bool
    {
        return false !== $this->connection->createQueryBuilder()
            ->select('id')
            ->from($type)
            ->where('id = :id')
            ->setParameter('id', $id)
            ->fetchOne();
    }

    /** @return array<string, mixed>|null */
    public function find(string $type, int $id): ?array
    {
        $row = $this->connection->createQueryBuilder()->select('*')->from($type)
            ->where('id = :id')->setParameter('id', $id)->fetchAssociative();

        return $row === false ? null : $row;
    }

    /** @param array<string, mixed> $values */
    public function insert(string $type, array $values): int
    {
        $builder = $this->connection->createQueryBuilder()->insert($type);
        foreach ($values as $column => $value) {
            $builder->setValue($column, ':'.$column)->setParameter($column, $value);
        }
        $builder->executeStatement();

        return (int) $this->connection->lastInsertId();
    }

    /** @param array<string, mixed> $values */
    public function update(string $type, int $id, array $values): int
    {
        $builder = $this->connection->createQueryBuilder()
            ->update($type)
            ->where('id = :id')
            ->setParameter('id', $id);
        foreach ($values as $column => $value) {
            $builder->set($column, ':'.$column)->setParameter($column, $value);
        }

        return $builder->executeStatement();
    }

    public function isInUse(string $type, int $id): bool
    {
        foreach (self::DEFINITIONS[$type] as [$table, $column]) {
            $count = $this->connection->createQueryBuilder()
                ->select('COUNT(*)')
                ->from($table)
                ->where($column.' = :id')
                ->setParameter('id', $id)
                ->fetchOne();
            if ((int) $count > 0) {
                return true;
            }
        }

        return false;
    }

    public function delete(string $type, int $id): int
    {
        return $this->connection->createQueryBuilder()
            ->delete($type)
            ->where('id = :id')
            ->setParameter('id', $id)
            ->executeStatement();
    }
}
