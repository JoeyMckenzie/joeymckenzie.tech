<?php

declare(strict_types=1);

namespace Tests\Feature\Blog;

use App\Console\Commands\RerenderPostsCommand;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(RerenderPostsCommand::class)]
final class RerenderPostsCommandTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_rerenders_content_html_for_every_post_including_drafts(): void
    {
        $published = Post::factory()->published()->create([
            'content' => '# Published',
            'content_html' => 'stale',
        ]);
        $draft = Post::factory()->draft()->create([
            'content' => '# Draft',
            'content_html' => 'stale',
        ]);

        $this->assertSame(0, Artisan::call('posts:rerender'));

        $this->assertStringContainsString('<h1>Published</h1>', $published->refresh()->content_html ?? '');
        $this->assertStringContainsString('<h1>Draft</h1>', $draft->refresh()->content_html ?? '');
    }

    #[Test]
    public function it_is_idempotent(): void
    {
        $post = Post::factory()->published()->create(['content' => "# Hello\n\n```php\necho 1;\n```"]);

        $this->assertSame(0, Artisan::call('posts:rerender'));
        $first = $post->refresh()->content_html;

        $this->assertSame(0, Artisan::call('posts:rerender'));

        $this->assertSame($first, $post->refresh()->content_html);
    }
}
