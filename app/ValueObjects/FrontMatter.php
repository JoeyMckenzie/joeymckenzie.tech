<?php

declare(strict_types=1);

namespace App\ValueObjects;

/**
 * @phpstan-type FrontMatterSchema array{
 *     title: string,
 *     description: string,
 *     keywords: string[],
 *     pubDate: string,
 *     heroImage: string,
 *     category: string
 * }
 */
final readonly class FrontMatter
{
    /**
     * @param  FrontMatterSchema  $data
     */
    public function __construct(public array $data) {}
}
