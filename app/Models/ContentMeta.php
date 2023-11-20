<?php

namespace App\Models;

final readonly class ContentMeta
{
    public FrontMatter $frontMatter;

    public string $content;

    public function __construct(
        mixed $rawFrontMatter,
        string $convertedContent
    ) {
        $this->frontMatter = new FrontMatter($rawFrontMatter);
        $this->content = $convertedContent;
    }
}
