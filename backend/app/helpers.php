<?php

function json_response(mixed $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function json_input(): array
{
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function nullable(?string $value): ?string
{
    $value = trim((string) $value);
    return $value === '' ? null : $value;
}
function current_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';

    // Apache في Laragon ساعات ميشمرش الهيدر في $_SERVER — نقراه مباشرة
    if ($header === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $value) {
            if (strtolower((string) $name) === 'authorization') {
                $header = (string) $value;
                break;
            }
        }
    }

    if (preg_match('/^Bearer\s+(\S+)$/', (string) $header, $m)) {
        return $m[1];
    }
    return null;
}

function current_user(): ?array
{
    $token = current_token();
    if ($token === null) {
        return null;
    }

    $pdo = \App\Database::connection();
    $stmt = $pdo->prepare(
        'SELECT u.* FROM api_tokens t
         JOIN users u ON u.id = t.user_id
         WHERE t.token_hash = ? AND t.expires_at > NOW()'
    );
    $stmt->execute([hash('sha256', $token)]);
    $user = $stmt->fetch();

    return $user ?: null;
}

function require_auth(): array
{
    $user = current_user();
    if (!$user) {
        json_response(['success' => false, 'message' => 'Unauthenticated'], 401);
    }
    return $user;
}

function nullable_int(mixed $value): ?int
{
    if ($value === null || trim((string) $value) === '') {
        return null;
    }
    return (int) $value;
}