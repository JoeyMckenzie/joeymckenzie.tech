<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\PostController;
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
    Route::delete('posts/{post:id}', [PostController::class, 'destroy'])->name('posts.destroy');
});
