<?php

namespace App\Console\Commands;

use App\Models\ViewCount;
use App\Services\MarkdownContentRepository;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Str;

final class SyncViewCounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-view-counts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs view counts between Neon and Planetscale databases.';

    /**
     * Attempt to sync view counts between Neon and PlanetScale databases.
     */
    public function handle(): void
    {
        // First, query all the relevant content from Neon
        $markdownContentRepo = new MarkdownContentRepository;
        $filePaths = $markdownContentRepo->getMarkdownFilePaths();
        $connection = DB::connection('pgsql');
        $viewCounts = $connection->select('SELECT slug, view_count FROM view_counts');

        // Sift through each of the current production slugs and match the view counts
        foreach ($viewCounts as $viewCount) {
            if (property_exists($viewCount, 'slug') && property_exists($viewCount, 'view_count')) {
                $slug = $viewCount->slug;
                $matchingFileContent = collect($filePaths)
                    ->first(fn (string $filePath) => Str::contains($filePath, $slug));

                // If we find a matching slug with the current file content,
                // update PlanetScale with the view count to keep them in sync
                if (isset($matchingFileContent)) {
                    ViewCount::updateOrCreate([
                        'slug' => $slug,
                    ], [
                        'views' => $viewCount->view_count,
                    ]);
                }
            }
        }
    }
}
