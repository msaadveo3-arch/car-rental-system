<?php

namespace App\Controller;

use App\Entity\ApiToken;
use App\Entity\User;
use App\Repository\ApiTokenRepository;
use App\Repository\UserRepository;
use App\Security\ApiTokenAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/auth')]
final class AuthController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $users,
        private readonly ApiTokenRepository $tokens,
        private readonly UserPasswordHasherInterface $passwordHasher,
        #[Autowire(service: 'limiter.login')]
        private readonly RateLimiterFactory $loginLimiter,
    ) {}

    #[Route('/login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $payload = $request->toArray();
        $identifier = trim((string) ($payload['email'] ?? $payload['username'] ?? ''));
        $password = (string) ($payload['password'] ?? '');

        if ($identifier === '' || $password === '') {
            return $this->json(['success' => false, 'message' => 'Username and password are required'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $limiter = $this->loginLimiter->create(($request->getClientIp() ?? 'unknown').'|'.mb_strtolower($identifier));
        $limit = $limiter->consume();
        if (!$limit->isAccepted()) {
            $retryAfter = max(1, $limit->getRetryAfter()->getTimestamp() - time());

            return $this->json(
                ['success' => false, 'message' => 'Too many login attempts. Try again later.'],
                Response::HTTP_TOO_MANY_REQUESTS,
                ['Retry-After' => (string) $retryAfter],
            );
        }

        $user = $this->users->findOneByIdentifier($identifier);
        if (!$user instanceof User || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return $this->json(['success' => false, 'message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        $limiter->reset();
        if ($this->passwordHasher->needsRehash($user)) {
            $this->users->upgradePassword($user, $this->passwordHasher->hashPassword($user, $password));
        }

        $token = bin2hex(random_bytes(32));
        $apiToken = (new ApiToken())
            ->setUser($user)
            ->setTokenHash(hash('sha256', $token))
            ->setExpiresAt(new \DateTime('+1 day'))
            ->setCreatedAt(new \DateTime());
        $this->entityManager->persist($apiToken);
        $this->entityManager->flush();

        return $this->json(['success' => true, 'token' => $token, 'user' => $this->userPayload($user)]);
    }

    #[Route('/logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $token = ApiTokenAuthenticator::rawToken($request);
        if ($token === null) {
            return $this->json(['success' => false, 'message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $this->tokens->deleteByRawToken($token);

        return $this->json(['success' => true]);
    }

    #[Route('/me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['success' => false, 'message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['success' => true, 'user' => $this->userPayload($user)]);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'full_name' => $user->getFullName(),
            'email' => $user->getEmail(),
            'role' => $user->getRole(),
            'avatar_url' => $user->getAvatarUrl(),
        ];
    }
}
