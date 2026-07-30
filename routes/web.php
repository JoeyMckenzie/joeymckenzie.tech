<?php

declare(strict_types=1);

use App\Http\Controllers\BlogController;
use App\Http\Controllers\PostReactionController;
use App\Http\Controllers\SpotifyNowPlayingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// Spotify now-playing JSON (JOEY-13.5), polled by the footer widget ~30s.
Route::get('now-playing', SpotifyNowPlayingController::class)->name('now-playing');

// Public style-guide colophon — the site's design system, kept live on purpose.
Route::get('style-guide', fn () => Inertia::render('style-guide'))->name('style-guide');

// Public blog (JOEY-4 / JOEY-8). Read endpoints: index + single post with view tracking.
Route::get('blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('blog/{post}', [BlogController::class, 'show'])->name('blog.show');

// Anonymous emoji reactions (JOEY-9), deduped per visitor ip_hash; toggle is rate-limited.
Route::get('blog/{post}/reactions', [PostReactionController::class, 'index'])->name('blog.reactions.index');
Route::post('blog/{post}/reactions', [PostReactionController::class, 'store'])
    ->middleware('throttle:30,1')
    ->name('blog.reactions.store');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
});

require __DIR__.'/settings.php';
