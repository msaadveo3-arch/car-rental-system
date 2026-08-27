<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/app/helpers.php';

spl_autoload_register(static function (string $class): void {
    if (str_starts_with($class, 'App\\')) {
        $relative = str_replace('\\', '/', substr($class, 4)) . '.php';
        $file = __DIR__ . '/app/' . $relative;
        if (is_file($file)) {
            require_once $file;
        }
    }
});

$routes = require __DIR__ . '/routes/api.php';

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// نشيل بادئة المسار (مثلا /car-rental-system/backend) عشان نقرا المسار النسبي
$basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
if ($basePath !== '/' && str_starts_with($path, $basePath)) {
    $path = substr($path, strlen($basePath));
}

// دعم التشغيل من غير .htaccess (مثلا: /backend/index.php/api/customers)
if (str_starts_with($path, '/index.php')) {
    $path = substr($path, strlen('/index.php'));
}

$matched = null;
$params  = [];

foreach ($routes[$method] ?? [] as $pattern => $handler) {
        $regex = '#^' . preg_replace('/\{(\w+)\}/', '([a-zA-Z0-9_]+)', $pattern) . '$#';
    if (preg_match($regex, $path, $m)) {
        $matched = $handler;
        $params  = array_slice($m, 1);
        break;
    }
}

if ($matched === null) {
    json_response(['success' => false, 'message' => 'Endpoint not found'], 404);
}

[$class, $action] = $matched;
(new $class())->$action(...$params);