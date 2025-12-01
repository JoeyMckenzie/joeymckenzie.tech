<?php

declare(strict_types=1);

use App\Livewire\Pages\Blog;
use App\Livewire\Pages\Home;
use App\Livewire\Pages\Now;
use App\Services\Sitemapper;
use Illuminate\Support\Facades\Route;

Route::get('/', Home::class)->name('home');
Route::get('/now', Now::class)->name('now');
Route::get('/blog', Blog::class)->name('blog.index');

Route::get('/blog/{post}', App\Livewire\Pages\BlogPost::class)->name('blog.post');

Route::get('/sitemap.xml', fn (Sitemapper $sitemapper) => $sitemapper
    ->create()
    ->toResponse(request()))
    ->name('sitemap');
