<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\PostImporter;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use SplFileInfo;

#[Signature('posts:import {--images= : Filesystem root the legacy image paths resolve against}')]
#[Description('One-time backfill: import the legacy markdown posts from content/posts into MySQL')]
final class ImportPostsCommand extends Command
{
    /**
     * Idempotent (upserts by slug); run once by hand against production, never
     * on deploy, so it can't clobber later admin edits.
     */
    public function handle(PostImporter $importer): int
    {
        $imagesOption = $this->option('images');
        $imagesRoot = is_string($imagesOption) && $imagesOption !== ''
            ? $imagesOption
            : base_path('../joeymckenzie.tech.old/main/public/assets/images');

        $files = array_filter(
            File::files(base_path('content/posts')),
            fn (SplFileInfo $file): bool => $file->getExtension() === 'md',
        );

        foreach ($files as $file) {
            $importer->import(File::get($file->getPathname()), $imagesRoot);
            $this->line('Imported '.$file->getFilename());
        }

        $this->info(sprintf('Imported %d posts', count($files)));

        return self::SUCCESS;
    }
}
