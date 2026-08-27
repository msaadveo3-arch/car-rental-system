<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index()
    {
        // TODO: return list of cars
        return response()->json([]);
    }

    public function show($id)
    {
        // TODO: show car
        return response()->json(['id' => $id]);
    }
}
