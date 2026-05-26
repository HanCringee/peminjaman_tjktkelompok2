<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Alat;

class AlatController extends Controller
{
    public function index()
    {
        $alat = Alat::all();

        return response()->json([
            'success' => true,
            'data' => $alat
        ], 200);
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (Auth::user()->role != 'admin') {
            return response()->json([
                'message' => 'Hanya admin yang bisa menambah alat'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nama_alat' => 'required|string|max:255',
            'kategori' => 'required|string|max:100',
            'stok' => 'required|integer|min:0',
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

    public function show($id)
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

    public function update(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (Auth::user()->role != 'admin') {
            return response()->json([
                'message' => 'Hanya admin yang bisa update alat'
            ], 403);
        }

        $alat = Alat::find($id);

        if (!$alat) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_alat' => 'required|string|max:255',
            'kategori' => 'required|string|max:100',
            'stok' => 'required|integer|min:0',
            'kondisi' => 'required|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $alat->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $alat
        ], 200);
    }

    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (Auth::user()->role != 'admin') {
            return response()->json([
                'message' => 'Hanya admin yang bisa menghapus alat'
            ], 403);
        }

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
