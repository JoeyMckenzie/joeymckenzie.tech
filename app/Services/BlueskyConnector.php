<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\BlueskyConnectorContract;
use App\ValueObjects\BlueskyPostMeta;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;

/**
 * @phpstan-type BlueskyPostSchema array{
 *     uri: string,
 *     author: array{
 *         avatar: string
 *     },
 *     record: array{
 *         createdAt: string,
 *         text: string
 *     },
 *     replyCount: int,
 *     repostCount: int,
 *     likeCount: int,
 *     quoteCount: int,
 *     embed?: array{
 *         images: array<int, array{
 *             thumb: string,
 *             fullsize: string,
 *             alt: string,
 *             aspectRatio: array{
 *                 width: number,
 *                 height: number
 *             }
 *         }>
 *     }
 * }
 * @phpstan-type BlueskyFeedSchema array{
 *     feed: array<int, array{post: BlueskyPostSchema}>
 * }
 */
final class BlueskyConnector implements BlueskyConnectorContract
{
    private const string BASE_URL = 'https://bsky.social/xrpc';

    private const string ACCESS_TOKEN_CACHE_KEY = 'access_token';

    private const string LATEST_POST_KEY = 'access_token';

    public function getLatestPost(): BlueskyPostMeta
    {
        $latestPost = Cache::get(self::LATEST_POST_KEY);

        if ($latestPost !== null) {
            /** @var BlueskyFeedSchema $json */
            $json = $latestPost;
            $postData = $json['feed'][0]['post'];

            return BlueskyPostMeta::from($postData);
        }

        $accessToken = $this->getAuthToken();
        $url = sprintf('%s/app.bsky.feed.getAuthorFeed?actor=joeymckenzie.tech&limit=1', self::BASE_URL);
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$accessToken,
            'Accept' => 'application/json',
        ])->get($url);

        /** @var BlueskyFeedSchema $json */
        $json = $response->json();
        $postData = $json['feed'][0]['post'];
        $latestPostMeta = BlueskyPostMeta::from($postData);

        Cache::put(self::LATEST_POST_KEY, $json, now()->addHour());

        return $latestPostMeta;
    }

    private function getAuthToken(): ?string
    {
        $existingToken = Cache::get(self::ACCESS_TOKEN_CACHE_KEY);

        if (is_string($existingToken)) {
            return $existingToken;
        }

        try {
            $username = Config::string('bluesky.username');
            $password = Config::string('bluesky.password');
            $url = sprintf('%s/com.atproto.server.createSession', self::BASE_URL);
            $response = Http::withHeader('Content-Type', 'application/json')
                ->post($url, [
                    'identifier' => $username,
                    'password' => $password,
                ]);

            /** @var array{accessJwt: string} $json */
            $json = $response->json();
            $token = $json['accessJwt'];

            Cache::put(self::ACCESS_TOKEN_CACHE_KEY, $token, now()->addMinutes(30));

            return $json['accessJwt'];
        } catch (Exception) {
            return null;
        }
    }
}
