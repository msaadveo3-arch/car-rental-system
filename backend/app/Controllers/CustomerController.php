<?php

namespace App\Controllers;

use App\Database;

class CustomerController
{
    /** يجيب العميل كامل بأسماء الـ lookups */
    private function fetchJoined(\PDO $pdo, int $id): array
    {
        $stmt = $pdo->prepare(
            'SELECT c.*, ct.name AS customer_type, lt.name AS license_type
             FROM customers c
             LEFT JOIN customer_types ct ON ct.id = c.customer_type_id
             LEFT JOIN license_types lt ON lt.id = c.license_type_id
             WHERE c.id = ?'
        );
        $stmt->execute([$id]);

        return $stmt->fetch();
    }

    /** GET /api/customers */
    public function index(): void
    {
        $customers = Database::connection()
            ->query(
                'SELECT c.*, ct.name AS customer_type, lt.name AS license_type
                 FROM customers c
                 LEFT JOIN customer_types ct ON ct.id = c.customer_type_id
                 LEFT JOIN license_types lt ON lt.id = c.license_type_id
                 WHERE c.deleted_at IS NULL
                 ORDER BY c.id DESC'
            )
            ->fetchAll();

        json_response(['success' => true, 'data' => $customers]);
    }

    /** POST /api/customers */
    public function store(): void
    {
        $input = json_input();

        foreach (['name', 'phone', 'email', 'gender', 'nationality', 'birth_date', 'job'] as $field) {
            if (empty(trim((string) ($input[$field] ?? '')))) {
                json_response(['success' => false, 'message' => "Field '{$field}' is required"], 422);
            }
        }
        if (empty($input['customer_type_id'])) {
            json_response(['success' => false, 'message' => "Field 'customer_type' is required"], 422);
        }

        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO customers (name, phone, email, customer_type_id, national_id, id_issue_date, id_expiry_date,
                                    nationality, gender, birth_date, job, license_type_id, license_number,
                                    license_issue_date, license_expiry_date, address, notes,
                                    residential_no, postal_code, address_1, address_2)
             VALUES (:name, :phone, :email, :customer_type_id, :national_id, :id_issue_date, :id_expiry_date,
                     :nationality, :gender, :birth_date, :job, :license_type_id, :license_number,
                     :license_issue_date, :license_expiry_date, :address, :notes,
                     :residential_no, :postal_code, :address_1, :address_2)'
        );

        $stmt->execute([
            ':name'                => trim($input['name']),
            ':phone'               => trim($input['phone']),
            ':email'               => nullable($input['email'] ?? null),
            ':customer_type_id'    => (int) $input['customer_type_id'],
            ':national_id'         => nullable($input['national_id'] ?? null),
            ':id_issue_date'       => nullable($input['id_issue_date'] ?? null),
            ':id_expiry_date'      => nullable($input['id_expiry_date'] ?? null),
            ':nationality'         => trim((string) ($input['nationality'] ?? 'Unknown')),
            ':gender'              => nullable($input['gender'] ?? null),
            ':birth_date'          => nullable($input['birth_date'] ?? null),
            ':job'                 => nullable($input['job'] ?? null),
            ':license_type_id'     => nullable_int($input['license_type_id'] ?? null),
            ':license_number'      => nullable($input['license_number'] ?? null),
            ':license_issue_date'  => nullable($input['license_issue_date'] ?? null),
            ':license_expiry_date' => nullable($input['license_expiry_date'] ?? null),
            ':address'             => nullable($input['address'] ?? null),
            ':notes'               => nullable($input['notes'] ?? null),
            ':residential_no'      => nullable($input['residential_no'] ?? null),
            ':postal_code'         => nullable($input['postal_code'] ?? null),
            ':address_1'           => nullable($input['address_1'] ?? null),
            ':address_2'           => nullable($input['address_2'] ?? null),
        ]);

        $new = $this->fetchJoined($pdo, (int) $pdo->lastInsertId());

        json_response(['success' => true, 'data' => $new], 201);
    }

    /** PUT /api/customers/{id} */
    public function update(string $id): void
    {
        $input = json_input();
        $pdo = Database::connection();

        $check = $pdo->prepare('SELECT id FROM customers WHERE id = ? AND deleted_at IS NULL');
        $check->execute([(int) $id]);
        if (!$check->fetch()) {
            json_response(['success' => false, 'message' => 'Customer not found'], 404);
        }

        foreach (['name', 'phone', 'email', 'gender', 'nationality', 'birth_date', 'job'] as $field) {
            if (empty(trim((string) ($input[$field] ?? '')))) {
                json_response(['success' => false, 'message' => "Field '{$field}' is required"], 422);
            }
        }
        if (empty($input['customer_type_id'])) {
            json_response(['success' => false, 'message' => "Field 'customer_type' is required"], 422);
        }

        $stmt = $pdo->prepare(
            'UPDATE customers
             SET name = :name, phone = :phone, email = :email,
                 customer_type_id = :customer_type_id, national_id = :national_id,
                 id_issue_date = :id_issue_date, id_expiry_date = :id_expiry_date,
                 nationality = :nationality, gender = :gender, birth_date = :birth_date, job = :job,
                 license_type_id = :license_type_id, license_number = :license_number,
                 license_issue_date = :license_issue_date, license_expiry_date = :license_expiry_date,
                 address = :address, notes = :notes,
                 residential_no = :residential_no, postal_code = :postal_code,
                 address_1 = :address_1, address_2 = :address_2
             WHERE id = :id'
        );

        $stmt->execute([
            ':name'                => trim($input['name']),
            ':phone'               => trim($input['phone']),
            ':email'               => nullable($input['email'] ?? null),
            ':customer_type_id'    => (int) $input['customer_type_id'],
            ':national_id'         => nullable($input['national_id'] ?? null),
            ':id_issue_date'       => nullable($input['id_issue_date'] ?? null),
            ':id_expiry_date'      => nullable($input['id_expiry_date'] ?? null),
            ':nationality'         => trim((string) ($input['nationality'] ?? 'Unknown')),
            ':gender'              => nullable($input['gender'] ?? null),
            ':birth_date'          => nullable($input['birth_date'] ?? null),
            ':job'                 => nullable($input['job'] ?? null),
            ':license_type_id'     => nullable_int($input['license_type_id'] ?? null),
            ':license_number'      => nullable($input['license_number'] ?? null),
            ':license_issue_date'  => nullable($input['license_issue_date'] ?? null),
            ':license_expiry_date' => nullable($input['license_expiry_date'] ?? null),
            ':address'             => nullable($input['address'] ?? null),
            ':notes'               => nullable($input['notes'] ?? null),
            ':residential_no'      => nullable($input['residential_no'] ?? null),
            ':postal_code'         => nullable($input['postal_code'] ?? null),
            ':address_1'           => nullable($input['address_1'] ?? null),
            ':address_2'           => nullable($input['address_2'] ?? null),
            ':id'                  => (int) $id,
        ]);

        $new = $this->fetchJoined($pdo, (int) $id);

        json_response(['success' => true, 'data' => $new]);
    }

    /** DELETE /api/customers/{id} — حذف آمن (Soft Delete) */
    public function destroy(string $id): void
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('UPDATE customers SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL');
        $stmt->execute([(int) $id]);

        if ($stmt->rowCount() === 0) {
            json_response(['success' => false, 'message' => 'Customer not found'], 404);
        }

        json_response(['success' => true, 'message' => 'Customer soft-deleted']);
    }
}