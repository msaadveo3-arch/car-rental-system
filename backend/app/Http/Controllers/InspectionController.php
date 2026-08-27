<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InspectionController extends Controller
{
    public function index()
    {
        // TODO: list inspections
        return response()->json([]);
    }

    public function show($id)
    {
        // TODO: show inspection
        return response()->json(['id' => $id]);
    }
}
