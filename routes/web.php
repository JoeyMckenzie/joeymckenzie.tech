<?php

declare(strict_types=1);

use App\Livewire\Pages\Blog;
use App\Livewire\Pages\Home;
use App\Livewire\Pages\Now;
use Illuminate\Support\Facades\Route;

Route::get('/', Home::class)
    ->name('home');

Route::get('/now', Now::class)
    ->name('now');

Route::get('/blog', Blog::class)
    ->name('blog');
