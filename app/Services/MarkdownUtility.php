<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentUtilityContract;
use App\Models\Post;
use App\ValueObjects\ContentMeta;
use Illuminate\Support\Facades\Log;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use League\CommonMark\Extension\Table\TableExtension;
use Override;
use Spatie\LaravelMarkdown\MarkdownRenderer;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;

final readonly class MarkdownUtility implements ContentUtilityContract
{
    public function __construct(private MarkdownRenderer $renderer) {}

    #[Override]
    public function getMarkdownFilePaths(): array
    {
        $basePath = base_path();
        $contentPath = "$basePath".'/content';

        Log::info("identified content path as $contentPath, globbing content files");

        /** @var string[] $files */
        $files = app()->environment() === 'local'
            ? glob("$contentPath/**/*.md", GLOB_BRACE)
            : glob("$contentPath/*[!draft]/*.md", GLOB_BRACE);

        $fileCount = count($files);

        Log::info("$fileCount globbed files found");

        return $files;
    }

    #[Override]
    public function getParsedContent(string $filePath): ContentMeta
    {
        Log::info("parsing content for file $filePath");

        /** @var string $contents */
        $contents = file_get_contents($filePath);

        /** @var array{dirname:string, basename:string, extension:string, filename:string} $fileInfo */
        $fileInfo = pathinfo($filePath);
        $extension = $fileInfo['extension'] === ''
            ? ''
            : '.'.$fileInfo['extension'];
        $fileSlug = basename($filePath, $extension);

        Log::info("file parsed, determined slug as $fileSlug");

        $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser());
        $parsedContent = $frontMatterParser->parse($contents);

        /** @var array{title: string, description: string, keywords: string[], pubDate: string, heroImage: string, category: string} $frontMatter */
        $frontMatter = $parsedContent->getFrontMatter();
        $markdown = $parsedContent->getContent();
        $html = $this->renderer
            // ->commonmarkOptions($this->config)
            // ->addExtension(new TableExtension())
            ->highlightTheme('tokyo-night')
            ->toHtml($markdown);

        Log::info('frontmatter and content parsed');

        return new ContentMeta($fileSlug, $markdown, $html, $frontMatter);
    }

    #[Override]
    public function generateSitemap(): Sitemap
    {
        /** @var string $url */
        $url = config('app.url');
        $slugs = Post::select(['slug', 'updated_at'])->get();
        $siteMap = SitemapGenerator::create($url)->getSitemap();

        collect($slugs)
            ->each(function (Post $blogPost) use ($siteMap): void {
                $slug = $blogPost->slug;
                $siteMap
                    ->add(Url::create("/blog/$slug")
                        ->setPriority(0.5)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setLastModificationDate($blogPost->updated_at?->toDate() ?? now()));
            });

        return $siteMap
            ->add(Url::create('/about')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))
            ->add(Url::create('/now')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY));
    }
}
