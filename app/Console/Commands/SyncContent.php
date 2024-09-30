<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\ContentUtilityContract;
use App\Models\Keyword;
use App\Models\Post;
use App\ValueObjects\ContentMeta;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

final class SyncContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'content:sync';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Syncs content from markdown files into the database.';

    /**
     * Execute the console command.
     *
     * @throws Throwable
     */
    public function handle(ContentUtilityContract $contentUtility): void
    {
        $files = $contentUtility->getMarkdownFilePaths();

        collect($files)
            ->map(fn (string $filePath): ContentMeta => $contentUtility->getParsedContent($filePath))
            ->each(fn (ContentMeta $contentMeta) => self::upsertBlogPost($contentMeta));
    }

    private function upsertBlogPost(ContentMeta $contentMeta): void
    {
        $contentSlug = $contentMeta->slug;

        Log::info("upserting blog post $contentSlug");

        $upsertedBlog = Post::updateOrCreate([
            'slug' => $contentSlug,
        ], [
            'slug' => $contentSlug,
            'title' => $contentMeta->frontMatter->data['title'],
            'description' => $contentMeta->frontMatter->data['description'],
            'category' => $contentMeta->frontMatter->data['category'],
            'published_date' => Carbon::parse($contentMeta->frontMatter->data['pubDate']),
            'hero_image' => $contentMeta->frontMatter->data['heroImage'],
            'raw_content' => $contentMeta->markdown,
            'parsed_content' => $contentMeta->html,
        ]);

        foreach ($contentMeta->frontMatter->data['keywords'] as $keyword) {
            $keyword = Keyword::firstOrCreate(['word' => strtolower($keyword)]);
            $upsertedBlog->keywords()->firstOrCreate(['word' => $keyword->word]);
        }

        Log::info('blog content updated!');
    }
}
