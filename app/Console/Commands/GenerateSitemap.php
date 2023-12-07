<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use Illuminate\Console\Command;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-sitemap';

    /**
     * The console command description.
     *
     * @var string
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
            return;
        }

        $slugs = BlogPost::select(['slug', 'updated_at'])->get();

        $siteMap = SitemapGenerator::create($url)->getSitemap();

        collect($slugs)
            ->each(function (BlogPost $blogPost) use ($siteMap) {
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
