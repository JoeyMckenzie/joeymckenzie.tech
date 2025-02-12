<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => view('index'))
    ->name('home');
Route::get('/now', fn () => view('now'))
    ->name('now');
Route::get('/blog', fn () => view('blog'))
    ->name('blog');
