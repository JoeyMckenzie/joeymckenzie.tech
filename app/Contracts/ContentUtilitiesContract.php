<?php

namespace App\Contracts;

use App\Models\BlogPost;
use App\Models\ContentMeta;
use League\CommonMark\Exception\CommonMarkException;
use League\Config\Exception\ConfigurationExceptionInterface;

interface ContentUtilitiesContract
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

    public function intoBlogPost(ContentMeta $contentMeta): BlogPost;
}
