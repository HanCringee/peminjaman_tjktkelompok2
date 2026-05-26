<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;


class AuthController extends Controller
{

    // REGISTER
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'nik' => 'required|unique:users',
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),422);
        }

        $user = User::create([
            'nik' => $request->nik,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'avatar_url' => null,
        ]);

        return response()->json([
            'message' => 'Register berhasil',
            'data' => $user
        ],201);
    }


    // LOGIN (pakai NIK)
    public function login(Request $request)
    {
        $user = User::where('nik',$request->nik)->first();

        if(!$user || !Hash::check($request->password,$user->password)){
            return response()->json([
                'message' => 'Login gagal'
            ],401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $user
        ]);
    }

    // UPDATE PROFILE
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|min:8|confirmed',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar_url = asset('storage/' . $avatarPath);
        }

        $user->save();

        return response()->json([
            'message' => 'Profil berhasil diupdate',
            'user' => $user,
        ]);
    }


    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

}
