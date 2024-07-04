<?php

declare(strict_types=1);

namespace App\ValueObjects;

use BadMethodCallException;
use Livewire\Wireable;
use Override;

final readonly class NowPlaying implements Wireable
{
    public function __construct(
        public bool $nowPlaying,
        public ?string $href = '',
        public ?string $albumImageSrc = '',
        public ?string $trackTitle = '',
        public ?string $artist = '',
    ) {}

    #[Override]
    public static function fromLivewire(mixed $value): void
    {
        throw new BadMethodCallException('Now playing is one-way wireable.');
    }

    /**
     * @return array{href: string|null, albumImageSrc: string|null, trackTitle: string|null, artist: string|null}
     */
    #[Override]
    public function toLivewire(): array
    {
        return [
            'href' => $this->href,
            'albumImageSrc' => $this->albumImageSrc,
            'trackTitle' => $this->trackTitle,
            'artist' => $this->artist,
        ];
    }
}
