<?php

declare(strict_types=1);

namespace App\Contracts;

use App\ValueObjects\ContentMeta;
use Spatie\Sitemap\Sitemap;

interface ContentUtilityContract
{
    /**
     * @return string[]
     */
    public function getMarkdownFilePaths(): array;

    public function getParsedContent(string $filePath): ContentMeta;

    public function generateSitemap(): Sitemap;
}
