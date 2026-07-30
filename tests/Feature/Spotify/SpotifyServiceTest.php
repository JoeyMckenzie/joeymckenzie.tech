<?php

declare(strict_types=1);

namespace Tests\Feature\Spotify;

use App\Services\Spotify\SpotifyService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(SpotifyService::class)]
final class SpotifyServiceTest extends TestCase
{
    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.spotify.client_id' => 'test-client-id',
            'services.spotify.client_secret' => 'test-client-secret',
        ]);
    }

    #[Test]
    public function it_exchanges_an_authorization_code_for_a_refresh_token(): void
    {
        Http::fake([
            'accounts.spotify.com/api/token' => Http::response([
                'access_token' => 'test-access-token',
                'refresh_token' => 'new-refresh-token',
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ], 200),
        ]);

        $refreshToken = app(SpotifyService::class)
            ->exchangeAuthorizationCode('auth-code', 'http://127.0.0.1:8888/callback');

        $this->assertSame('new-refresh-token', $refreshToken);

        Http::assertSent(fn (Request $request): bool => $request->url() === 'https://accounts.spotify.com/api/token'
            && $request['grant_type'] === 'authorization_code'
            && $request['code'] === 'auth-code'
            && $request['redirect_uri'] === 'http://127.0.0.1:8888/callback');
    }

    #[Test]
    public function it_returns_null_when_the_exchange_fails(): void
    {
        Http::fake([
            'accounts.spotify.com/api/token' => Http::response([
                'error' => 'invalid_grant',
                'error_description' => 'Invalid authorization code',
            ], 400),
        ]);

        $refreshToken = app(SpotifyService::class)
            ->exchangeAuthorizationCode('bad-code', 'http://127.0.0.1:8888/callback');

        $this->assertNull($refreshToken);
    }
}
