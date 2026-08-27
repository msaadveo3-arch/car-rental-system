<?php

use App\Controllers\AuthController;
use App\Controllers\CustomerController;
use App\Controllers\CarController;
use App\Controllers\LookupController;
use App\Controllers\RentalController;
use App\Controllers\BorderFeeController;
use App\Controllers\TariffController;
use App\Controllers\KmPolicyController;
use App\Controllers\InspectionController;

return [
    'GET' => [
        '/api/auth/me' => [AuthController::class, 'me'],
        '/api/cars' => [CarController::class, 'index'],
        '/api/car-models' => [CarController::class, 'models'],
        '/api/customers' => [CustomerController::class, 'index'],
        '/api/lookups' => [CarController::class, 'lookups'],
        '/api/lookups/{type}' => [LookupController::class, 'index'],
        '/api/rentals' => [RentalController::class, 'index'],
        '/api/rentals/{id}' => [RentalController::class, 'show'],
        '/api/inspections/pickup' => [InspectionController::class, 'indexPickup'],
        '/api/border-fees' => [BorderFeeController::class, 'index'],
        '/api/tariffs' => [TariffController::class, 'index'],
        '/api/tariff-details' => [TariffController::class, 'details'],
        '/api/km-policies' => [KmPolicyController::class, 'index'],
    ],
    'POST' => [
        '/api/auth/login' => [AuthController::class, 'login'],
        '/api/auth/logout' => [AuthController::class, 'logout'],
        '/api/cars' => [CarController::class, 'store'],
        '/api/customers' => [CustomerController::class, 'store'],
        '/api/lookups/{type}' => [LookupController::class, 'store'],
        '/api/rentals' => [RentalController::class, 'store'],
        '/api/border-fees' => [BorderFeeController::class, 'store'],
        '/api/tariffs' => [TariffController::class, 'store'],
        '/api/tariff-details' => [TariffController::class, 'storeDetail'],
        '/api/km-policies' => [KmPolicyController::class, 'store'],
                '/api/inspections/pickup' => [InspectionController::class, 'storePickup'],
    ],
    'PUT' => [
        '/api/cars/{id}' => [CarController::class, 'update'],
        '/api/customers/{id}' => [CustomerController::class, 'update'],
        '/api/lookups/{type}/{id}' => [LookupController::class, 'update'],
        '/api/rentals/{id}' => [RentalController::class, 'update'],
        '/api/border-fees/{id}' => [BorderFeeController::class, 'update'],
        '/api/tariffs/{id}' => [TariffController::class, 'update'],
        '/api/tariff-details/{id}' => [TariffController::class, 'updateDetail'],
        '/api/km-policies/{id}' => [KmPolicyController::class, 'update'],
    ],
    'DELETE' => [
        '/api/cars/{id}' => [CarController::class, 'destroy'],
        '/api/customers/{id}' => [CustomerController::class, 'destroy'],
        '/api/lookups/{type}/{id}' => [LookupController::class, 'destroy'],
        '/api/border-fees/{id}' => [BorderFeeController::class, 'destroy'],
        '/api/tariffs/{id}' => [TariffController::class, 'destroy'],
        '/api/tariff-details/{id}' => [TariffController::class, 'destroyDetail'],
        '/api/km-policies/{id}' => [KmPolicyController::class, 'destroy'],
    ],
];