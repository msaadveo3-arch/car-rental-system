<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Routing\RouterInterface;

final class RouteRegistrationTest extends KernelTestCase
{
    public function testCompleteApiSurfaceIsRegistered(): void
    {
        self::bootKernel();
        $router = static::getContainer()->get(RouterInterface::class);
        $paths = [];
        foreach ($router->getRouteCollection() as $route) {
            if (str_starts_with($route->getPath(), '/api')) {
                $paths[] = implode('|', $route->getMethods()).' '.$route->getPath();
            }
        }

        self::assertCount(39, $paths);
        foreach ([
            'POST /api/auth/login', 'GET /api/cars', 'GET /api/customers', 'POST /api/rentals',
            'POST /api/inspections/pickup', 'GET /api/border-fees', 'GET /api/tariffs',
            'GET /api/tariff-details', 'GET /api/km-policies', 'DELETE /api/lookups/{type}/{id}',
        ] as $expected) {
            self::assertContains($expected, $paths);
        }
    }
}
