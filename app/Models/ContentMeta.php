<?php

declare(strict_types=1);

namespace App\Models;

final readonly class ContentMeta
{
    public FrontMatter $frontMatter;

    public function __construct(
        public string $slug,
        public string $markdown,
        public string $html,
        mixed $frontMatter
    ) {
        $this->frontMatter = new FrontMatter($frontMatter);
    }
}
