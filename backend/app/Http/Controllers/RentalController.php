<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RentalController extends Controller
{
    public function index()
    {
        // TODO: list rentals
        return response()->json([]);
    }

    public function show($id)
    {
        // TODO: show rental
        return response()->json(['id' => $id]);
    }
}
