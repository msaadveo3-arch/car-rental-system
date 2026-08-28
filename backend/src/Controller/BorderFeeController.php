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

#[Route('/api/border-fees')]
final class BorderFeeController extends AbstractController
{
    public function __construct(private readonly PricingApiRepository $pricing) {}
    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse { return $this->json(['success' => true, 'data' => $this->pricing->borderFees()]); }
    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $input = $request->toArray(); $border = (int) ($input['border_id'] ?? 0); $group = (int) ($input['group_id'] ?? 0);
        if ($border < 1 || $group < 1 || !is_numeric($input['fee'] ?? null) || (float) $input['fee'] < 0) return $this->json(['success' => false, 'message' => 'Valid border, group and fee are required'], 422);
        try { $id = $this->pricing->createBorderFee($border, $group, (float) $input['fee'], $this->user()->getId()); }
        catch (UniqueConstraintViolationException) { return $this->json(['success' => false, 'message' => 'This border/group combination already exists'], 409); }
        catch (ForeignKeyConstraintViolationException) { return $this->json(['success' => false, 'message' => 'Border or group does not exist'], 422); }
        return $this->json(['success' => true, 'data' => ['id' => $id]], Response::HTTP_CREATED);
    }
    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        if (!$this->pricing->exists('border_fees', $id)) return $this->json(['success' => false, 'message' => 'Border fee not found'], 404);
        $input = $request->toArray(); if (!is_numeric($input['fee'] ?? null) || (float) $input['fee'] < 0) return $this->json(['success' => false, 'message' => 'A non-negative fee is required'], 422);
        $this->pricing->updateBorderFee($id, (float) $input['fee'], $this->user()->getId());
        return $this->json(['success' => true]);
    }
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse { return $this->pricing->delete('border_fees', $id) ? $this->json(['success' => true]) : $this->json(['success' => false, 'message' => 'Border fee not found'], 404); }
    private function user(): User { $user = $this->getUser(); if (!$user instanceof User) throw $this->createAccessDeniedException(); return $user; }
}
