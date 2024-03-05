---
title: 'PHP and beer: Building better DX'
description: "It's 2024... and PHP still isn't dead?!"
pubDate: 'March 05 2024'
heroImage: '/images/php-dx/meme.jpeg'
category: 'php'
keywords:
    - php
    - beer
    - libraries
---

I'm back on my bullshit (as the kids say) and decided that it was time to jump back into a project of some sort to keep my sanity.
I've been chasing an almost one-year-old around the house lately and needed a little reprieve in the form of writing some
PHP on my epic quest to become the internet's token PHPman. Coincidentally, I've also been scouring the [Open Brewery DB](https://openbrewerydb.org/) API and decided to bring holy matrimony to two of my loves in PHP and craft beer. The culmination of the two resulted in
a [package I published to Packagist](https://packagist.org/packages/joeymckenzie/openbrewerydb-php-api), and I thought it would be fun to write about the great DX I strapped together that made writing PHP an _absolute_ blast (I hope that's not the first time that sentence has been
said on the internet).

## Liquid motivation

If you haven't noticed, I write about beer quite a bit here mostly in the form of code examples. One of my favorite ways
to really dive deep into a language is to build a library of some sort, and it was time to scratch that itch with PHP. After
sifting through a bunch of great libraries written by PHP folks much more versed in the language than myself, I stumbled
upon [Nuno Maduro](https://github.com/nunomaduro)'s library providing a [PHP client](https://github.com/openai-php/client) for the Open AI API.
I enjoyed the style that the library was written in and took a lot of influence from it while building my PHP client for Open Brewery DB.

A few things really stood out to me as a journeyman PHP'er:

## B.Y.O.C. (Bring Your Own Client)

[PSR-18](https://www.php-fig.org/psr/psr-18/) calls for HTTP client implementations to adhere to a strict contract. Doing so allows consumers of the library to bring their favorite HTTP client without library internals causing compatibility issues. Whether the client provided
is [Guzzle](https://docs.guzzlephp.org/en/stable/) or [Symfony's standalone HTTP client](https://symfony.com/doc/current/http_client.html),
the library's only assumption is that it's a PSR-18 compliant client. This allows for a lot of flexibility when instantiating
a client, even allowing consumers to configure they're own client in a fluent builder like fashion:

```php
<?php

declare(strict_types=1);

namespace OpenBreweryDb;

use Http\Discovery\Psr18ClientDiscovery;
use OpenBreweryDb\Http\Connector;
use OpenBreweryDb\ValueObjects\Connector\BaseUri;
use OpenBreweryDb\ValueObjects\Connector\Headers;
use OpenBreweryDb\ValueObjects\Connector\QueryParams;
use Psr\Http\Client\ClientInterface;

/**
 * Client builder/factory for configuring the API connector to Open Brewery DB.
 */
final class Builder
{
    /**
     * The HTTP client for the requests.
     */
    private ?ClientInterface $httpClient = null;

    // ...other configurations

    /**
     * Sets the HTTP client for the requests. If no client is provided the
     * factory will try to find one using PSR-18 HTTP Client Discovery.
     */
    public function withHttpClient(ClientInterface $client): self
    {
        $this->httpClient = $client;

        return $this;
    }

    // ...other builder options

    /**
     * Creates a new Open Brewery DB client based on the provided builder options.
     */
    public function build(): Client
    {
        $headers = Headers::create();

        // For any default headers configured for the client, we'll add those to each outbound request
        foreach ($this->headers as $name => $value) {
            $headers = $headers->withCustomHeader($name, $value);
        }

        $baseUri = BaseUri::from(Client::API_BASE_URL);
        $queryParams = QueryParams::create();

        // As with the headers, we'll also include any query params configured on each request
        foreach ($this->queryParams as $name => $value) {
            $queryParams = $queryParams->withParam($name, $value);
        }

        $client = $this->httpClient ??= Psr18ClientDiscovery::find();
        $connector = new Connector($client, $baseUri, $headers, $queryParams);

        return new Client($connector);
    }
}
```

Even more awesome is the ability to have composer autodiscover the HTTP client a user has installed in their application
with the help of the [php-http/discover](https://packagist.org/packages/php-http/discovery) package. From the code above,
if a consumer of the library decides to use the client of their choice, it's as simple as wiring it up whenever they want to use it:

```php
<?php

declare(strict_types=1);

use OpenBreweryDb\OpenBreweryDb;

require_once __DIR__.'/../vendor/autoload.php';


// Using the client builder with PSR HTTP client autodiscovery,
// we can use any PSR-17 compliant client library. This makes
// it relatively simple to swap providers without having to
// change the internal API connections and implementation. In
// the following example, Guzzle's HTTP client is used, though
// this could easily be swapped out for Symfony's client as well.

$guzzleClient = new GuzzleHttp\Client([
    'timeout' => 5,
]);

$openBreweryDbClient = OpenBreweryDb::builder()
    ->withHttpClient($guzzleClient)
    ->withHeader('foo', 'bar')
    ->build();

// Get a list of breweries, based on all types of different search criteria
$breweries = $openBreweryDbClient->breweries()->list([
    'by_city' => 'Sacramento',
]);
var_dump($breweries);

// Retrieve various metadata about breweries from the API
$metadata = $openBreweryDbClient->breweries()->metadata();
var_dump($metadata);

// Get a random brewery with a specified page size
$randomBrewery = $openBreweryDbClient->breweries()->random(5);
var_dump($randomBrewery);

// Since we're not limited to a specific HTTP client, we can mix and match
// depending on what client you have installed or want to use.
$symfonyClient = (new Symfony\Component\HttpClient\Psr18Client())->withOptions([
    'headers' => ['symfony' => 'is-awesome'],
]);

$openBreweryDbClientWithSymfony = OpenBreweryDb::builder()
    ->withHttpClient($symfonyClient)
    ->withHeader('foo', 'bar')
    ->build();

// Get a list of breweries, based on all types of different search criteria
$breweries = $openBreweryDbClientWithSymfony->breweries()->list([
    'by_city' => 'Sacramento',
]);
var_dump($breweries);

// Retrieve various metadata about breweries from the API
$metadata = $openBreweryDbClientWithSymfony->breweries()->metadata();
var_dump($metadata);

// Get a random brewery with a specified page size
$randomBrewery = $openBreweryDbClientWithSymfony->breweries()->random(5);
var_dump($randomBrewery);
```

In the case consumers don't explicitly provide their client, autodiscovery will kick in and search for a PSR-18 compliant client
and use that to fulfill the contractual obligation of PSR-18. Neat!

## Treating responses as arrays

One of my favorite features of PHP is associative arrays or PHP's version of anonymous objects which are quite handy and
akin to their counterparts in JavaScript or C#. One of the more annoying things when writing an API client, especially one
not officially associated with the API it's wrapping, is keeping up with data contracts from the various endpoints. I found
that treating JSON responses like associative arrays allows the API provider to change the shape of the response without
breaking the connective tissue between the library code (to an extent, of course). Because responses can be massaged into
associative arrays, it allows all the niceties of the `array_*` methods that exist in PHP to be bolted onto the response
objects themselves.

A simple way to achieve this behavior is to provide a trait that implements the offset methods for an array:

```php
<?php

declare(strict_types=1);

namespace OpenBreweryDb\Responses\Concerns;

use BadMethodCallException;
use OpenBreweryDb\ValueObjects\Connector\Response;

/**
 * Allows API responses to be treated as arrays, allowing for access through an index to check for properties.
 *
 * @template-covariant TArray of array
 *
 * @mixin Response<TArray>
 *
 * @internal
 */
trait ArrayAccessible
{
    /**
     * {@inheritDoc}
     */
    public function offsetExists(mixed $offset): bool
    {
        return array_key_exists($offset, $this->toArray());
    }

    /**
     * {@inheritDoc}
     */
    public function offsetGet(mixed $offset): mixed
    {
        return $this->toArray()[$offset];
    }

    /**
     * {@inheritDoc}
     */
    public function offsetSet(mixed $offset, mixed $value): never
    {
        throw new BadMethodCallException('Responses are immutable. Values are not allowed to be set on responses.');
    }

    /**
     * {@inheritDoc}
     */
    public function offsetUnset(mixed $offset): never
    {
        throw new BadMethodCallException('Responses are immutable. Values are not allowed to be removed on responses.');
    }
}
```

With `ArrayAccessible` trait in place, we can define contracts that each API response needs to adhere to:

```php
<?php

declare(strict_types=1);

namespace OpenBreweryDb\Contracts;

use ArrayAccess;
use OpenBreweryDb\Contracts\Concerns\Arrayable;

/**
 * Response contracts provide a set of methods allowing responses to be interacted with in a PHP array-like manner.
 *
 * @template TArray of array
 *
 * @extends ArrayAccess<key-of<TArray>, value-of<TArray>>
 * @extends Arrayable<TArray>
 *
 * @internal
 */
interface ResponseContract extends Arrayable, ArrayAccess
{
    /**
     * @param  key-of<TArray>  $offset
     */
    public function offsetExists(mixed $offset): bool;

    /**
     * @template TOffsetKey of key-of<TArray>
     *
     * @param  TOffsetKey  $offset
     * @return TArray[TOffsetKey]
     */
    public function offsetGet(mixed $offset): mixed;

    /**
     * @template TOffsetKey of key-of<TArray>
     *
     * @param  TOffsetKey|null  $offset
     * @param TArray[TOffsetKey] $value
     */
    public function offsetSet(mixed $offset, mixed $value): never;

    /**
     * @template TOffsetKey of key-of<TArray>
     *
     * @param  TOffsetKey  $offset
     */
    public function offsetUnset(mixed $offset): never;
}
```

By extending `ArrayAccess`, all the `implement`ors of `ResponseContract` can `use` the `ArrayAccessible` trait to satisfy
the methods required by the contract. Furthermore with the help of PHPDocs, we can type constrain the generic response
data to be covariant over PHP's native `array`, or simply put, enforce our inheritors to provide _something_ that can be
traced back to an associative `array` type. Take for example a metadata response from Open Brewery DB which will include some
summary-level information about the available breweries within the dataset:

```json
// GET https://api.openbrewerydb.org/v1/breweries/meta
{
    "total": "8247",
    "page": "1",
    "per_page": "50"
}
```

We can encapsulate this response with a `MetadataResponse`:

```php
<?php

declare(strict_types=1);

namespace OpenBreweryDb\Responses\Breweries;

use OpenBreweryDb\Contracts\ResponseContract;
use OpenBreweryDb\Responses\Concerns\ArrayAccessible;
use Override;

/**
 * Metadata response representing only aggregate data about breweries based on the provided query.
 *
 * @see https://openbrewerydb.org/documentation#metadata
 *
 * @implements ResponseContract<array<int, array{total: string, page: string, per_page: string}>>
 */
final readonly class MetadataResponse implements ResponseContract
{
    /**
     * @use ArrayAccessible<array<int, array{total: string, page: string, per_page: string}>>
     */
    use ArrayAccessible;

    /**
     * @param  array<int, array{total: string, page: string, per_page: string}>  $data
     */
    private function __construct(public array $data)
    {
    }

    /**
     * Acts as static factory, and returns a new Response instance.
     *
     * @param  array<int, array{total: string, page: string, per_page: string}>  $attributes
     */
    public static function from(array $attributes): self
    {
        return new self($attributes);
    }

    /**
     * {@inheritDoc}
     */
    #[Override]
    public function toArray(): array
    {
        return $this->data;
    }
}
```

Now anytime we make a call to the API, we'll have typed immutable responses by default:

```php
<?php

declare(strict_types=1);

require_once __DIR__.'/../vendor/autoload.php';

use OpenBreweryDb\OpenBreweryDb;

$client = OpenBreweryDb::client();

// Retrieve various metadata about breweries from the API
$metadata = $client->breweries()->metadata();
var_dump($metadata);

# If we're using an editor with some form of PHP LSP, we'll have autocomplete by default
$total = $metadata['total'];

# This will throw an exception since responses are immutable
$metadata['total'] = 42069; // BAD! Throws an exception!
```

Responses will also have the added benefit of intellisense and immutable protection, so no monkey'ing around with the source
of truth. Man... PHP is _pretty_ cool.

## Strict PHP

Okay, now for my _favorite_ part of PHP. I've been programming professionally for almost a decade now solely with static-typed languages, and duck typing is not something I'm ready to embrace just yet (I'm sure I'll come around to Ruby eventually).
I wanted the same level of type-checking ~~pain~~ assistance I get in other languages like Rust and C#, but in PHP.
Luckily, the solution is [PHPStan] turned up to the max with the additional [strict analysis plugin](https://phpstan.org/config-reference#stricter-analysis). My PHPStan configuration for the library is pretty simple:

```yaml
includes:
    - vendor/phpstan/phpstan-strict-rules/rules.neon

parameters:
    level: max
    paths:
        - src
```

And to keep myself honest, I like to wrap my linting commands within a daemon of sorts to rerun anytime I make source
code changes. There's a bunch of awesome tools out there (watch, fsnotify) though my current favorite is [entr](https://github.com/eradman/entr).
Anytime I want to continuously check that my code is safe and sane, it's just a matter of watching for file changes within
my `src/` directory:

```bash
find src/ | entr -s 'composer run lint'
> ./vendor/bin/phpstan analyze
Note: Using configuration file /Users/jmckenzie/workspace/php/openbrewerydb-php-client/phpstan.neon.dist.
 26/26 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%



 [OK] No errors
```

`find` will list all source files within a directory, where we'll then pipe those into the `entr` command that watches
for any of those files to change and will run my lint script from my `composer.json` file:

```json
{
    // ...other stuff
    "scripts": {
        // ...other scripts
        "lint": "./vendor/bin/phpstan analyze"
    }
}
```

Now anytime I make file changes, the linter runs and allows me to sleep soundly knowing I haven't placed any landmines in
the code (yet...).


## Testing with Pest
