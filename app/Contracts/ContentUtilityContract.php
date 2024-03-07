<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\Post;
use App\ValueObjects\ContentMeta;
use League\CommonMark\Exception\CommonMarkException;
use League\Config\Exception\ConfigurationExceptionInterface;

interface ContentUtilityContract
{
    /**
     * @return string[]
     */
    public function getMarkdownFilePaths(): array;

    /**
     * @throws ConfigurationExceptionInterface
     * @throws CommonMarkException
     */
    public function getParsedContent(string $filePath): ContentMeta;

    public function upsertBlogPost(ContentMeta $contentMeta): Post;
}
