<?php

namespace App\Models;

final readonly class FrontMatter
{
    public string $title;

    public string $description;

    public string $pubDate;

    public string $heroImage;

    public string $category;

    /** @var string[] */
    public array $keywords;

    public function __construct(mixed $frontMatter, public string $slug)
    {
        $this->title = $frontMatter['title'];
        $this->description = $frontMatter['description'];
        $this->pubDate = $frontMatter['pubDate'];
        $this->heroImage = $frontMatter['heroImage'];
        $this->category = $frontMatter['category'];
        $this->keywords = $frontMatter['keywords'];
    }
}
