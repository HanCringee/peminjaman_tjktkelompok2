<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Peminjaman;

class PeminjamanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $peminjaman = Peminjaman::all();

        return response()->json([
            'success' => true,
            'data' => $peminjaman
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'alat_id' => 'required|integer',
            'jumlah' => 'required|integer',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali' => 'required|date',
            'status' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $peminjaman = Peminjaman::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $peminjaman
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $peminjaman = Peminjaman::find($id);

        if (!$peminjaman) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $peminjaman
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'alat_id' => 'required|integer',
            'jumlah' => 'required|integer',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali' => 'required|date',
            'status' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $peminjaman = Peminjaman::find($id);

        if (!$peminjaman) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $peminjaman->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $peminjaman
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $peminjaman = Peminjaman::find($id);

        if (!$peminjaman) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $peminjaman->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil dihapus'
        ], 200);
    }
}
