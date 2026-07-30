<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Post;
use App\Models\Tag;
use Carbon\CarbonImmutable;
use FilesystemIterator;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Spatie\YamlFrontMatter\YamlFrontMatter;
use SplFileInfo;

/**
 * Imports one legacy markdown post into MySQL (JOEY-11). Idempotent per slug.
 *
 * Uploads the cover and every local inline image through the ImageProcessor
 * (JOEY-7): the cover is stored as an R2 object key, inline references are
 * rewritten to their absolute R2 URLs in the stored markdown, and the body is
 * rendered to content_html (JOEY-6). External image URLs are left untouched.
 */
final readonly class PostImporter
{
    private const int WORDS_PER_MINUTE = 200;

    /**
     * Canonical tag id → name map (mirrors TagSeeder) so an absent tag is
     * created with a real name rather than a placeholder.
     *
     * @var array<int, string>
     */
    private const array TAG_NAMES = [
        1 => 'laravel',
        2 => 'php',
        3 => 'dotnet',
        4 => 'angular',
        5 => 'astro',
        6 => 'design',
        7 => 'react',
        8 => 'rust',
        9 => 'zig',
    ];

    public function __construct(
        private MarkdownRenderer $renderer,
        private ImageProcessor $images,
    ) {
        //
    }

    /**
     * @param  string  $imagesRoot  Filesystem root the legacy image paths resolve against.
     */
    public function import(string $rawContents, string $imagesRoot): Post
    {
        $document = YamlFrontMatter::parse($rawContents);
        $slug = $this->stringMatter($document->matter('slug'));
        $tagId = $this->intMatter($document->matter('tag_id'));

        $tag = Tag::query()->firstOrCreate(
            ['id' => $tagId],
            ['name' => self::TAG_NAMES[$tagId] ?? 'tag-'.$tagId],
        );

        $coverKey = $this->importCover($this->stringMatter($document->matter('image')), $slug, $imagesRoot);
        $body = $this->rewriteInlineImages($document->body(), $slug, $imagesRoot);

        return Post::query()->updateOrCreate(
            ['slug' => $slug],
            [
                'tag_id' => $tag->id,
                'title' => $this->stringMatter($document->matter('title')),
                'description' => $this->stringMatter($document->matter('description')),
                'content' => $body,
                'content_html' => $this->renderer->render($body),
                'image' => $coverKey,
                'reading_time_minutes' => $this->readingTime($body),
                'published_at' => $this->dateMatter($document->matter('published_at')),
            ],
        );
    }

    private function importCover(string $ref, string $slug, string $imagesRoot): string
    {
        $path = $this->resolveImagePath($ref, $imagesRoot);

        if ($path === null) {
            return $ref;
        }

        return $this->images->store($path, $slug, 'cover')['key'];
    }

    private function rewriteInlineImages(string $body, string $slug, string $imagesRoot): string
    {
        return (string) preg_replace_callback(
            '/!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/',
            function (array $match) use ($slug, $imagesRoot): string {
                [$full, $alt, $url] = [$match[0], $match[1], $match[2]];
                $title = $match[3] ?? '';

                if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
                    return $full;
                }

                $path = $this->resolveImagePath($url, $imagesRoot);

                if ($path === null) {
                    return $full;
                }

                $name = pathinfo($url, PATHINFO_FILENAME);
                $stored = $this->images->store($path, $slug, $name);

                return sprintf('![%s](%s%s)', $alt, $stored['url'], $title);
            },
            $body,
        );
    }

    /**
     * Resolve a legacy image reference to a real file: strip the assorted
     * `/assets/blog/`, `/assets/images/`, `/images/` roots (and typos) and look
     * it up under the images root, falling back to a basename search.
     */
    private function resolveImagePath(string $ref, string $imagesRoot): ?string
    {
        if ($ref === '') {
            return null;
        }

        $relative = ltrim($ref, '/');

        foreach (['assets/blog/', 'assets/images/', 'asset/blog/', 'images/', 'assets/'] as $prefix) {
            if (str_starts_with($relative, $prefix)) {
                $relative = substr($relative, strlen($prefix));
                break;
            }
        }

        $candidate = rtrim($imagesRoot, '/').'/'.$relative;

        if (is_file($candidate)) {
            return $candidate;
        }

        $basename = basename($relative);

        if (! is_dir($imagesRoot)) {
            return null;
        }

        /** @var SplFileInfo $file */
        foreach (new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($imagesRoot, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY,
            RecursiveIteratorIterator::CATCH_GET_CHILD, // skip unreadable subdirectories
        ) as $file) {
            if ($file->isFile() && $file->getFilename() === $basename) {
                return $file->getPathname();
            }
        }

        return null;
    }

    private function readingTime(string $body): int
    {
        return max(1, (int) ceil(str_word_count($body) / self::WORDS_PER_MINUTE));
    }

    private function stringMatter(mixed $value): string
    {
        return is_string($value) ? $value : '';
    }

    private function intMatter(mixed $value): int
    {
        if (is_int($value)) {
            return $value;
        }

        return is_string($value) && $value !== '' ? (int) $value : 0;
    }

    private function dateMatter(mixed $value): ?CarbonImmutable
    {
        if ($value instanceof \DateTimeInterface) {
            return CarbonImmutable::instance($value);
        }

        // Symfony YAML parses an unquoted ISO date (e.g. 2019-10-04) as a Unix timestamp.
        if (is_int($value)) {
            return CarbonImmutable::createFromTimestamp($value);
        }

        return is_string($value) && $value !== '' ? CarbonImmutable::parse($value) : null;
    }
}
