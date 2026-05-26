<?php

use App\Http\Controllers\Api\AlatController;
use App\Http\Controllers\Api\PeminjamanController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"])->name("login");
Route::get("/alat", [AlatController::class, "index"]);
Route::get("/alat/{id}", [AlatController::class, "show"]);

Route::middleware("auth:sanctum")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::post("/profile", [AuthController::class, "updateProfile"]);
    Route::post("/alat", [AlatController::class, "store"]);
    Route::put("/alat/{id}", [AlatController::class, "update"]);
    Route::delete("/alat/{id}", [AlatController::class, "destroy"]);
    Route::get("/peminjaman", [PeminjamanController::class, "index"]);
    Route::post("/peminjaman", [PeminjamanController::class, "store"]);
    Route::get("/peminjaman/{id}", [PeminjamanController::class, "show"]);
    Route::put("/peminjaman/{id}", [PeminjamanController::class, "update"]);
    Route::delete("/peminjaman/{id}", [PeminjamanController::class, "destroy"]);
    Route::post("/peminjaman/{id}/approve", [PeminjamanController::class, "approve"]);
    Route::post("/peminjaman/{id}/selesai", [PeminjamanController::class, "selesai"]);
});
