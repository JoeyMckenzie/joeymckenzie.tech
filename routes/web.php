<?php

declare(strict_types=1);

use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// Public style-guide colophon — the site's design system, kept live on purpose.
Route::get('style-guide', fn () => Inertia::render('style-guide'))->name('style-guide');

// Public blog (JOEY-4). Read endpoints: index here; show + view tracking land in JOEY-8.
Route::get('blog', [BlogController::class, 'index'])->name('blog.index');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
});

require __DIR__.'/settings.php';
