<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(),422);
        }

        $user = User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password)
        ]);

        return response()->json([
            'success'=>true,
            'data'=>$user
        ]);
    }


    public function login(Request $request)
    {

        if(!Auth::attempt($request->only('email','password'))){
            return response()->json([
                'message'=>'Login gagal'
            ],401);
        }

        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success'=>true,
            'token'=>$token,
            'user'=>$user
        ]);

    }


    public function logout(Request $request)
    {

        $request->user()->tokens()->delete();

        return response()->json([
            'message'=>'Logout berhasil'
        ]);

    }
}
