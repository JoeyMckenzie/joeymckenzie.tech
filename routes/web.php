<?php

use App\Contracts\ContentRepositoryContract;
use App\Http\Controllers\NowController;
use App\Models\Note;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('', fn (ContentRepositoryContract $contentRepository) => Inertia::render('Home', [
    'frontMatters' => array_values(
        collect($contentRepository->getLatestBlogPostMetadata())
            ->toArray()
    ),
    'notes' => array_values(
        Note::select(['title', 'description'])
            ->where('show', true)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->toArray()
    ),
]))
    ->name('home');

Route::get('now', [NowController::class, 'index'])->name('now');

Route::get('blog', fn (ContentRepositoryContract $contentRepository) => Inertia::render('Blog/Index', [
    'frontMatters' => array_values(
        collect($contentRepository->getBlogPostMetadata())
            ->toArray()
    ),
]))
    ->name('blogs');

Route::get('blog/{slug}', fn (string $slug, ContentRepositoryContract $contentRepository) => Inertia::render('Blog/Post/Index', [
    'post' => $contentRepository->getBlogPostBySlug($slug),
]))
    ->name('post');
