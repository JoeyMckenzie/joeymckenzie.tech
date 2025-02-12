<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentUtilityContract;
use App\ValueObjects\ContentMeta;
use App\ValueObjects\FrontMatter;
use Illuminate\Support\Facades\Log;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use League\CommonMark\Extension\Table\TableExtension;
use Override;
use Spatie\LaravelMarkdown\MarkdownRenderer;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;

/**
 * @phpstan-import-type FrontMatterSchema from FrontMatter
 */
final readonly class MarkdownContentUtility implements ContentUtilityContract
{
    public function __construct(private MarkdownRenderer $renderer) {}

    #[Override]
    public function getMarkdownFilePaths(): array
    {
        $basePath = base_path();
        $contentPath = "$basePath".'/content';

        Log::info('Globbing content files', [
            'contentPath' => $contentPath,
        ]);

        /** @var list<string> $files */
        $files = app()->environment() === 'local'
            ? glob("$contentPath/**/*.md", GLOB_BRACE)
            : glob("$contentPath/*[!draft]/*.md", GLOB_BRACE);

        Log::info('Files accumulated', [
            'files' => count($files),
        ]);

        return $files;
    }

    #[Override]
    public function getParsedContent(string $filePath): ContentMeta
    {
        Log::withContext([
            'filePath' => $filePath,
        ]);

        Log::info('Parsing content');

        /** @var string $contents */
        $contents = file_get_contents($filePath);

        /** @var array{dirname:string, basename:string, extension:string, filename:string} $fileInfo */
        $fileInfo = pathinfo($filePath);
        $extension = $fileInfo['extension'] === ''
            ? ''
            : '.'.$fileInfo['extension'];
        $fileSlug = basename($filePath, $extension);

        Log::info('File successfully parsed', [
            'fileSlug' => $fileSlug,
        ]);

        $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser);
        $parsedContent = $frontMatterParser->parse($contents);

        /** @var FrontMatterSchema $frontMatter */
        $frontMatter = $parsedContent->getFrontMatter();
        $markdown = $parsedContent->getContent();
        $html = $this->renderer
            ->addExtension(new TableExtension)
            ->highlightTheme('tokyo-night')
            ->toHtml($markdown);

        Log::info('Frontmatter and content parsed');

        return new ContentMeta($fileSlug, $markdown, $html, $frontMatter);
    }

    #[Override]
    public function generateSitemap(): Sitemap
    {
        /** @var string $url */
        $url = config('app.url');
        $siteMap = SitemapGenerator::create($url)->getSitemap();

        return $siteMap
            ->add(Url::create('/')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))
            ->add(Url::create('/now')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY));
    }
}
