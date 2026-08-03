<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasCoverUrl;
use App\Models\Post;
use Illuminate\Http\Response;

final class FeedController extends Controller
{
    use HasCoverUrl;

    public function __invoke(): Response
    {
        $items = Post::query()
            ->published()
            ->orderByDesc('published_at')
            ->get(['slug', 'title', 'description', 'image', 'published_at'])
            ->map(fn (Post $post): string => $this->rssItem($post))
            ->implode("\n");

        $xml = <<<XML
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <title>Joey McKenzie's Blog</title>
                    <link>{$this->escapeXml(route('home'))}</link>
                    <description>Thoughts on software development, Laravel, PHP, Rust, and more.</description>
                    <language>en-us</language>
                    {$items}
                </channel>
            </rss>
            XML;

        return response($xml, Response::HTTP_OK, [
            'Content-Type' => 'application/rss+xml; charset=UTF-8',
        ]);
    }

    private function rssItem(Post $post): string
    {
        $postUrl = $this->escapeXml(route('blog.show', $post));
        $coverUrl = $this->coverUrl($post->image);
        $enclosure = filled($coverUrl)
            ? sprintf(
                '<enclosure url="%s" type="image/webp" />',
                $this->escapeXml($coverUrl),
            )
            : '';
        $publishedAt = $post->published_at?->toRfc2822String() ?? '';

        return <<<XML
                <item>
                    <title><![CDATA[{$this->cdata($post->title)}]]></title>
                    <link>{$postUrl}</link>
                    <description><![CDATA[{$this->cdata($post->description)}]]></description>
                    <pubDate>{$publishedAt}</pubDate>
                    <guid>{$postUrl}</guid>
                    {$enclosure}
                </item>
            XML;
    }

    private function cdata(string $value): string
    {
        return str_replace(']]>', ']]]]><![CDATA[>', $value);
    }

    private function escapeXml(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
