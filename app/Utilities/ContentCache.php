<?php

declare(strict_types=1);

namespace App\Utilities;

use App\Models\ContentMeta;
use App\Models\FrontMatter;
use DateTime;
use Illuminate\Support\Facades\Cache;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use Spatie\LaravelMarkdown\MarkdownRenderer;

final readonly class ContentCache
{
    public static function initContentCache(): void
    {
        $basePath = base_path();
        $contentPath = "$basePath".'/content';

        /** @var string[] $files */
        $files = app()->environment() === 'local'
            ? glob("$contentPath/**/*.md", GLOB_BRACE)
            : glob("$contentPath/*[!draft]/*.md", GLOB_BRACE);

        /** @var string[] $fileNames */
        $fileNames = [];

        foreach ($files as $filePath) {
            $fileNames[] = self::cacheMarkdownFile($filePath);
        }

        cache()->forever('fileNames', $fileNames);
    }

    private static function cacheMarkdownFile(string $filePath): string
    {
        $info = pathinfo($filePath);
        $fileName = basename($filePath, '.'.$info['extension']);

        /** @var string $contents */
        $contents = file_get_contents($filePath);
        $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser());
        $parsedContent = $frontMatterParser->parse($contents);
        $frontMatter = $parsedContent->getFrontMatter();

        $html = app(MarkdownRenderer::class)
            ->highlightTheme('github-dark')
            ->toHtml($parsedContent->getContent());

        $contentMeta = new ContentMeta($frontMatter, $html, $fileName);

        Cache::forever($fileName, $contentMeta);

        return $fileName;
    }

    public function getContentMeta(string $slug): ?ContentMeta
    {
        if (! Cache::has($slug)) {
            logger("content meta for slug $slug was not found");

            return null;
        }

        /** @var ContentMeta $contentMeta */
        $contentMeta = Cache::get($slug);

        return $contentMeta;
    }

    /**
     * @return FrontMatter[]
     */
    public function getFrontMatters(bool $includeLatest = false): array
    {
        /** @var string[] $files */
        $files = Cache::get('fileNames');
        $frontMatters = collect($files)
            ->map(function (string $fileName): FrontMatter {
                /** @var ContentMeta $contentMeta */
                $contentMeta = Cache::get($fileName);

                return $contentMeta->frontMatter;
            })
            ->sortByDesc(fn (FrontMatter $frontMatter) => new DateTime($frontMatter->pubDate));

        if ($includeLatest) {
            $frontMatters = $frontMatters->slice(0, 3);
        }

        /** @var FrontMatter[] $asFrontMatterArray */
        $asFrontMatterArray = $frontMatters->toArray();

        return array_values($asFrontMatterArray);
    }
}
