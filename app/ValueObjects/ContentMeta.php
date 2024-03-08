<?php

declare(strict_types=1);

namespace App\ValueObjects;

final readonly class ContentMeta
{
    public FrontMatter $frontMatter;

    /**
     * @param  array{title: string, description: string, keywords: string[], pubDate: string, heroImage: string, category: string}  $frontMatter
     */
    public function __construct(
        public string $slug,
        public string $markdown,
        public string $html,
        mixed $frontMatter
    ) {
        $this->frontMatter = new FrontMatter($frontMatter);
    }
}
