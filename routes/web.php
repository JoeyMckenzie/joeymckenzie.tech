<?php

declare(strict_types=1);

use App\Http\Controllers\BlogController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('', HomeController::class)
    ->name('home');

Route::get('blog', [BlogController::class, 'index'])
    ->name('blog');

Route::get('blog/{slug}', [BlogController::class, 'show'])
    ->name('blog.post');
