<?php

namespace App\Models;

final readonly class ContentMeta
{
    public FrontMatter $frontMatter;

    public function __construct(
        mixed $rawFrontMatter,
        public string $content
    ) {
        $this->frontMatter = new FrontMatter($rawFrontMatter);
    }
}
