<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Peminjaman;
use Carbon\Carbon;

class PeminjamanController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            $peminjaman = Peminjaman::all();
        } else {
            $peminjaman = Peminjaman::where('user_id', $user->id)->get();
        }

        return response()->json([
            'success' => true,
            'data' => $peminjaman
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'alat_id' => 'required|integer',
            'jumlah' => 'required|integer',
            'status' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $now = Carbon::now('Asia/Jakarta');
        $data = $request->all();
        $data['tanggal_pinjam'] = $now;
        $data['tanggal_kembali'] = $now->copy()->addDays(7)->setTime(11, 30, 0);

        $peminjaman = Peminjaman::create($data);

        return response()->json([
            'success' => true,
            'data' => $peminjaman
        ], 201);
    }

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

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'alat_id' => 'required|integer',
            'jumlah' => 'required|integer',
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
