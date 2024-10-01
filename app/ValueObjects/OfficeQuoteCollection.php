<?php

declare(strict_types=1);

namespace App\ValueObjects;

use ArrayIterator;
use IteratorAggregate;
use Override;
use Traversable;

/**
 * @implements IteratorAggregate<int, OfficeQuote>
 */
final class OfficeQuoteCollection implements IteratorAggregate
{
    /** @var OfficeQuote[] */
    private array $quotes = [];

    /**
     * @param  array<int, array{quote: string, author: string}>  $data
     */
    public function __construct(array $data)
    {
        foreach ($data as $quote) {
            $this->quotes[] = new OfficeQuote($quote);
        }
    }

    #[Override]
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->quotes);
    }

    public function getRandomQuote(): OfficeQuote
    {
        return $this->quotes[array_rand($this->quotes)];
    }
}
