<?php

declare(strict_types=1);

namespace App\Services\Spotify;

use App\Data\Spotify\AuthResponse;
use App\Data\Spotify\NowPlayingResponse;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;

final class SpotifyConnector implements SpotifyConnectorContract
{
    private const string NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player?type=track,episode';

    private const string TOKEN_URL = 'https://accounts.spotify.com/api/token';

    /**
     * @throws ConnectionException
     */
    public function authenticate(): AuthResponse
    {
        $clientId = Config::string('services.spotify.client_id');
        $clientSecret = Config::string('services.spotify.client_secret');
        $refreshToken = Config::string('services.spotify.refresh_token');
        $accessTokenResponse = Http::withBasicAuth($clientId, $clientSecret)
            ->asForm()
            ->post(self::TOKEN_URL, [
                'grant_type' => 'refresh_token',
                'refresh_token' => $refreshToken,
            ]);

        return AuthResponse::fromResponse($accessTokenResponse);
    }

    public function getNowPlaying(AuthResponse $auth): NowPlayingResponse
    {
        try {
            $nowPlayingResponse = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => $auth->authorizationHeader,
            ])->get(self::NOW_PLAYING_URL);

            // Spotify returned a 204, so no content === not playing anything
            if ($nowPlayingResponse->status() === 204) {
                return NowPlayingResponse::default();
            }

            if ($nowPlayingResponse->failed()) {
                return NowPlayingResponse::default();
            }

            $response = NowPlayingResponse::fromResponse($nowPlayingResponse);
        } catch (Exception) {
            $response = NowPlayingResponse::default();
        }

        return $response;
    }
}
