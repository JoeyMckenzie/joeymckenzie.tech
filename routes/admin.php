<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\PostImageController;
use App\Http\Controllers\Admin\PostPreviewController;
use App\Http\Controllers\Admin\PostReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
|
| The single operator's authoring surface (JOEY-5). With exactly one account,
| the auth + verified middleware is the authorization (docs/adr/0003).
|
| Posts bind on `{post:id}` rather than Post's `slug` route key: slugs are
| editable, and an id-bound admin URL survives a rename.
|
*/

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('posts/{post:id}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::patch('posts/{post:id}', [PostController::class, 'update'])->name('posts.update');
    Route::post('posts/{post:id}/review', PostReviewController::class)
        ->middleware('throttle:5,1')
        ->name('posts.review');
    Route::delete('posts/{post:id}', [PostController::class, 'destroy'])->name('posts.destroy');

    // Editor support endpoints (JOEY-5.2): the preview goes through the same
    // MarkdownRenderer as publishing; uploads run the R2 + WebP pipeline.
    Route::post('posts/preview', PostPreviewController::class)->name('posts.preview');
    Route::post('posts/images', PostImageController::class)
        ->middleware('throttle:60,1')
        ->name('posts.images.store');
});
