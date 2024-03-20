<?php

declare(strict_types=1);

use App\Http\Controllers\BlogController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('', HomeController::class)
    ->name('home');

Route::get('now', fn () => Inertia::render('Now'))
    ->name('now');

Route::get('blog', [BlogController::class, 'index'])
    ->name('blog');

Route::get('blog/{slug}', [BlogController::class, 'show'])
    ->where('slug', '[a-zA-Z\-]+')
    ->name('blog.post');
