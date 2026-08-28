<?php

namespace App\Tests\Security;

use App\Security\ApiTokenAuthenticator;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;

final class ApiTokenAuthenticatorTest extends TestCase
{
    #[DataProvider('bearerHeaders')]
    public function testBearerTokenParsing(string $header, ?string $expected): void
    {
        $request = Request::create('/api/me');
        if ($header !== '') $request->headers->set('Authorization', $header);

        self::assertSame($expected, ApiTokenAuthenticator::rawToken($request));
    }

    public static function bearerHeaders(): iterable
    {
        yield 'standard' => ['Bearer abc123', 'abc123'];
        yield 'case insensitive' => ['bearer abc123', 'abc123'];
        yield 'extra whitespace' => ['Bearer   abc123  ', 'abc123'];
        yield 'missing' => ['', null];
        yield 'wrong scheme' => ['Basic abc123', null];
        yield 'empty token' => ['Bearer ', null];
    }
}
