<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // TODO: implement login
        return response()->json(['message' => 'login endpoint']);
    }

    public function logout(Request $request)
    {
        // TODO: implement logout
        return response()->json(['message' => 'logout endpoint']);
    }
}
