<?php

declare(strict_types=1);

use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => view('index'))
    ->name('home');
Route::get('/now', fn () => view('now'))
    ->name('now');
Route::get('/blog', [BlogController::class, 'index'])
    ->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])
    ->name('blog.show');
