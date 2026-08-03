<?php

declare(strict_types=1);

namespace Tests\Feature\Blog;

use App\Http\Controllers\SitemapController;
use App\Models\Post;
use App\Models\User;
use DOMDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(SitemapController::class)]
final class SitemapTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_public_pages_and_every_published_post(): void
    {
        $firstPost = Post::factory()->published()->create(['slug' => 'first-post']);
        $secondPost = Post::factory()->published()->create(['slug' => 'second-post']);

        $response = $this->get(route('sitemap'))
            ->assertOk()
            ->assertHeader('Content-Type', 'text/xml; charset=UTF-8');

        $urls = $this->sitemapUrls($response->getContent());

        $this->assertEqualsCanonicalizing([
            route('home'),
            route('blog.index'),
            route('now'),
            route('uses'),
            route('cv'),
            route('style-guide'),
            route('blog.show', $firstPost),
            route('blog.show', $secondPost),
        ], $urls);
    }

    #[Test]
    public function it_excludes_drafts_and_scheduled_posts_for_an_authenticated_author(): void
    {
        $published = Post::factory()->published()->create(['slug' => 'published-post']);
        $draft = Post::factory()->draft()->create(['slug' => 'draft-post']);
        $scheduled = Post::factory()->scheduled()->create(['slug' => 'scheduled-post']);

        $response = $this->actingAs(User::factory()->create())
            ->get(route('sitemap'))
            ->assertOk();

        $urls = $this->sitemapUrls($response->getContent());

        $this->assertContains(route('blog.show', $published), $urls);
        $this->assertNotContains(route('blog.show', $draft), $urls);
        $this->assertNotContains(route('blog.show', $scheduled), $urls);
    }

    /**
     * @return list<string>
     */
    private function sitemapUrls(string|false $content): array
    {
        $this->assertIsString($content);
        $this->assertNotEmpty($content);

        $document = new DOMDocument;
        $this->assertTrue($document->loadXML($content));

        $urls = [];

        foreach ($document->getElementsByTagName('loc') as $location) {
            $urls[] = $location->textContent;
        }

        return $urls;
    }
}
