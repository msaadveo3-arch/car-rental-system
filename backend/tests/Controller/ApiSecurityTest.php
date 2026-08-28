<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class ApiSecurityTest extends WebTestCase
{
    public function testProtectedEndpointRejectsAnonymousRequestWithJson(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/cars', server: ['HTTP_ACCEPT' => 'application/json']);

        self::assertResponseStatusCodeSame(401);
        self::assertResponseHeaderSame('content-type', 'application/json');
        self::assertJsonStringEqualsJsonString(
            '{"success":false,"message":"Unauthorized"}',
            (string) $client->getResponse()->getContent(),
        );
    }

    public function testLoginValidatesRequiredFieldsBeforeDatabaseLookup(): void
    {
        $client = static::createClient();
        $client->jsonRequest('POST', '/api/auth/login', []);

        self::assertResponseStatusCodeSame(422);
        self::assertResponseFormatSame('json');
    }

    public function testMalformedJsonReturnsJsonBadRequest(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/auth/login', server: ['CONTENT_TYPE' => 'application/json'], content: '{broken');

        self::assertResponseStatusCodeSame(400);
        self::assertResponseFormatSame('json');
    }
}
