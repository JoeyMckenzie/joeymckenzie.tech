<?php

declare(strict_types=1);

namespace App\Data\Spotify;

use Livewire\Mechanisms\HandleComponents\Synthesizers\Synth;

/**
 * @phpstan-import-type NowPlayingResponseSchema from NowPlayingResponse
 */
final class SpotifySynthesizer extends Synth
{
    public static string $key = 'spotify';

    public static function match(mixed $target): bool
    {
        return $target instanceof NowPlayingResponse;
    }

    /**
     * @return array{0: NowPlayingResponseSchema, 1: mixed}
     */
    public function dehydrate(NowPlayingResponse $target): array
    {
        return [
            $target->toArray(),
            [],
        ];
    }

    /**
     * @param  NowPlayingResponseSchema  $value
     */
    public function hydrate(array $value): NowPlayingResponse
    {
        return NowPlayingResponse::fromArray($value);
    }
}
