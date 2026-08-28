<?php

namespace App\Controller;

use App\Entity\User;
use App\Exception\ApiProblem;
use App\Repository\RentalApiRepository;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/rentals')]
final class RentalController extends AbstractController
{
    public function __construct(private readonly RentalApiRepository $rentals) {}

    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse { return $this->json(['success' => true, 'data' => $this->rentals->findAll()]); }

    #[Route('/{id}', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $rental = $this->rentals->findDetails($id);
        return $rental === null ? $this->json(['success' => false, 'message' => 'Rental not found'], 404) : $this->json(['success' => true, 'data' => $rental]);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $input = $request->toArray();
        if ((int) ($input['customer_id'] ?? 0) < 1 || (int) ($input['car_id'] ?? 0) < 1 || empty($input['start_date']) || empty($input['end_date'])) {
            return $this->json(['success' => false, 'message' => 'Customer, car, start and end dates are required'], 422);
        }
        $start = strtotime((string) $input['start_date']); $end = strtotime((string) $input['end_date']);
        if ($start === false || $end === false || $end <= $start) return $this->json(['success' => false, 'message' => 'End date must be after start date'], 422);
        try { $data = $this->rentals->create($input, $this->user()->getId()); }
        catch (ApiProblem $problem) { return $this->json(['success' => false, 'message' => $problem->getMessage()], $problem->status); }
        catch (ForeignKeyConstraintViolationException) { return $this->json(['success' => false, 'message' => 'A referenced value does not exist'], 422); }
        return $this->json(['success' => true, 'data' => $data], Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $input = $request->toArray(); $status = (string) ($input['status'] ?? '');
        if (!in_array($status, ['booked', 'active', 'returned', 'completed', 'cancelled'], true)) return $this->json(['success' => false, 'message' => 'Invalid status'], 422);
        $user = $this->user();
        if ($status === 'active' && $user->getRole() !== 'inspector') return $this->json(['success' => false, 'message' => 'Only the inspector can activate a contract after inspection'], 403);
        try { $this->rentals->updateStatus($id, $status, $input, $user->getId()); }
        catch (ApiProblem $problem) { return $this->json(['success' => false, 'message' => $problem->getMessage()], $problem->status); }
        return $this->json(['success' => true]);
    }

    private function user(): User { $user = $this->getUser(); if (!$user instanceof User) throw $this->createAccessDeniedException(); return $user; }
}
