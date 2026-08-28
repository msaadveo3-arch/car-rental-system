<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;

final class PricingApiRepository
{
    public function __construct(private readonly Connection $connection) {}

    /** @return list<array<string, mixed>> */
    public function borderFees(): array
    {
        return $this->connection->createQueryBuilder()->select('fee.*', 'border.name AS border_name', 'car_group.name AS group_name')
            ->from('border_fees', 'fee')->innerJoin('fee', 'borders', 'border', 'border.id = fee.border_id')
            ->innerJoin('fee', 'car_groups', 'car_group', 'car_group.id = fee.group_id')->orderBy('fee.id')->fetchAllAssociative();
    }

    public function createBorderFee(int $borderId, int $groupId, float $fee, int $userId): int
    {
        $this->insert('border_fees', ['border_id' => $borderId, 'group_id' => $groupId, 'fee' => $fee, 'created_by' => $userId, 'updated_by' => $userId]);
        return (int) $this->connection->lastInsertId();
    }

    public function updateBorderFee(int $id, float $fee, int $userId): bool
    {
        return $this->update('border_fees', $id, ['fee' => $fee, 'updated_by' => $userId]);
    }

    /** @return array<string, mixed>|null */
    public function tariffDetail(int $id): ?array
    {
        $row = $this->connection->createQueryBuilder()->select('*')->from('tariff_details')
            ->where('id = :id')->setParameter('id', $id)->fetchAssociative();
        return $row === false ? null : $row;
    }

    /** @return list<array<string, mixed>> */
    public function tariffs(): array
    {
        return $this->connection->createQueryBuilder()->select('tariff.*', 'creator.username AS created_by_name', 'updater.username AS updated_by_name')
            ->from('tariffs', 'tariff')->leftJoin('tariff', 'users', 'creator', 'creator.id = tariff.created_by')
            ->leftJoin('tariff', 'users', 'updater', 'updater.id = tariff.updated_by')->orderBy('tariff.id')->fetchAllAssociative();
    }

    public function createTariff(string $name, ?string $description, int $userId): int
    {
        $this->insert('tariffs', ['name' => $name, 'description' => $description, 'created_by' => $userId, 'updated_by' => $userId]);
        return (int) $this->connection->lastInsertId();
    }

    /** @param array<string, mixed> $values */
    public function updateTariff(int $id, array $values, int $userId): bool
    {
        $values['updated_by'] = $userId;
        return $this->update('tariffs', $id, $values);
    }

    public function tariffHasDetails(int $id): bool
    {
        return (int) $this->connection->createQueryBuilder()->select('COUNT(*)')->from('tariff_details')
            ->where('tariff_id = :id')->setParameter('id', $id)->fetchOne() > 0;
    }

    /** @return list<array<string, mixed>> */
    public function tariffDetails(): array
    {
        return $this->connection->createQueryBuilder()
            ->select('detail.*', 'tariff.name AS tariff_name', 'car_group.name AS group_name', 'branch.name AS branch_name', 'mode.name AS pricing_mode', 'rental_type.name AS rental_type')
            ->from('tariff_details', 'detail')->innerJoin('detail', 'tariffs', 'tariff', 'tariff.id = detail.tariff_id')
            ->innerJoin('detail', 'car_groups', 'car_group', 'car_group.id = detail.group_id')
            ->leftJoin('detail', 'branches', 'branch', 'branch.id = detail.branch_id')
            ->innerJoin('detail', 'pricing_modes', 'mode', 'mode.id = detail.pricing_mode_id')
            ->innerJoin('detail', 'rental_types', 'rental_type', 'rental_type.id = detail.rental_type_id')
            ->orderBy('detail.id')->fetchAllAssociative();
    }

    /** @param array<string, mixed> $values */
    public function createTariffDetail(array $values, int $userId): int
    {
        $values['created_by'] = $userId;
        $values['updated_by'] = $userId;
        $this->insert('tariff_details', $values);
        return (int) $this->connection->lastInsertId();
    }

    /** @param array<string, mixed> $values */
    public function updateTariffDetail(int $id, array $values, int $userId): bool
    {
        $values['updated_by'] = $userId;
        return $this->update('tariff_details', $id, $values);
    }

    /** @return list<array<string, mixed>> */
    public function kmPolicies(): array
    {
        return $this->connection->createQueryBuilder()->select('policy.*', 'rental_type.name AS rental_type', 'car_group.name AS group_name')
            ->from('km_policies', 'policy')->innerJoin('policy', 'rental_types', 'rental_type', 'rental_type.id = policy.rental_type_id')
            ->innerJoin('policy', 'car_groups', 'car_group', 'car_group.id = policy.group_id')->orderBy('policy.id')->fetchAllAssociative();
    }

    /** @param array<string, mixed> $values */
    public function createKmPolicy(array $values, int $userId): int
    {
        $values['created_by'] = $userId;
        $values['updated_by'] = $userId;
        $this->insert('km_policies', $values);
        return (int) $this->connection->lastInsertId();
    }

    /** @param array<string, mixed> $values */
    public function updateKmPolicy(int $id, array $values, int $userId): bool
    {
        $values['updated_by'] = $userId;
        return $this->update('km_policies', $id, $values);
    }

    public function exists(string $table, int $id): bool
    {
        return false !== $this->connection->createQueryBuilder()->select('id')->from($table)->where('id = :id')->setParameter('id', $id)->fetchOne();
    }

    public function delete(string $table, int $id): bool
    {
        return $this->connection->createQueryBuilder()->delete($table)->where('id = :id')->setParameter('id', $id)->executeStatement() > 0;
    }

    /** @param array<string, mixed> $values */
    private function insert(string $table, array $values): void
    {
        $builder = $this->connection->createQueryBuilder()->insert($table);
        foreach ($values as $column => $value) $builder->setValue($column, ':'.$column)->setParameter($column, $value);
        $builder->executeStatement();
    }

    /** @param array<string, mixed> $values */
    private function update(string $table, int $id, array $values): bool
    {
        $builder = $this->connection->createQueryBuilder()->update($table)->where('id = :id')->setParameter('id', $id);
        foreach ($values as $column => $value) $builder->set($column, ':'.$column)->setParameter($column, $value);
        return $builder->executeStatement() > 0;
    }
}
