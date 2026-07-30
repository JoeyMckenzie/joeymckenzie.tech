<?php

declare(strict_types=1);

namespace Tests\Feature\Spotify;

use App\Http\Controllers\SpotifyNowPlayingController;
use App\Services\Spotify\NowPlayingData;
use App\Services\Spotify\SpotifyService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Tests\TestCase;

#[CoversClass(SpotifyNowPlayingController::class)]
#[UsesClass(SpotifyService::class)]
final class NowPlayingTest extends TestCase
{
    use RefreshDatabase;

    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    /**
     * Fake both the token and player endpoints together so one Http::fake
     * call doesn't overwrite the other.
     *
     * @param  callable|array<string, mixed>  $playerResponse
     */
    private function fakeSpotify($playerResponse): void
    {
        Http::fake([
            'accounts.spotify.com/api/token' => Http::response([
                'access_token' => 'test-access-token',
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ], 200),
            'api.spotify.com/v1/me/player*' => $playerResponse,
        ]);
    }

    #[Test]
    public function it_returns_the_current_track_when_playing(): void
    {
        $this->fakeSpotify(Http::response([
            'is_playing' => true,
            'item' => [
                'type' => 'track',
                'name' => 'Nightcall',
                'artists' => [
                    ['name' => 'Kavinsky'],
                ],
                'album' => [
                    'images' => [['url' => 'https://i.scdn.co/cover.jpg']],
                ],
                'external_urls' => ['spotify' => 'https://open.spotify.com/track/123'],
            ],
        ], 200));

        $this->getJson(route('now-playing'))
            ->assertOk()
            ->assertJsonPath('nowPlaying.title', 'Nightcall')
            ->assertJsonPath('nowPlaying.artist', 'Kavinsky')
            ->assertJsonPath('nowPlaying.albumImage', 'https://i.scdn.co/cover.jpg')
            ->assertJsonPath('nowPlaying.href', 'https://open.spotify.com/track/123');
    }

    #[Test]
    public function it_returns_a_podcast_episode_when_playing(): void
    {
        $this->fakeSpotify(Http::response([
            'is_playing' => true,
            'item' => [
                'type' => 'episode',
                'episode' => [
                    'name' => 'Episode 42',
                    'show' => ['name' => 'The Changelog'],
                    'images' => [['url' => 'https://i.scdn.co/ep.jpg']],
                    'external_urls' => ['spotify' => 'https://open.spotify.com/episode/42'],
                ],
            ],
        ], 200));

        $this->getJson(route('now-playing'))
            ->assertOk()
            ->assertJsonPath('nowPlaying.title', 'Episode 42')
            ->assertJsonPath('nowPlaying.artist', 'The Changelog')
            ->assertJsonPath('nowPlaying.href', 'https://open.spotify.com/episode/42');
    }

    #[Test]
    public function it_returns_null_when_nothing_is_playing(): void
    {
        // 204 = no active device, nothing playing.
        $this->fakeSpotify(Http::response(null, 204));

        $this->getJson(route('now-playing'))
            ->assertOk()
            ->assertJsonPath('nowPlaying', null);
    }

    #[Test]
    public function it_returns_null_when_the_player_returns_an_error(): void
    {
        $this->fakeSpotify(Http::response(null, 401));

        $this->getJson(route('now-playing'))
            ->assertOk()
            ->assertJsonPath('nowPlaying', null);
    }

    #[Test]
    public function the_service_maps_tracks_and_episodes(): void
    {
        $this->fakeSpotify(Http::response([
            'is_playing' => true,
            'item' => [
                'type' => 'track',
                'name' => 'Test Song',
                'artists' => [
                    ['name' => 'Artist A'],
                    ['name' => 'Artist B'],
                ],
                'album' => [
                    'images' => [['url' => 'https://i.scdn.co/test.jpg']],
                ],
                'external_urls' => ['spotify' => 'https://open.spotify.com/track/abc'],
            ],
        ], 200));

        $service = app(SpotifyService::class);
        $result = $service->nowPlaying();

        $this->assertInstanceOf(NowPlayingData::class, $result);
        $this->assertSame('Test Song', $result->title);
        // Multiple artists are joined with commas (max 2).
        $this->assertSame('Artist A, Artist B', $result->artist);
    }
}
