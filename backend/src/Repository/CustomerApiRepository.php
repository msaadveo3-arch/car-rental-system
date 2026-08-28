<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;

final class CustomerApiRepository
{
    private const COLUMNS = [
        'name', 'phone', 'email', 'customer_type_id', 'national_id', 'id_issue_date', 'id_expiry_date',
        'nationality', 'gender', 'birth_date', 'job', 'license_type_id', 'license_number',
        'license_issue_date', 'license_expiry_date', 'address', 'notes', 'residential_no', 'postal_code',
        'address_1', 'address_2',
    ];

    public function __construct(private readonly Connection $connection) {}

    /** @return list<array<string, mixed>> */
    public function findAll(): array
    {
        return $this->baseQuery()->where('customer.deleted_at IS NULL')->orderBy('customer.id', 'DESC')->fetchAllAssociative();
    }

    /** @return array<string, mixed>|null */
    public function find(int $id): ?array
    {
        $row = $this->baseQuery()->where('customer.id = :id')->setParameter('id', $id)->fetchAssociative();
        return $row === false ? null : $row;
    }

    public function exists(int $id): bool
    {
        return false !== $this->connection->createQueryBuilder()->select('id')->from('customers')
            ->where('id = :id')->andWhere('deleted_at IS NULL')->setParameter('id', $id)->fetchOne();
    }

    /** @param array<string, mixed> $input */
    public function create(array $input): int
    {
        $this->insert('customers', $this->values($input));
        return (int) $this->connection->lastInsertId();
    }

    /** @param array<string, mixed> $input */
    public function update(int $id, array $input): void
    {
        $values = $this->values($input);
        $builder = $this->connection->createQueryBuilder()->update('customers')->where('id = :id')->setParameter('id', $id);
        foreach ($values as $column => $value) $builder->set($column, ':'.$column)->setParameter($column, $value);
        $builder->executeStatement();
    }

    public function softDelete(int $id): bool
    {
        return $this->connection->createQueryBuilder()->update('customers')->set('deleted_at', 'NOW()')
            ->where('id = :id')->andWhere('deleted_at IS NULL')->setParameter('id', $id)->executeStatement() > 0;
    }

    private function baseQuery(): \Doctrine\DBAL\Query\QueryBuilder
    {
        return $this->connection->createQueryBuilder()->select('customer.*', 'type.name AS customer_type', 'license.name AS license_type')
            ->from('customers', 'customer')
            ->leftJoin('customer', 'customer_types', 'type', 'type.id = customer.customer_type_id')
            ->leftJoin('customer', 'license_types', 'license', 'license.id = customer.license_type_id');
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    private function values(array $input): array
    {
        $values = [];
        foreach (self::COLUMNS as $column) {
            $value = $input[$column] ?? null;
            if (in_array($column, ['customer_type_id', 'license_type_id'], true)) {
                $values[$column] = $value === null || $value === '' ? null : (int) $value;
            } else {
                $values[$column] = $value === null || $value === '' ? null : (is_string($value) ? trim($value) : $value);
            }
        }
        $values['customer_type_id'] = (int) $input['customer_type_id'];
        $values['nationality'] = trim((string) $input['nationality']);

        return $values;
    }

    /** @param array<string, mixed> $values */
    private function insert(string $table, array $values): void
    {
        $builder = $this->connection->createQueryBuilder()->insert($table);
        foreach ($values as $column => $value) $builder->setValue($column, ':'.$column)->setParameter($column, $value);
        $builder->executeStatement();
    }
}
