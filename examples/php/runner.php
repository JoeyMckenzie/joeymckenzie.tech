<?php

declare(strict_types=1);

namespace Examples;

require_once __DIR__.'/Iterators/BeerCollection.php';
require_once __DIR__.'/Iterators/Beer.php';

use Examples\Iterators\BeerCollection;

$collection = new BeerCollection;
$collection->addBeer('Hexagenia', 7.4, 120);
$collection->addBeer('Sierra Nevada Pale Ale', 5.4, 100);

foreach ($collection as $beer) {
    echo $beer.PHP_EOL.PHP_EOL;
}
