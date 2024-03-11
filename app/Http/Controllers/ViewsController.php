<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;

final class ViewsController extends Controller
{
    /**
     * @return array<int, array{slug: string, views: int}>
     */
    public function __invoke(): array
    {
        $posts = Post::query()->get(['slug', 'views']);

        return $posts->toArray();
    }
}
