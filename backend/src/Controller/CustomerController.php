<?php

namespace App\Controller;

use App\Repository\CustomerApiRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/customers')]
final class CustomerController extends AbstractController
{
    public function __construct(private readonly CustomerApiRepository $customers) {}

    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse { return $this->json(['success' => true, 'data' => $this->customers->findAll()]); }

    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $input = $request->toArray();
        if ($error = $this->validateInput($input)) {
            return $this->json(['success' => false, 'message' => $error], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        try {
            $id = $this->customers->create($input);
        } catch (UniqueConstraintViolationException) {
            return $this->json(['success' => false, 'message' => 'Phone, email, national ID, or licence number already exists'], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true, 'data' => $this->customers->find($id)], Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        if (!$this->customers->exists($id)) {
            return $this->json(['success' => false, 'message' => 'Customer not found'], Response::HTTP_NOT_FOUND);
        }
        $input = $request->toArray();
        if ($error = $this->validateInput($input)) {
            return $this->json(['success' => false, 'message' => $error], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        try {
            $this->customers->update($id, $input);
        } catch (UniqueConstraintViolationException) {
            return $this->json(['success' => false, 'message' => 'Phone, email, national ID, or licence number already exists'], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true, 'data' => $this->customers->find($id)]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        if (!$this->customers->softDelete($id)) {
            return $this->json(['success' => false, 'message' => 'Customer not found'], Response::HTTP_NOT_FOUND);
        }
        return $this->json(['success' => true, 'message' => 'Customer soft-deleted']);
    }

    /** @param array<string, mixed> $input */
    private function validateInput(array $input): ?string
    {
        foreach (['name', 'phone', 'email', 'gender', 'nationality', 'birth_date', 'job'] as $field) {
            if (trim((string) ($input[$field] ?? '')) === '') return "Field '{$field}' is required";
        }
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) return 'Email is invalid';
        if ((int) ($input['customer_type_id'] ?? 0) < 1) return "Field 'customer_type' is required";
        return null;
    }
}
