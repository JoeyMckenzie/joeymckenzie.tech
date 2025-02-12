<?php

declare(strict_types=1);

namespace App\ValueObjects;

/**
 * @phpstan-import-type FrontMatterSchema from FrontMatter
 */
final readonly class ContentMeta
{
    public FrontMatter $frontMatter;

    /**
     * @param  FrontMatterSchema  $frontMatter
     */
    public function __construct(
        public string $slug,
        public string $markdown,
        public string $html,
        array $frontMatter
    ) {
        $this->frontMatter = new FrontMatter($frontMatter);
    }
}
