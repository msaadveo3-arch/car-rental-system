<?php

namespace App\Security;

use App\Repository\ApiTokenRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;

final class ApiTokenAuthenticator extends AbstractAuthenticator implements AuthenticationEntryPointInterface
{
    public function __construct(private readonly ApiTokenRepository $tokens) {}

    public function supports(Request $request): ?bool
    {
        return $this->rawToken($request) !== null;
    }

    public function authenticate(Request $request): Passport
    {
        $rawToken = $this->rawToken($request);
        if ($rawToken === null) {
            throw new AuthenticationException('Missing bearer token.');
        }

        return new SelfValidatingPassport(new UserBadge(hash('sha256', $rawToken), function () use ($rawToken) {
            $token = $this->tokens->findValidByRawToken($rawToken);
            if ($token === null) {
                throw new UserNotFoundException('Invalid or expired bearer token.');
            }

            return $token->getUser();
        }));
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse(['success' => false, 'message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    public function start(Request $request, ?AuthenticationException $authException = null): Response
    {
        return new JsonResponse(['success' => false, 'message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    public static function rawToken(Request $request): ?string
    {
        $header = trim($request->headers->get('Authorization', ''));
        if (!preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
            return null;
        }

        return trim($matches[1]) ?: null;
    }
}
