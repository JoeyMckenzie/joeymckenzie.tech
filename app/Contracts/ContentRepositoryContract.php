<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\ContentMeta;
use App\Models\FrontMatter;

interface ContentRepositoryContract
{
    /**
     * @return FrontMatter[]
     */
    public function allFrontMatters(): array;

    public function getContentMeta(string $slug): ?ContentMeta;

    public function addViewCount(string $slug): void;

    /**
     * @return string[]
     */
    public function getMarkdownFilePaths(): array;
}
