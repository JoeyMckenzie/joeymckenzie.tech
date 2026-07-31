<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\Spotify\SpotifyService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;

/**
 * Runs the Spotify OAuth authorization-code flow to mint a fresh refresh token
 * for the now-playing widget (the stored one is revoked when the Spotify
 * password changes or the app is removed). Prints the authorize URL, captures
 * the callback on a loopback port, and exchanges the code for a refresh token.
 *
 * Register the redirect URI (default http://127.0.0.1:8888/callback) in the
 * Spotify app dashboard first. The printed token goes into SPOTIFY_REFRESH_TOKEN
 * locally and on Laravel Cloud.
 */
#[Signature('spotify:authorize {--port=8888 : Loopback port for the OAuth callback}')]
#[Description('Mint a fresh Spotify refresh token via the OAuth authorization-code flow')]
final class SpotifyAuthorizeCommand extends Command
{
    /**
     * @var list<string>
     */
    private const array SCOPES = [
        'user-read-currently-playing',
        'user-read-playback-state',
    ];

    public function handle(SpotifyService $spotify): int
    {
        $clientId = Config::string('services.spotify.client_id');
        $clientSecret = Config::string('services.spotify.client_secret');

        if (blank($clientId) || blank($clientSecret)) {
            $this->error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set.');

            return self::FAILURE;
        }

        $port = (int) $this->option('port');
        $redirectUri = sprintf('http://127.0.0.1:%d/callback', $port);
        $state = Str::random(32);
        $authorizeUrl = 'https://accounts.spotify.com/authorize?'.http_build_query([
            'client_id' => $clientId,
            'response_type' => 'code',
            'redirect_uri' => $redirectUri,
            'scope' => implode(' ', self::SCOPES),
            'state' => $state,
            'show_dialog' => 'true',
        ]);

        $this->line('Register this redirect URI in your Spotify app dashboard:');
        $this->line('  '.$redirectUri);
        $this->newLine();
        $this->line('Then open this URL to authorize:');
        $this->line('  '.$authorizeUrl);
        $this->newLine();

        $code = $this->awaitCallback($port, $state, $redirectUri);

        if ($code === null) {
            return self::FAILURE;
        }

        $refreshToken = $spotify->exchangeAuthorizationCode($code, $redirectUri);

        if ($refreshToken === null) {
            $this->error('Token exchange failed. Check the logs for the Spotify response status.');

            return self::FAILURE;
        }

        $this->newLine();
        $this->info('New refresh token:');
        $this->line($refreshToken);
        $this->newLine();
        $this->line('Set SPOTIFY_REFRESH_TOKEN to this value in .env and on Laravel Cloud, then redeploy.');

        return self::SUCCESS;
    }

    /**
     * Block on a one-shot loopback HTTP server until Spotify redirects back with
     * the authorization code, verifying the CSRF state. Returns null on error.
     */
    private function awaitCallback(int $port, string $expectedState, string $redirectUri): ?string
    {
        $server = @stream_socket_server(sprintf('tcp://127.0.0.1:%d', $port), $errno, $errstr);

        if ($server === false) {
            $this->error(sprintf('Could not listen on %s (%s)', $redirectUri, $errstr));

            return null;
        }

        $this->line('Waiting for the Spotify callback...');

        $connection = @stream_socket_accept($server, 300);

        if ($connection === false) {
            $this->error('Timed out waiting for the callback.');
            fclose($server);

            return null;
        }

        $request = fread($connection, 8192);
        $query = $this->parseCallbackQuery(is_string($request) ? $request : '');

        $body = 'Authorization received. You can close this tab and return to the terminal.';
        fwrite(
            $connection,
            "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ".strlen($body)."\r\nConnection: close\r\n\r\n".$body,
        );
        fclose($connection);
        fclose($server);

        if (isset($query['error'])) {
            $this->error('Authorization denied: '.$query['error']);

            return null;
        }

        if (($query['state'] ?? null) !== $expectedState) {
            $this->error('State mismatch — aborting for safety.');

            return null;
        }

        $code = $query['code'] ?? null;

        if (! is_string($code) || blank($code)) {
            $this->error('No authorization code in the callback.');

            return null;
        }

        return $code;
    }

    /**
     * Pull the OAuth callback parameters out of the request's HTTP request line
     * (e.g. `GET /callback?code=...&state=... HTTP/1.1`).
     *
     * @return array{code?: string, state?: string, error?: string}
     */
    private function parseCallbackQuery(string $request): array
    {
        $firstLine = strtok($request, "\r\n");

        if ($firstLine === false || preg_match('#^GET\s+\S*\?(\S+)\s+HTTP#', $firstLine, $matches) !== 1) {
            return [];
        }

        parse_str($matches[1], $params);

        $result = [];

        foreach (['code', 'state', 'error'] as $key) {
            if (isset($params[$key]) && is_string($params[$key])) {
                $result[$key] = $params[$key];
            }
        }

        return $result;
    }
}
