<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    $file = public_path('index.html');
    if (file_exists($file)) {
        return file_get_contents($file);
    }
    return view('welcome');
})->where('any', '.*');
