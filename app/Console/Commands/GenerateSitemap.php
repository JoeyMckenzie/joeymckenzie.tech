<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;

final class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:sitemap';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Generates the sitemap.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        /** @var string $url */
        $url = config('app.url');
        $publicPath = public_path();
        $outputFile = "$publicPath/sitemap-index.xml";

        if (file_exists($outputFile)) {
            unlink($outputFile);
        }

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

        $siteMap
            ->add(Url::create('/about')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))
            ->add(Url::create('/now')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))
            ->writeToFile($outputFile);
    }
}
