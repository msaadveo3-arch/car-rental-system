<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\FleetApiRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
final class CarController extends AbstractController
{
    public function __construct(private readonly FleetApiRepository $fleet) {}

    #[Route('/cars', methods: ['GET'])]
    public function index(): JsonResponse { return $this->json(['success' => true, 'data' => $this->fleet->findCars()]); }

    #[Route('/car-models', methods: ['GET'])]
    public function models(): JsonResponse { return $this->json(['success' => true, 'data' => $this->fleet->findModels()]); }

    #[Route('/lookups', methods: ['GET'])]
    public function lookups(): JsonResponse { return $this->json(['success' => true, 'data' => $this->fleet->activeLookups()]); }

    #[Route('/cars', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $input = $request->toArray();
        if (trim((string) ($input['plate_number'] ?? '')) === '' || (int) ($input['year'] ?? 0) < 1900) {
            return $this->json(['success' => false, 'message' => 'A valid plate number and year are required'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if ((int) ($input['make_id'] ?? 0) < 1 || (int) ($input['vehicle_model_id'] ?? 0) < 1) {
            return $this->json(['success' => false, 'message' => 'Make and model are required'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $id = $this->fleet->create($input, $this->user()->getId());
        } catch (UniqueConstraintViolationException) {
            return $this->json(['success' => false, 'message' => 'Plate number, VIN, or registration number already exists'], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true, 'data' => ['id' => $id]], Response::HTTP_CREATED);
    }

    #[Route('/cars/{id}', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        if (!$this->fleet->exists($id)) {
            return $this->json(['success' => false, 'message' => 'Car not found'], Response::HTTP_NOT_FOUND);
        }
        $input = $request->toArray();
        if (trim((string) ($input['plate_number'] ?? '')) === '' || (int) ($input['year'] ?? 0) < 1900) {
            return $this->json(['success' => false, 'message' => 'A valid plate number and year are required'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if ((int) ($input['make_id'] ?? 0) < 1 || (int) ($input['vehicle_model_id'] ?? 0) < 1) {
            return $this->json(['success' => false, 'message' => 'Make and model are required'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $this->fleet->update($id, $input, $this->user()->getId());
        } catch (UniqueConstraintViolationException) {
            return $this->json(['success' => false, 'message' => 'Plate number, VIN, or registration number already exists'], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true]);
    }

    #[Route('/cars/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        if (!$this->fleet->softDelete($id)) {
            return $this->json(['success' => false, 'message' => 'Car not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['success' => true, 'message' => 'Car soft-deleted']);
    }

    private function user(): User
    {
        $user = $this->getUser();
        if (!$user instanceof User) throw $this->createAccessDeniedException();
        return $user;
    }
}
