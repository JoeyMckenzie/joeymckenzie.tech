<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use App\Models\ViewCount;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class SyncViews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-views';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs views between Neon and PlanetScale.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $files = self::getMarkdownFilePaths();
        $connection = DB::connection('pgsql');
        /** @var Collection<int, ViewCount> $viewCounts */
        $viewCounts = $connection->table('view_counts')->select(['slug', 'view_count'])->get();

        foreach ($files as $file) {
            $fileInfo = pathinfo($file);
            $fileSlug = basename($file, '.'.$fileInfo['extension']);
            $views = $viewCounts->firstOrFail(fn (mixed $viewCount) => $viewCount->slug === $fileSlug)->view_count;

            BlogPost::firstWhere('slug', $fileSlug)
                ?->update([
                    'views' => $views,
                ]);
        }
    }

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
}
