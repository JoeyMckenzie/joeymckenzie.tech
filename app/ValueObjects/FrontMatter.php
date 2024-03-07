<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Exception;

final readonly class FrontMatter
{
    public string $title;

    public string $description;

    public string $pubDate;

    public string $heroImage;

    public string $category;

    /** @var string[] */
    public array $keywords;

    /**
     * @throws Exception
     */
    public function __construct(mixed $frontMatter)
    {
        if (! is_array($frontMatter)) {
            throw new Exception('Frontmatter structure is not an expected array');
        }

        $this->title = $frontMatter['title'] ?? '';
        $this->description = $frontMatter['description'] ?? '';
        $this->keywords = $frontMatter['keywords'] ?? '';
        $this->pubDate = $frontMatter['pubDate'] ?? '';
        $this->heroImage = $frontMatter['heroImage'] ?? '';
        $this->category = $frontMatter['category'] ?? '';
    }
}
