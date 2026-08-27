<?php

namespace App\Controllers;

use App\Database;

class AuthController
{
    /** POST /api/auth/login */
    public function login(): void
    {
        $input = json_input();
        $identifier = trim((string) ($input['email'] ?? $input['username'] ?? ''));
        $password = (string) ($input['password'] ?? '');

        if ($identifier === '' || $password === '') {
            json_response(['success' => false, 'message' => 'Email and password are required'], 422);
        }

        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1');
        $stmt->execute([$identifier, $identifier]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            json_response(['success' => false, 'message' => 'Invalid credentials'], 401);
        }

        $token = bin2hex(random_bytes(32));
        $pdo->prepare('INSERT INTO api_tokens (user_id, token_hash, expires_at)
                       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))')
            ->execute([$user['id'], hash('sha256', $token)]);

        json_response([
            'success' => true,
            'token'   => $token,
            'user'    => self::publicUser($user),
        ]);
    }

    /** POST /api/auth/logout */
    public function logout(): void
    {
        $token = current_token();
        if ($token !== null) {
            $pdo = Database::connection();
            $pdo->prepare('DELETE FROM api_tokens WHERE token_hash = ?')
                ->execute([hash('sha256', $token)]);
        }
        json_response(['success' => true]);
    }

    /** GET /api/auth/me */
    public function me(): void
    {
        json_response(['success' => true, 'user' => self::publicUser(require_auth())]);
    }

    private static function publicUser(array $user): array
    {
        return [
            'id'         => (int) $user['id'],
            'username'   => $user['username'],
            'full_name'  => $user['full_name'],
            'email'      => $user['email'],
            'role'       => $user['role'],
            'avatar_url' => $user['avatar_url'],
        ];
    }
}