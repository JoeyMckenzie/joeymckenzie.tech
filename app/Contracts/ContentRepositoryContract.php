<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\ContentMeta;
use App\Models\FrontMatter;

interface ContentRepositoryContract
{
    /**
     * Retrieves a list of all frontmatters for all content files.
     * These are cached as they are only subject to change on deployment.
     *
     * @return FrontMatter[]
     */
    public function allFrontMatters(): array;

    /**
     * Returns an aggregate view of a blog post containing its
     * frontmatter descriptors, current view count, and parsed content.
     *
     * @param  string  $slug slug based on the request, unvalidated.
     * @return ContentMeta|null if the slug doesn't exist, no content meta is returned.
     */
    public function getContentMeta(string $slug): ?ContentMeta;

    /**
     * Returns an aggregate view of a blog post containing its
     * frontmatter descriptors, current view count, and parsed content.
     */
    public function cacheContentMetas(): void;

    /**
     * Updates the view count of a blog post by an additional reader.
     *
     * @param  string  $slug slug based on the request, unvalidated.
     */
    public function addViewCount(string $slug): void;

    /**
     * Grab the current list of applicable content file paths.
     * We can cache these as they're only ever updated on deployment,
     * avoiding the need for unnecessary file systems reads.
     *
     * @return string[]
     */
    public function getMarkdownFilePaths(): array;
}
