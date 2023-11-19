<?php

declare(strict_types=1);

namespace App\Utilities;

use App\Models\ContentMeta;
use Illuminate\Support\Facades\Cache;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterExtension;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use League\CommonMark\MarkdownConverter;

final readonly class ContentCache
{
    public static function initContentCache(): void
    {
        logger('loading content cache');

        $environment = new Environment();
        $environment->addExtension(new CommonMarkCoreExtension());
        $environment->addExtension(new FrontMatterExtension());

        $converter = new MarkdownConverter($environment);
        $basePath = base_path();
        $contentPath = "$basePath".'/content';
        $files = glob("$contentPath/**/*.md", GLOB_BRACE);

        foreach ($files as $filePath) {
            $info = pathinfo($filePath);
            $fileName = basename($filePath, '.'.$info['extension']);

            logger("parsing content for $fileName");

            $contents = file_get_contents($filePath);
            $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser());
            $parsedContent = $frontMatterParser->parse($contents);

            $frontMatter = $parsedContent->getFrontMatter();
            $documentContent = $parsedContent->getContent();
            $contentMeta = new ContentMeta($frontMatter, $converter->convert($documentContent)->getContent());

            Cache::set($fileName, $contentMeta);

            logger('file successfully parsed and added to cache');
        }
    }

    public function getContentMeta(string $slug): ?ContentMeta
    {
        if (! Cache::has($slug)) {
            logger("content meta for slug $slug was not found");

            return null;
        }

        return Cache::get($slug);
    }
}
