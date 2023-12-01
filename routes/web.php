<?php

use App\Contracts\ContentRepositoryContract;
use App\Http\Controllers\ProfileController;
use App\Models\BlogPost;
use Illuminate\Foundation\Application;
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

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return Inertia::render('Home', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('', fn (ContentRepositoryContract $contentRepository) => Inertia::render('Home', [
    'frontMatters' => array_values(
        collect($contentRepository->getBlogPostMetadata())
            ->sortByDesc(fn (BlogPost $post) => $post->published_date)
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

Route::get('blog/{slug}', fn (string $slug, ContentRepositoryContract $contentRepository) => Inertia::render('Blog/Post/Index', [
    'post' => $contentRepository->getBlogPostBySlug($slug),
]))
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
