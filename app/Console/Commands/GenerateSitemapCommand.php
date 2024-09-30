<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\ContentUtilityContract;
use Illuminate\Console\Command;

final class GenerateSitemapCommand extends Command
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
    public function handle(ContentUtilityContract $contentUtility): void
    {
        $publicPath = public_path();
        $outputFile = "$publicPath/sitemap-index.xml";

        if (file_exists($outputFile)) {
            unlink($outputFile);
        }

        $siteMapFile = $contentUtility->generateSitemap();
        $siteMapFile->writeToFile($outputFile);
    }
}
