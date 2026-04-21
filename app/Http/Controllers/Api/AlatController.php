<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Alat;

class AlatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $alat = Alat::all();
        return response()->json(['success' => true, 'data' => $alat], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_alat' => 'required|string|max:255',
            'kategori' => 'required|string|max:100',
            'stok' => 'required|integer',
            'kondisi' => 'required|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $alat = Alat::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $alat
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $alat = Alat::find($id);

        if (!$alat) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $alat
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'nama_alat' => 'required|string|max:255',
            'kategori' => 'required|string|max:100',
            'stok' => 'required|integer',
            'kondisi' => 'required|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $alat = Alat::find($id);

        if (!$alat) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $alat->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $alat
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $alat = Alat::find($id);

        if (!$alat) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $alat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil dihapus'
        ], 200);
    }
}
