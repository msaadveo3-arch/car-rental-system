<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\PricingApiRepository;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
final class TariffController extends AbstractController
{
    public function __construct(private readonly PricingApiRepository $pricing) {}

    #[Route('/tariffs', methods: ['GET'])]
    public function index(): JsonResponse { return $this->json(['success' => true, 'data' => $this->pricing->tariffs()]); }

    #[Route('/tariffs', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $input = $request->toArray(); $name = trim((string) ($input['name'] ?? ''));
        if ($name === '') return $this->json(['success' => false, 'message' => 'Name is required'], 422);
        try { $id = $this->pricing->createTariff($name, $this->nullable($input['description'] ?? null), $this->user()->getId()); }
        catch (UniqueConstraintViolationException) { return $this->json(['success' => false, 'message' => 'This tariff already exists'], 409); }
        return $this->json(['success' => true, 'data' => ['id' => $id]], Response::HTTP_CREATED);
    }

    #[Route('/tariffs/{id}', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        if (!$this->pricing->exists('tariffs', $id)) return $this->json(['success' => false, 'message' => 'Tariff not found'], 404);
        $input = $request->toArray(); $values = [];
        if (isset($input['name']) && trim((string) $input['name']) !== '') $values['name'] = trim((string) $input['name']);
        if (array_key_exists('description', $input)) $values['description'] = $this->nullable($input['description']);
        if (array_key_exists('status', $input)) { if (!in_array($input['status'], ['active', 'inactive'], true)) return $this->json(['success' => false, 'message' => 'Invalid status'], 422); $values['status'] = $input['status']; }
        if ($values === []) return $this->json(['success' => false, 'message' => 'Nothing to update'], 422);
        try { $this->pricing->updateTariff($id, $values, $this->user()->getId()); }
        catch (UniqueConstraintViolationException) { return $this->json(['success' => false, 'message' => 'This tariff already exists'], 409); }
        return $this->json(['success' => true]);
    }

    #[Route('/tariffs/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        if (!$this->pricing->exists('tariffs', $id)) return $this->json(['success' => false, 'message' => 'Tariff not found'], 404);
        if ($this->pricing->tariffHasDetails($id)) return $this->json(['success' => false, 'message' => 'Cannot delete: tariff has price lines'], 409);
        $this->pricing->delete('tariffs', $id); return $this->json(['success' => true]);
    }

    #[Route('/tariff-details', methods: ['GET'])]
    public function details(): JsonResponse { return $this->json(['success' => true, 'data' => $this->pricing->tariffDetails()]); }

    #[Route('/tariff-details', methods: ['POST'])]
    public function createDetail(Request $request): JsonResponse
    {
        $input = $request->toArray();
        foreach (['tariff_id', 'group_id', 'pricing_mode_id', 'rental_type_id'] as $field) if ((int) ($input[$field] ?? 0) < 1) return $this->json(['success' => false, 'message' => 'Tariff, group, pricing mode and rental type are required'], 422);
        $rack = (float) ($input['rack_rate'] ?? 0); $floor = (float) ($input['floor_rate'] ?? 0);
        if ($rack <= 0 || $floor <= 0 || $floor > $rack) return $this->json(['success' => false, 'message' => 'Rates must be positive and floor cannot exceed rack'], 422);
        $values = ['tariff_id' => (int) $input['tariff_id'], 'group_id' => (int) $input['group_id'], 'branch_id' => empty($input['branch_id']) ? null : (int) $input['branch_id'], 'pricing_mode_id' => (int) $input['pricing_mode_id'], 'rental_type_id' => (int) $input['rental_type_id'], 'rack_rate' => $rack, 'floor_rate' => $floor, 'is_default' => !empty($input['is_default']) ? 1 : 0];
        try { $id = $this->pricing->createTariffDetail($values, $this->user()->getId()); }
        catch (UniqueConstraintViolationException) { return $this->json(['success' => false, 'message' => 'This combination already exists'], 409); }
        catch (ForeignKeyConstraintViolationException) { return $this->json(['success' => false, 'message' => 'A referenced value does not exist'], 422); }
        return $this->json(['success' => true, 'data' => ['id' => $id]], Response::HTTP_CREATED);
    }

    #[Route('/tariff-details/{id}', methods: ['PUT'])]
    public function updateDetail(Request $request, int $id): JsonResponse
    {
        $current = $this->pricing->tariffDetail($id);
        if ($current === null) return $this->json(['success' => false, 'message' => 'Tariff detail not found'], 404);
        $input = $request->toArray(); $values = [];
        foreach (['rack_rate', 'floor_rate'] as $field) if (array_key_exists($field, $input)) { if (!is_numeric($input[$field]) || (float) $input[$field] <= 0) return $this->json(['success' => false, 'message' => 'Rates must be positive'], 422); $values[$field] = (float) $input[$field]; }
        $effectiveRack = $values['rack_rate'] ?? (float) $current['rack_rate'];
        $effectiveFloor = $values['floor_rate'] ?? (float) $current['floor_rate'];
        if ($effectiveFloor > $effectiveRack) return $this->json(['success' => false, 'message' => 'Floor rate cannot exceed rack rate'], 422);
        if (array_key_exists('is_default', $input)) $values['is_default'] = !empty($input['is_default']) ? 1 : 0;
        if (array_key_exists('status', $input)) { if (!in_array($input['status'], ['active', 'inactive'], true)) return $this->json(['success' => false, 'message' => 'Invalid status'], 422); $values['status'] = $input['status']; }
        if ($values === []) return $this->json(['success' => false, 'message' => 'Nothing to update'], 422);
        $this->pricing->updateTariffDetail($id, $values, $this->user()->getId()); return $this->json(['success' => true]);
    }

    #[Route('/tariff-details/{id}', methods: ['DELETE'])]
    public function deleteDetail(int $id): JsonResponse { return $this->pricing->delete('tariff_details', $id) ? $this->json(['success' => true]) : $this->json(['success' => false, 'message' => 'Tariff detail not found'], 404); }

    private function user(): User { $user = $this->getUser(); if (!$user instanceof User) throw $this->createAccessDeniedException(); return $user; }
    private function nullable(mixed $value): ?string { $value = trim((string) ($value ?? '')); return $value === '' ? null : $value; }
}
