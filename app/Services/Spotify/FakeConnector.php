<?php

declare(strict_types=1);

namespace App\Services\Spotify;

use App\Data\Spotify\AuthResponse;
use App\Data\Spotify\NowPlayingResponse;
use PHPUnit\Framework\Assert;

final class FakeConnector implements SpotifyConnectorContract
{
    /** @var NowPlayingResponse[] */
    private array $responses = [];

    private int $authenticateCalls = 0;

    private bool $cacheHit = false;

    public function __construct(?NowPlayingResponse $response)
    {
        if ($response !== null) {
            $this->responses[] = $response;
        }
    }

    public function authenticate(): AuthResponse
    {
        $this->authenticateCalls++;

        return AuthResponse::default();
    }

    public function getNowPlaying(AuthResponse $auth): NowPlayingResponse
    {
        if ($this->responses === []) {
            $nowPlaying = NowPlayingResponse::default();
            $this->responses[] = $nowPlaying;
        }

        return $this->responses[0];
    }

    public function assertAuthenticated(): void
    {
        Assert::assertSame(1, $this->authenticateCalls);
    }

    public function assertNowPlaying(): void
    {
        Assert::assertCount(1, $this->responses);
    }

    public function assertCacheHit(): void
    {
        Assert::assertTrue($this->cacheHit, 'Expected cache to be hit, but it was not.');
    }

    public function setCacheHit(bool $hit = true): void
    {
        $this->cacheHit = $hit;
    }

    public function wasCacheHitCalled(): bool
    {
        return $this->cacheHit;
    }
}
