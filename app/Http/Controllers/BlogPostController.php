<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\LoadPosts;
use Inertia\Inertia;
use Inertia\Response;
use Request;

class BlogPostController
{
    public function show(Request $request, string $slug, LoadPosts $action): Response
    {
        $posts = $action->handle();
        ddd($posts);

        return Inertia::render('BlogPost', [
            'slug' => $slug,
        ]);
    }
}
