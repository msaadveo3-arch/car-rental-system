<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\LookupRepository;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/lookups')]
final class LookupController extends AbstractController
{
    public function __construct(private readonly LookupRepository $lookups) {}

    #[Route('/{type}', methods: ['GET'])]
    public function index(string $type): JsonResponse
    {
        if (!$this->lookups->supports($type)) {
            return $this->unknownType();
        }

        return $this->json(['success' => true, 'data' => $this->lookups->findAll($type)]);
    }

    #[Route('/{type}', methods: ['POST'])]
    public function create(Request $request, string $type): JsonResponse
    {
        if (!$this->lookups->supports($type)) {
            return $this->unknownType();
        }

        $input = $request->toArray();
        $error = $this->validate($type, $input, true);
        if ($error !== null) {
            return $this->json(['success' => false, 'message' => $error], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = $this->user();
        $values = $this->values($type, $input, true);
        $values['created_by'] = $user->getId();
        $values['updated_by'] = $user->getId();

        try {
            $id = $this->lookups->insert($type, $values);
        } catch (UniqueConstraintViolationException) {
            return $this->json(['success' => false, 'message' => 'This value already exists'], Response::HTTP_CONFLICT);
        } catch (ForeignKeyConstraintViolationException) {
            return $this->json(['success' => false, 'message' => 'A referenced value does not exist'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $this->json(['success' => true, 'data' => ['id' => $id]], Response::HTTP_CREATED);
    }

    #[Route('/{type}/{id}', methods: ['PUT'])]
    public function update(Request $request, string $type, int $id): JsonResponse
    {
        if (!$this->lookups->supports($type)) {
            return $this->unknownType();
        }
        if (!$this->lookups->exists($type, $id)) {
            return $this->json(['success' => false, 'message' => 'Lookup value not found'], Response::HTTP_NOT_FOUND);
        }

        $input = $request->toArray();
        $error = $this->validate($type, $input, false, $this->lookups->find($type, $id));
        if ($error !== null) {
            return $this->json(['success' => false, 'message' => $error], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $values = $this->values($type, $input, false);
        if ($values === []) {
            return $this->json(['success' => false, 'message' => 'Nothing to update'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $values['updated_by'] = $this->user()->getId();

        try {
            $this->lookups->update($type, $id, $values);
        } catch (UniqueConstraintViolationException) {
            return $this->json(['success' => false, 'message' => 'This value already exists'], Response::HTTP_CONFLICT);
        } catch (ForeignKeyConstraintViolationException) {
            return $this->json(['success' => false, 'message' => 'A referenced value does not exist'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $this->json(['success' => true]);
    }

    #[Route('/{type}/{id}', methods: ['DELETE'])]
    public function delete(string $type, int $id): JsonResponse
    {
        if (!$this->lookups->supports($type)) {
            return $this->unknownType();
        }
        if (!$this->lookups->exists($type, $id)) {
            return $this->json(['success' => false, 'message' => 'Lookup value not found'], Response::HTTP_NOT_FOUND);
        }
        if ($this->lookups->isInUse($type, $id)) {
            return $this->json(['success' => false, 'message' => 'Cannot delete: this value is in use'], Response::HTTP_CONFLICT);
        }

        try {
            $this->lookups->delete($type, $id);
        } catch (ForeignKeyConstraintViolationException) {
            return $this->json(['success' => false, 'message' => 'Cannot delete: this value is in use'], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true, 'message' => 'Deleted']);
    }

    /** @param array<string, mixed> $input */
    private function validate(string $type, array $input, bool $creating, ?array $current = null): ?string
    {
        if ($creating && trim((string) ($input['name'] ?? '')) === '') {
            return 'Name is required';
        }
        if ($type === 'vehicle_models' && $creating && (int) ($input['make_id'] ?? 0) < 1) {
            return 'Vehicle make is required';
        }
        if ($type === 'vehicle_models' && array_key_exists('make_id', $input) && (int) $input['make_id'] < 1) {
            return 'Vehicle make is required';
        }
        if (isset($input['status']) && !in_array($input['status'], ['active', 'inactive'], true)) {
            return 'Status must be active or inactive';
        }
        if (isset($input['rate']) && (!is_numeric($input['rate']) || (float) $input['rate'] <= 0)) {
            return 'Rate must be a positive number';
        }
        foreach (['min_days', 'max_days'] as $field) {
            if (isset($input[$field]) && (!is_numeric($input[$field]) || (int) $input[$field] < 1)) {
                return $field.' must be a positive integer';
            }
        }
        $min = isset($input['min_days']) ? (int) $input['min_days'] : (isset($current['min_days']) ? (int) $current['min_days'] : null);
        $max = isset($input['max_days']) ? (int) $input['max_days'] : (isset($current['max_days']) ? (int) $current['max_days'] : null);
        if ($min !== null && $max !== null && $max < $min) {
            return 'max_days cannot be less than min_days';
        }

        return null;
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    private function values(string $type, array $input, bool $creating): array
    {
        $values = [];
        if (array_key_exists('name', $input) && trim((string) $input['name']) !== '') {
            $values['name'] = trim((string) $input['name']);
        }
        if (!$creating && array_key_exists('status', $input)) {
            $values['status'] = $input['status'];
        }
        foreach ($this->lookups->extraColumns($type) as $column) {
            if (!array_key_exists($column, $input) || $input[$column] === '') {
                continue;
            }
            $values[$column] = match ($column) {
                'rate' => (float) $input[$column],
                'make_id', 'min_days', 'max_days' => (int) $input[$column],
                default => trim((string) $input[$column]),
            };
        }

        return $values;
    }

    private function user(): User
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException();
        }

        return $user;
    }

    private function unknownType(): JsonResponse
    {
        return $this->json(['success' => false, 'message' => 'Unknown lookup type'], Response::HTTP_NOT_FOUND);
    }
}
