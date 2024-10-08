<?php

declare(strict_types=1);

namespace Examples\Iterators;

use ArrayIterator;
use IteratorAggregate;
use Override;
use Traversable;

/**
 * @implements IteratorAggregate<int, Beer>
 */
final class BeerCollection implements IteratorAggregate
{
    /** @var Beer[] */
    private array $beers = [];

    #[Override]
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->beers);
    }

    public function addBeer(string $name, float $abv, int $ibu): void
    {
        $beer = new Beer($name, $abv, $ibu);
        $this->beers[] = $beer;
    }
}
