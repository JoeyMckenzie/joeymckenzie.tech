<?php

declare(strict_types=1);

namespace App\Utilities;

use App\Models\ContentMeta;
use App\Models\FrontMatter;
use DateTime;
use Illuminate\Support\Facades\Cache;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterExtension;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use League\CommonMark\Extension\SmartPunct\SmartPunctExtension;
use League\CommonMark\Extension\Strikethrough\StrikethroughExtension;
use League\CommonMark\MarkdownConverter;
use Spatie\LaravelMarkdown\MarkdownRenderer;

final readonly class ContentCache
{
    public static function initContentCache(): void
    {
        // logger('loading content cache');

        $converter = self::initMarkdownConverter();
        $basePath = base_path();
        $contentPath = "$basePath".'/content';

        /** @var string[] $files */
        $files = app()->environment() === 'local'
            ? glob("$contentPath/**/*.md", GLOB_BRACE)
            : glob("$contentPath/*[!draft]/*.md", GLOB_BRACE);

        /** @var string[] $fileNames */
        $fileNames = [];

        foreach ($files as $filePath) {
            $fileNames[] = self::cacheMarkdownFile($filePath, $converter);
        }

        Cache::forever('fileNames', $fileNames);
    }

    private static function initMarkdownConverter(): MarkdownConverter
    {
        $environment = (new Environment())
            ->addExtension(new CommonMarkCoreExtension())
            ->addExtension(new FrontMatterExtension())
            ->addExtension(new SmartPunctExtension())
            ->addExtension(new StrikethroughExtension());

        return new MarkdownConverter($environment);
    }

    private static function cacheMarkdownFile(string $filePath, MarkdownConverter $converter): string
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
    public function getContentMetas(bool $includeLatest = false): array
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

        return $asFrontMatterArray;
    }
}
