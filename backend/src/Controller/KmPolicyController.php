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

#[Route('/api/km-policies')]
final class KmPolicyController extends AbstractController
{
    public function __construct(private readonly PricingApiRepository $pricing) {}
    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse { return $this->json(['success' => true, 'data' => $this->pricing->kmPolicies()]); }
    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $input = $request->toArray(); $type = (int) ($input['rental_type_id'] ?? 0); $group = (int) ($input['group_id'] ?? 0);
        if ($type < 1 || $group < 1) return $this->json(['success' => false, 'message' => 'Rental type and vehicle group are required'], 422);
        if (isset($input['status']) && !in_array($input['status'], ['active', 'inactive'], true)) return $this->json(['success' => false, 'message' => 'Invalid status'], 422);
        $values = $this->values($input, true);
        try { $id = $this->pricing->createKmPolicy(array_merge(['rental_type_id' => $type, 'group_id' => $group], $values), $this->user()->getId()); }
        catch (UniqueConstraintViolationException) { return $this->json(['success' => false, 'message' => 'This combination already exists'], 409); }
        catch (ForeignKeyConstraintViolationException) { return $this->json(['success' => false, 'message' => 'Rental type or vehicle group does not exist'], 422); }
        return $this->json(['success' => true, 'data' => ['id' => $id]], Response::HTTP_CREATED);
    }
    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        if (!$this->pricing->exists('km_policies', $id)) return $this->json(['success' => false, 'message' => 'Kilometre policy not found'], 404);
        $input = $request->toArray();
        if (isset($input['status']) && !in_array($input['status'], ['active', 'inactive'], true)) return $this->json(['success' => false, 'message' => 'Invalid status'], 422);
        $values = $this->values($input, false); if ($values === []) return $this->json(['success' => false, 'message' => 'Nothing to update'], 422);
        $this->pricing->updateKmPolicy($id, $values, $this->user()->getId()); return $this->json(['success' => true]);
    }
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse { return $this->pricing->delete('km_policies', $id) ? $this->json(['success' => true]) : $this->json(['success' => false, 'message' => 'Kilometre policy not found'], 404); }
    /** @param array<string,mixed> $input @return array<string,mixed> */
    private function values(array $input, bool $creating): array
    {
        $values = [];
        foreach (['max_km' => 'int', 'extra_km_rate' => 'float', 'unlimited_daily_amount' => 'float'] as $field => $type) {
            if ($creating || array_key_exists($field, $input)) $values[$field] = $type === 'int' ? max(0, (int) ($input[$field] ?? 0)) : max(0, (float) ($input[$field] ?? 0));
        }
        if (array_key_exists('status', $input)) $values['status'] = $input['status'];
        return $values;
    }
    private function user(): User { $user = $this->getUser(); if (!$user instanceof User) throw $this->createAccessDeniedException(); return $user; }
}
