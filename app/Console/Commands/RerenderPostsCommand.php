<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Post;
use App\Services\MarkdownRenderer;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('posts:rerender')]
#[Description('Re-render every stored post markdown into content_html')]
final class RerenderPostsCommand extends Command
{
    /**
     * Idempotent: re-rendering the same markdown produces the same HTML.
     * Includes drafts and future-dated posts (bypasses the visibility scope).
     */
    public function handle(MarkdownRenderer $renderer): int
    {
        $posts = Post::query()->withoutGlobalScopes()->get();

        foreach ($posts as $post) {
            $post->update(['content_html' => $renderer->render($post->content)]);
        }

        $this->info(sprintf('Re-rendered %d posts', $posts->count()));

        return self::SUCCESS;
    }
}
