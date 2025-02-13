---
title: 'Sharing types with PHPStan'
description: 'I like my PHP like I like my Rust... statically analyzed.'
pubDate: 'Feb 15 2025'
heroImage: '/images/phpstan-sharing-types/meme.jpeg'
category: 'php'
keywords:
    - phpstan
---

As I delve into the depths of PHP more these days, I find myself more fascinated with how far PHP has come based on
stories of yore from developers that were around in its early days. As a career .NET'er, I've seen my fair share of
legacy codebases riddled with atrocities that should be outlawed within the software development community and
punishable by the highest courts of software law. Approaching a decade working in the enterprise, I'm always fascinated
by the spread of opinion when it comes to safety and speed of delivery within a team and their codebase(s).

On one hand, there's a camp of developers emphasizing the core tenants of design, citing every decision they make back
to a passage within their religious texts by the [Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns/). Safety
is of the utmost importance, tests serve as quasi-documentation, and sweating the details in every line of code within
a PR is the norm.

On the other, there's a general sense of code being "good enough" to serve the purpose for which it was written, and if
it's crunch time, the accompanying codebase quality and insurance checks can slip by the wayside, saving those bits for
a rainy day. The rain has yet to come in many of the codebases, but there's a still chance _someday_.

I tend to fall somewhere in between, usually siding more so with the former group. I used to be deeply rooted within
the first camp, but as I grow more into a curmudgeon, I'm okay with things being good enough as long as it can provide
value to the company and the codebase.

