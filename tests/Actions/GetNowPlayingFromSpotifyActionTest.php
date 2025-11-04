<?php

declare(strict_types=1);

namespace Actions;

use App\Actions\GetNowPlayingFromSpotifyAction;
use App\Data\Spotify\NowPlayingResponse;
use App\Support\Spotify;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Assert;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(GetNowPlayingFromSpotifyAction::class)]
final class GetNowPlayingFromSpotifyActionTest extends TestCase
{
    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }

    #[Test]
    public function it_returns_now_playing_data(): void
    {
        // Arrange
        $response = NowPlayingResponse::make(
            href: 'https://open.spotify.com/track/',
            albumImageSrc: 'https://some-image.com/image.jpg',
            trackTitle: 'Jump',
            artist: 'Van Halen'
        );

        Spotify::fake($response);

        $action = new GetNowPlayingFromSpotifyAction();

        // Act
        $response = $action->handle();

        // Assert
        Assert::assertNotNull($response->trackTitle);
        Spotify::assertAuthenticated();
        Spotify::assertNowPlaying();
    }

    #[Test]
    public function it_uses_cache_on_subsequent_calls(): void
    {
        // Arrange
        $response = NowPlayingResponse::make(
            href: 'https://open.spotify.com/track/',
            albumImageSrc: 'https://some-image.com/image.jpg',
            trackTitle: 'Jump',
            artist: 'Van Halen'
        );

        $fake = Spotify::fake($response);

        $action = new GetNowPlayingFromSpotifyAction();

        // Act - First call should populate cache
        $firstResponse = $action->handle();

        // Second call should hit cache
        $secondResponse = $action->handle();

        // Assert
        Assert::assertSame($firstResponse->trackTitle, $secondResponse->trackTitle);
        $fake->assertCacheHit();
    }
}
