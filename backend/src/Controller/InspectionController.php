<?php

namespace App\Controller;

use App\Entity\User;
use App\Exception\ApiProblem;
use App\Repository\RentalApiRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/inspections/pickup')]
final class InspectionController extends AbstractController
{
    public function __construct(private readonly RentalApiRepository $rentals) {}
    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse { return $this->json(['success' => true, 'data' => $this->rentals->pickupInspections()]); }
    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->user();
        if ($user->getRole() !== 'inspector') return $this->json(['success' => false, 'message' => 'Only the inspector can save pickup inspections'], 403);
        $input = $request->toArray(); $rentalId = (int) ($input['rental_id'] ?? 0);
        if ($rentalId < 1) return $this->json(['success' => false, 'message' => 'rental_id is required'], 422);
        if (isset($input['damage_report']) && !is_array($input['damage_report'])) return $this->json(['success' => false, 'message' => 'damage_report must be an array'], 422);
        if (isset($input['photos']) && !is_array($input['photos'])) return $this->json(['success' => false, 'message' => 'photos must be an array'], 422);
        try { $id = $this->rentals->createPickupInspection($rentalId, $input, $user->getId()); }
        catch (ApiProblem $problem) { return $this->json(['success' => false, 'message' => $problem->getMessage()], $problem->status); }
        catch (UniqueConstraintViolationException) { return $this->json(['success' => false, 'message' => 'Pickup inspection already exists'], 409); }
        return $this->json(['success' => true, 'data' => ['id' => $id], 'message' => 'Inspection saved — contract activated'], Response::HTTP_CREATED);
    }
    private function user(): User { $user = $this->getUser(); if (!$user instanceof User) throw $this->createAccessDeniedException(); return $user; }
}
