<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentUtilityContract;
use App\Models\Post;
use App\ValueObjects\ContentMeta;
use Illuminate\Support\Facades\Log;
use League\CommonMark\ConverterInterface;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use Override;

final readonly class MarkdownUtility implements ContentUtilityContract
{
    private ConverterInterface $converter;

    public function __construct(ConverterInterface $converter)
    {
        $this->converter = $converter;
    }

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
        $frontMatter = $parsedContent->getFrontMatter();
        $markdown = $parsedContent->getContent();
        $html = $this->converter->convert($markdown)->getContent();

        Log::info('frontmatter and content parsed');

        return new ContentMeta($fileSlug, $markdown, $html, $frontMatter);
    }

    #[Override]
    public function upsertBlogPost(ContentMeta $contentMeta): Post
    {
        $contentSlug = $contentMeta->slug;

        Log::info("upserting blog post $contentSlug");

        $upsertedBlog = Post::updateOrCreate([
            'slug' => $contentSlug,
        ], [
            'slug' => $contentSlug,
            'title' => $contentMeta->frontMatter->title,
            'description' => $contentMeta->frontMatter->description,
            'category' => $contentMeta->frontMatter->category,
            'published_date' => $contentMeta->frontMatter->pubDate,
            'hero_image' => $contentMeta->frontMatter->heroImage,
            'keywords' => implode(',', $contentMeta->frontMatter->keywords),
            'raw_content' => $contentMeta->markdown,
            'parsed_content' => $contentMeta->html,
        ]);

        Log::info('blog content updated!');

        return $upsertedBlog;
    }
}