I've been writing more PHP lately for fun and (yet to be seen) profit, simply because I'm growing quite bored .NET
lately. I still love C#, and TypeScript for that matter, but those dang Laracons always seem to spike my FOMO of not
being a Laravel/PHP developer everytime they roll around. I've been working on a
[Hetzner client](https://github.com/hetzner-cloud-php/client) for PHP and wanted to write a bit about how much I love
PHPStan. Yes, I know. There's like a dozen or so Hetzner wrappers on [Packagist](https://packagist.org/?query=hetzner),
but this one is _mine_, and because it's _mine_, it's special to me.

Okay, sorry for rambling. To the code!

## PHP 🤝🏻 Hetzner

So I've been scratching my own itch writing this library. Partly because I ran out of steam writing my wrapper for
[Bluesky](https://packagist.org/packages/joeymckenzie/bluesky-php), and partly due to my mass exodus from Digital Ocean
over to Hetzner for websites and apps I run (including this blog). The power/dollar spent is better in my opinion and
the UI is great.

Alas, fuck the UI. Were programmers. We don't need no stinkin' UI.

For my client, I have an initializer to help spin up an instance to be able to call into Hetzner:

```php
final readonly class Client implements ClientContract
{
    public const string API_BASE_URL = 'https://api.hetzner.cloud/v1';

    public function __construct(
        public ConnectorContract $connector
    ) {
        //
    }

    public function servers(): ServersResourceContract
    {
        return new ServersResource($this->connector);
    }
    
    // ...other resources
}
```

Where a resource will look something like:

```php
/**
 * @phpstan-import-type GetServerResponseSchema from GetServerResponse
 * 
 * ...other type imports
 *
 */
final readonly class ServersResource implements ServersResourceContract
{
    public function __construct(
        public ConnectorContract $connector
    ) {
        //
    }

    public function resource(): string
    {
        return ServersResource::class;
    }

    #[Override]
    public function getServer(int $id): GetServerResponse
    {
        $request = ClientRequestBuilder::get("servers/$id");

        /** @var Response<array<array-key, mixed>> $response */
        $response = $this->connector->sendClientRequest($request);

        /** @var GetServerResponseSchema $data */
        $data = $response->data();

        return GetServerResponse::from($data);
    }
    
    // ...other interactions based on their API
}
```

Something I've been _really_ enjoying and fully embraced in this library are PHPStan type imports. Writing an API client
can be somewhat cumbersome. Every API is different, every provider has a different philosophy on how to serve their
data, etc. I'm running max level PHPStan because I love pain and the Rust compiler thoroughly beaten me into submission.

I've taken the approach to define a resource's response schema in a "resource" class of sorts, and then importing that
schema all throughout my project. It's been great for my productivity, defining type schemas in one place and importing
them where I need them, all while keeping PHPStan happy on level 10 and never having to worry about schema duplication.

I've seen in a few projects where PHPDoc annotated types can fester throughout a module and I wanted to avoid that.
Taking [Hetzner's server APIs](https://docs.hetzner.cloud/#servers) as an example, I'm able to define a server resource:

```php
<?php

declare(strict_types=1);

namespace HetznerCloud\Responses\Models;

use Carbon\CarbonImmutable;
use HetznerCloud\HttpClientUtilities\Contracts\ResponseContract;
use HetznerCloud\HttpClientUtilities\Responses\Concerns\ArrayAccessible;

/**
 * @phpstan-import-type DeprecationSchema from Deprecation
 * @phpstan-import-type DatacenterSchema from Datacenter
 * @phpstan-import-type PlacementGroupSchema from PlacementGroup
 * @phpstan-import-type PrivateNetSchema from PrivateNet
 * @phpstan-import-type PublicNetSchema from PublicNet
 * @phpstan-import-type ProtectionSchema from Protection
 * @phpstan-import-type ServerImageSchema from ServerImage
 * @phpstan-import-type ServerIsoSchema from ServerIso
 * @phpstan-import-type ServerTypeSchema from ServerType
 *
 * @phpstan-type ServerSchema array{
 *     backup_window: ?string,
 *     created: string,
 *     datacenter: DatacenterSchema,
 *     id: int,
 *     image: ?ServerImageSchema,
 *     included_traffic: ?int,
 *     ingoing_traffic: ?int,
 *     iso: ?ServerIsoSchema,
 *     labels: array<string, string>,
 *     load_balancers?: array<int, int>,
 *     locked: bool,
 *     name: string,
 *     outgoing_traffic: int,
 *     placement_group?: ?PlacementGroupSchema,
 *     primary_disk_size: int,
 *     private_net: PrivateNetSchema[],
 *     protection: ProtectionSchema,
 *     public_net: PublicNetSchema,
 *     rescue_enabled: bool,
 *     server_type: ServerTypeSchema,
 *     status: string,
 *     volumes?: array<int, int>
 * }
 *
 * @implements ResponseContract<ServerSchema>
 */
final readonly class Server implements ResponseContract
{
    /**
     * @use ArrayAccessible<ServerSchema>
     */
    use ArrayAccessible;

    /**
     * @param  array<string, string>  $labels
     * @param  array<int, int>  $loadBalancers
     * @param  PrivateNetSchema[]  $privateNet
     * @param  array<int, int>  $volumes
     */
    public function __construct(
        public ?string $backupWindow,
        public CarbonImmutable $created,
        public Datacenter $datacenter,
        public int $id,
        public ?ServerImage $image,
        public ?int $includedTraffic,
        public ?int $ingoingTraffic,
        public ?ServerIso $iso,
        public array $labels,
        public array $loadBalancers,
        public bool $locked,
        public string $name,
        public int $outgoingTraffic,
        public ?PlacementGroup $placementGroup,
        public int $primaryDiskSize,
        public array $privateNet,
        public Protection $protection,
        public PublicNet $publicNet,
        public bool $rescueEnabled,
        public ServerType $serverType,
        public string $status,
        public array $volumes,
    ) {}

    /**
     * @param  ServerSchema  $attributes
     */
    public static function from(array $attributes): self
    {
        return new self(
            $attributes['backup_window'] ?? null,
            CarbonImmutable::parse($attributes['created']),
            Datacenter::from($attributes['datacenter']),
            $attributes['id'],
            isset($attributes['image']) ? ServerImage::from($attributes['image']) : null,
            $attributes['included_traffic'] ?? null,
            $attributes['ingoing_traffic'] ?? null,
            isset($attributes['iso']) ? ServerIso::from($attributes['iso']) : null,
            $attributes['labels'],
            $attributes['load_balancers'] ?? [],
            $attributes['locked'],
            $attributes['name'],
            $attributes['outgoing_traffic'],
            isset($attributes['placement_group']) ? PlacementGroup::from($attributes['placement_group']) : null,
            $attributes['primary_disk_size'],
            $attributes['private_net'],
            Protection::from($attributes['protection']),
            PublicNet::from($attributes['public_net']),
            $attributes['rescue_enabled'],
            ServerType::from($attributes['server_type']),
            $attributes['status'],
            $attributes['volumes'] ?? [],
        );
    }

    /**
     * @return ServerSchema
     */
    public function toArray(): array
    {
        return [
            'backup_window' => $this->backupWindow,
            'created' => $this->created->toIso8601String(),
            'status' => $this->status,
            'datacenter' => $this->datacenter->toArray(),
            'id' => $this->id,
            'image' => $this->image?->toArray(),
            'included_traffic' => $this->includedTraffic,
            'ingoing_traffic' => $this->ingoingTraffic,
            'iso' => $this->iso?->toArray(),
            'labels' => $this->labels,
            'load_balancers' => $this->loadBalancers,
            'locked' => $this->locked,
            'name' => $this->name,
            'outgoing_traffic' => $this->outgoingTraffic,
            'placement_group' => $this->placementGroup?->toArray(),
            'primary_disk_size' => $this->primaryDiskSize,
            'private_net' => $this->privateNet,
            'protection' => $this->protection->toArray(),
            'public_net' => $this->publicNet->toArray(),
            'rescue_enabled' => $this->rescueEnabled,
            'server_type' => $this->serverType->toArray(),
            'volumes' => $this->volumes,
        ];
    }
}
```

There's a myriad of `@phpstan-import-type`s at the class-level method docs. Each schema is housed within its resource,
and I can safely import the schemas around as they match their direct JSON API response and map them into their PHP
object counterparts. Yes, I could use a serializer, but I don't really care for the overhead and it's somewhat cathardic
writing the boilerplate mapping code. There's some other bits in there based on another library I've split off from the
main client providing some nice little utilities for writing API clients in PHP, but I'll save that blog post for a
rainy day (boom, callback). I've been heavily influenced by
the [OpenAI PHP client](https://github.com/openai-php/client) (shout out Nuno), and abstracted out some things I liked
about that client library into my own
little [utility package](https://github.com/hetzner-cloud-php/http-client-utilities).

I have these type imports all over the code, and it helps me mentally map out a boundary between my PHP code and what I
get back from Hetzner. Anything that's defined as a `@phpstan-type` schema comes directly from the API, and my models
are just that - good ol' PHP model objects.
