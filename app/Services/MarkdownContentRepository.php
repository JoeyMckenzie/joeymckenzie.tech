<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentRepositoryContract;
use App\Models\ContentMeta;
use App\Models\FrontMatter;
use App\Models\ViewCount;
use Illuminate\Support\Facades\Cache;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use League\CommonMark\Extension\FrontMatter\Input\MarkdownInputWithFrontMatter;
use Log;
use Spatie\LaravelMarkdown\MarkdownRenderer;
use Str;

final readonly class MarkdownContentRepository implements ContentRepositoryContract
{
    private const FILEPATHS_CACHE_KEY = 'filePaths';

    public static function initContentCache(): MarkdownContentRepository
    {
        Log::info('init content cache');

        return new MarkdownContentRepository();
    }

    public function getContentMeta(string $slug): ?ContentMeta
    {
        if (Cache::has($slug)) {
            Log::info("$slug content file found in cache");

            /** @var ContentMeta $cachedContent */
            $cachedContent = Cache::get($slug);

            return $cachedContent;
        }

        $filePaths = self::getMarkdownFilePaths();
        $existingFile = collect($filePaths)
            ->first(fn (string $filePath) => Str::contains($filePath, $slug, true));

        if (! isset($existingFile)) {
            Log::warning("$slug content meta was not found");

            return null;
        }

        return self::intoContentMeta($existingFile, $slug);
    }

    /**
     * Grab the current list of applicable content file paths.
     * We can cache these as they're only ever updated on deployment,
     * avoiding the need for unnecessary file systems reads.
     *
     * @return string[]
     */
    public function getMarkdownFilePaths(): array
    {
        if (Cache::has(self::FILEPATHS_CACHE_KEY)) {
            Log::info('cached files found');

            /** @var string[] $filePaths */
            $filePaths = Cache::get(self::FILEPATHS_CACHE_KEY);

            return $filePaths;
        }

        $basePath = base_path();
        $contentPath = "$basePath".'/content';

        Log::info("identified content path as $contentPath, globbing content files");

        /** @var string[] $files */
        $files = app()->environment() === 'local'
            ? glob("$contentPath/**/*.md", GLOB_BRACE)
            : glob("$contentPath/*[!draft]/*.md", GLOB_BRACE);

        $fileCount = count($files);

        Log::info("$fileCount globbed files found, updating cache");

        Cache::forever(self::FILEPATHS_CACHE_KEY, $files);

        return $files;
    }

    private function intoContentMeta(string $filePath, string $slug): ContentMeta
    {
        $info = pathinfo($filePath);
        $fileName = basename($filePath, '.'.$info['extension']);
        $viewCount = ViewCount::firstWhere('slug', $slug)?->views ?? 0;

        /** @var string $contents */
        $contents = file_get_contents($filePath);
        $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser());
        $parsedContent = $frontMatterParser->parse($contents);
        $frontMatter = $parsedContent->getFrontMatter();
        $markdown = $parsedContent->getContent();
        $html = app(MarkdownRenderer::class)
            ->highlightTheme('github-dark')
            ->toHtml($markdown);
        $contentMeta = new ContentMeta($frontMatter, $html, $fileName, $viewCount);

        Log::info("adding $slug content file to cache");

        Cache::set($slug, $contentMeta);

        return $contentMeta;
    }

    public function allFrontMatters(): array
    {
        $filePaths = self::getMarkdownFilePaths();
        $viewCounts = ViewCount::all(['slug', 'views']);

        /** @var FrontMatter[] $frontMatters */
        $frontMatters = collect($filePaths)
            // Map each of the file paths into their respective contents and propagate the slug
            ->map(function (string $filePath) {
                $info = pathinfo($filePath);
                $fileName = basename($filePath, '.'.$info['extension']);

                return [
                    'contents' => file_get_contents($filePath),
                    'slug' => $fileName,
                ];
            })
            // Map each meta object into a parsed frontmatter object
            ->map(function (array $fileMeta) {
                /** @var string $contents */
                $contents = $fileMeta['contents'];
                $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser());

                return [
                    'parsedFrontMatter' => $frontMatterParser->parse($contents),
                    ...$fileMeta,
                ];
            })
            ->map(function (array $fileMeta) {
                /** @var MarkdownInputWithFrontMatter $parsedFrontMatter */
                $parsedFrontMatter = $fileMeta['parsedFrontMatter'];

                return [
                    'frontMatter' => $parsedFrontMatter->getFrontMatter(),
                    ...$fileMeta,
                ];
            })
            ->map(function (array $fileMeta) use ($viewCounts) {
                /** @var string $slug */
                $slug = $fileMeta['slug'];
                $viewCount = $viewCounts->firstWhere('slug', $slug)?->views ?? 0;

                return new FrontMatter($fileMeta['frontMatter'], $fileMeta['slug'], $viewCount);
            })
            ->toArray();

        return $frontMatters;
    }

    public function addViewCount(string $slug): void
    {
        $currentViewCount = ViewCount::firstOrCreate(['slug' => $slug]);

        if ($currentViewCount->wasRecentlyCreated) {
            $currentViewCount->refresh();
        } else {
            $currentViewCount->update([
                'views' => $currentViewCount->views + 1,
            ]);
        }
    }
}
