<?php

declare(strict_types=1);

namespace Tests\Feature\Blog;

use App\Http\Controllers\FeedController;
use App\Models\Post;
use App\Models\User;
use DOMDocument;
use DOMElement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(FeedController::class)]
final class FeedTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_published_posts_newest_first_with_rss_metadata(): void
    {
        Config::set('blog.image_disk', 'public');

        $newerImage = 'posts/newer-post/cover.webp';
        $older = Post::factory()->published()->create([
            'title' => 'Older post',
            'slug' => 'older-post',
            'description' => 'The older description.',
            'image' => 'posts/older-post/cover.webp',
            'published_at' => now()->subDays(2),
        ]);
        $newer = Post::factory()->published()->create([
            'title' => 'Newer & <post>',
            'slug' => 'newer-post',
            'description' => 'A valid CDATA ]]> boundary.',
            'image' => $newerImage,
            'published_at' => now()->subDay(),
        ]);

        $response = $this->get(route('feed'))
            ->assertOk()
            ->assertHeader('Content-Type', 'application/rss+xml; charset=UTF-8');

        $document = $this->xmlDocument($response->getContent());
        $items = $document->getElementsByTagName('item');

        $this->assertCount(2, $items);

        $newestItem = $items->item(0);
        $this->assertInstanceOf(DOMElement::class, $newestItem);
        $this->assertSame($newer->title, $this->childText($newestItem, 'title'));
        $this->assertSame(route('blog.show', $newer), $this->childText($newestItem, 'link'));
        $this->assertSame($newer->description, $this->childText($newestItem, 'description'));
        $this->assertSame($newer->published_at?->toRfc2822String(), $this->childText($newestItem, 'pubDate'));
        $this->assertSame(route('blog.show', $newer), $this->childText($newestItem, 'guid'));

        $enclosure = $newestItem->getElementsByTagName('enclosure')->item(0);
        $this->assertInstanceOf(DOMElement::class, $enclosure);
        $this->assertSame(Storage::disk('public')->url($newerImage), $enclosure->getAttribute('url'));
        $this->assertSame('image/webp', $enclosure->getAttribute('type'));

        $oldestItem = $items->item(1);
        $this->assertInstanceOf(DOMElement::class, $oldestItem);
        $this->assertSame($older->title, $this->childText($oldestItem, 'title'));
    }

    #[Test]
    public function it_excludes_drafts_and_scheduled_posts_for_an_authenticated_author(): void
    {
        $published = Post::factory()->published()->create(['title' => 'Published post']);
        Post::factory()->draft()->create(['title' => 'Draft post']);
        Post::factory()->scheduled()->create(['title' => 'Scheduled post']);

        $response = $this->actingAs(User::factory()->create())
            ->get(route('feed'))
            ->assertOk();

        $document = $this->xmlDocument($response->getContent());
        $items = $document->getElementsByTagName('item');

        $this->assertCount(1, $items);

        $item = $items->item(0);
        $this->assertInstanceOf(DOMElement::class, $item);
        $this->assertSame($published->title, $this->childText($item, 'title'));
    }

    private function xmlDocument(string|false $content): DOMDocument
    {
        $this->assertIsString($content);
        $this->assertNotEmpty($content);

        $document = new DOMDocument;
        $this->assertTrue($document->loadXML($content));

        return $document;
    }

    private function childText(DOMElement $element, string $tagName): string
    {
        $child = $element->getElementsByTagName($tagName)->item(0);
        $this->assertInstanceOf(DOMElement::class, $child);

        return $child->textContent;
    }
}
