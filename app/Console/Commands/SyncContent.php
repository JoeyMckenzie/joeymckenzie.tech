<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use App\Models\ContentMeta;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use League\CommonMark\ConverterInterface;
use League\CommonMark\Exception\CommonMarkException;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use League\Config\Exception\ConfigurationExceptionInterface;

final class SyncContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-content';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs content from markdown files into the database.';

    /**
     * Execute the console command.
     */
    public function handle(ConverterInterface $converter): void
    {
        $files = self::getMarkdownFilePaths();
        collect($files)
            ->map(fn (string $filePath) => self::getParsedContent($filePath, $converter))
            ->each(fn (ContentMeta $contentMeta) => self::intoBlogPost($contentMeta));
    }

    /**
     * @return string[]
     */
    private function getMarkdownFilePaths(): array
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

    /**
     * @throws ConfigurationExceptionInterface
     * @throws CommonMarkException
     */
    private function getParsedContent(string $filePath, ConverterInterface $converter): ContentMeta
    {
        Log::info("parsing content for file $filePath");

        /** @var string $contents */
        $contents = file_get_contents($filePath);
        $fileInfo = pathinfo($filePath);
        $extension = empty($fileInfo['extension'])
            ? ''
            : '.'.$fileInfo['extension'];
        $fileSlug = basename($filePath, $extension);

        Log::info("file parsed, determined slug as $fileSlug");

        $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser());
        $parsedContent = $frontMatterParser->parse($contents);
        $frontMatter = $parsedContent->getFrontMatter();
        $markdown = $parsedContent->getContent();
        $html = $converter->convert($markdown);

        Log::info('frontmatter and content parsed, retrieving view count from neon');

        return new ContentMeta($fileSlug, $markdown, $html, $frontMatter);
    }

    private function intoBlogPost(ContentMeta $contentMeta): BlogPost
    {
        $contentSlug = $contentMeta->slug;

        Log::info("upserting blog post $contentSlug");

        return BlogPost::updateOrCreate([
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
    }
}
