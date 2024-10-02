<?php

declare(strict_types=1);

namespace Examples\Iterators;

final readonly class BeerBuilder
{
    private Beer $beer;

    public function __construct()
    {
        $this->beer = new Beer;
    }

    public function withName(string $name): self
    {
        $this->beer->name = $name;

        return $this;
    }

    public function withAbv(float $abv): self
    {
        $this->beer->abv = $abv;

        return $this;
    }

    public function withIbu(int $ibu): self
    {
        $this->beer->ibu = $ibu;

        return $this;
    }

    public function withBreweryId(int $breweryId): self
    {
        $this->beer->breweryId = $breweryId;

        return $this;
    }

    public function build(): Beer
    {
        return $this->beer;
    }
}
