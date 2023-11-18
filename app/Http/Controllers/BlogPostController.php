<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Request;

class BlogPostController
{
    public function show(Request $request, string $slug): Response
    {
        return Inertia::render('BlogPost', [
            'slug' => $slug,
        ]);
    }
}
