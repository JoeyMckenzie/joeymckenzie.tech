<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;

final class ViewsController extends Controller
{
    public function __invoke()
    {
        $posts = Post::query()->get(['slug', 'views']);

        return $posts;
    }
}
