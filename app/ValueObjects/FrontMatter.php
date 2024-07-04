<?php

declare(strict_types=1);

namespace App\ValueObjects;

final readonly class FrontMatter
{
    /**
     * @param  array{title: string, description: string, keywords: string[], pubDate: string, heroImage: string, category: string}  $data
     */
    public function __construct(public array $data) {}
}
