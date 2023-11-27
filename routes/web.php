<?php

declare(strict_types=1);

use App\Contracts\ContentRepositoryContract;
use App\Http\Controllers\ProfileController;
use App\Models\FrontMatter;
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
        collect($contentRepository->allFrontMatters())
            ->sortByDesc(fn (FrontMatter $frontMatter) => new DateTime($frontMatter->pubDate))
            ->take(3)
            ->toArray()
    ),
]))
    ->name('home');

Route::get('about', fn () => Inertia::render('About'))
    ->name('about');

Route::get('blog', fn (ContentRepositoryContract $contentRepository) => Inertia::render('Blog/Index', [
    'frontMatters' => array_values(
        collect($contentRepository->allFrontMatters())
            ->sortByDesc(fn (FrontMatter $frontMatter) => new DateTime($frontMatter->pubDate))
            ->toArray()
    ),
]))
    ->name('blogs');

Route::get('blog/{slug}', function (string $slug, ContentRepositoryContract $contentRepository) {
    $contentRepository->addViewCount($slug);

    return Inertia::render('Blog/Post/Index', [
        'contentMeta' => $contentRepository->getContentMeta($slug),
    ]);
})
    ->name('post');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
