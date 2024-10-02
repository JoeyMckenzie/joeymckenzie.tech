<?php

declare(strict_types=1);

namespace Examples\Iterators;

use ArrayIterator;
use IteratorAggregate;
use Traversable;

/**
 * @template IteratorAggregate<int, Beer>
 */
final class BeerCollection implements IteratorAggregate
{
    /** @var Beer[] */
    private array $beers = [];

    #[\Override]
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->beers);
    }

    public function addBeer(Beer $beer): void
    {
        $beer = (new BeerBuilder)
            ->withName('test')
            ->withIbu(2)
            ->build();

        $this->beers[] = $beer;
    }
}
