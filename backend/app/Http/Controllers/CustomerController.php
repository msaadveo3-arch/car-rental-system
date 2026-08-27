<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        // TODO: return list of customers
        return response()->json([]);
    }

    public function show($id)
    {
        // TODO: show customer
        return response()->json(['id' => $id]);
    }
}
