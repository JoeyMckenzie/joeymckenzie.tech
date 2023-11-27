<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\MusicTrackerContract;
use App\Models\Spotify\NowPlaying;
use App\Models\Spotify\SpotifyAuthResponse;
use App\Models\Spotify\SpotifyNowPlayingResponse;
use DateInterval;
use Doctrine\Common\Annotations\AnnotationReader;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\PropertyInfo\Extractor\PhpDocExtractor;
use Symfony\Component\PropertyInfo\Extractor\ReflectionExtractor;
use Symfony\Component\PropertyInfo\PropertyInfoExtractor;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter;
use Symfony\Component\Serializer\NameConverter\MetadataAwareNameConverter;
use Symfony\Component\Serializer\Normalizer\ArrayDenormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

final readonly class SpotifyTracker implements MusicTrackerContract
{
    private const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player?type=track,episode';

    private const TOKEN_URL = 'https://accounts.spotify.com/api/token';

    private const NOW_PLAYING_KEY = 'nowPlaying';

    private Serializer $serializer;

    public function __construct()
    {
        $this->serializer = self::initializeSerializer();
    }

    /**
     * Initializes a new Symfony serializer to marshal responses from the Game Data APIs.
     *
     * @return Serializer Symfony serializer.
     */
    private function initializeSerializer(): Serializer
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $metadataAwareNameConverter = new MetadataAwareNameConverter($classMetadataFactory, new CamelCaseToSnakeCaseNameConverter());
        $extractor = new PropertyInfoExtractor([], [
            new PhpDocExtractor(),
            new ReflectionExtractor(),
        ]);
        $normalizer = new ObjectNormalizer($classMetadataFactory, $metadataAwareNameConverter, null, $extractor);

        return new Serializer([$normalizer, new ArrayDenormalizer()], [new JsonEncoder()]);
    }

    public function getNowPlaying(): NowPlaying
    {
        Log::info('retrieving Spotify now playing info');

        /** @var ?NowPlaying $currentlyPlaying */
        $currentlyPlaying = Cache::get(self::NOW_PLAYING_KEY);

        if (isset($currentlyPlaying)) {
            Log::info('cached now playing found');

            return $currentlyPlaying;
        }

        Log::info('now playing retrieved, adding to cache');

        $nowPlaying = self::getSpotifyNowPlaying();

        Cache::set('nowPlaying', $nowPlaying, new DateInterval('PT5M'));

        return $nowPlaying;
    }

    private function getSpotifyNowPlaying(): NowPlaying
    {

        $defaultResponse = new NowPlaying(false);

        try {
            // TODO: There's probably a cool collections/Adam Wathan way to do this,
            // i.e. pattern/match assign multiple values with a cast

            /** @var string $clientId */
            $clientId = config('spotify.client_id');
            /** @var string $clientSecret */
            $clientSecret = config('spotify.client_secret');
            /** @var string $refreshToken */
            $refreshToken = config('spotify.refresh_token');

            Log::info('requesting access token');

            // Get Access Token
            $accessTokenResponse = Http::withBasicAuth($clientId, $clientSecret)
                ->asForm()
                ->post(self::TOKEN_URL, [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refreshToken,
                ]);

            Log::info('access token retrieved, request now playing info');

            $authResponse = $this->serializer->deserialize($accessTokenResponse->body(), SpotifyAuthResponse::class, 'json');
            $authorizationHeader = "$authResponse->tokenType $authResponse->accessToken";

            // Get Now Playing
            $nowPlayingResponse = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => $authorizationHeader,
            ])->get(self::NOW_PLAYING_URL);

            Log::info('now playing info retrieved');

            // Spotify returned a 204, so no content === not playing anything
            if ($nowPlayingResponse->status() === 204) {
                Log::info('not currently playing, returning default response');

                return $defaultResponse;
            } elseif ($nowPlayingResponse->failed()) {
                $message = $nowPlayingResponse->body();

                Log::error("an error occurred retrieving now playing info: $message");

                return $defaultResponse;
            }

            Log::info('now playing detected');

            $nowPlaying = $this->serializer->deserialize($nowPlayingResponse->body(), SpotifyNowPlayingResponse::class, 'json');

            // Most of the linking and track/show information come from the `item` and `context` node and we can largely ignore the majority of the response
            $item = $nowPlaying->item;
            $context = $nowPlaying->context;
            $trackTitle = $item->name;
            $href = $item->externalUrls?->spotify ?? $context->externalUrls?->spotify ?? '/';

            // The playing type will either be `"show"` or `"track"` based on a podcast or artist song
            // There's _a lot_ of presumptive `unwrap()`ing going here, should probably clean up eventually
            if ($nowPlaying->currentlyPlayingType === 'track' && isset($item->album) && isset($item->artists)) {
                $albumImage = $item->album->images[0];
                $artist = $item->artists[0]->name;

                return new NowPlaying(true, $href, $albumImage->url, $trackTitle, $artist);
            } elseif (isset($item->show)) {
                $show = $item->show;
                $showImage = $show->images[0];
                $showTitle = $show->name;

                return new NowPlaying(true, $href, $showImage->url, $trackTitle, $showTitle);
            }
        } catch (RequestException $e) {
            Log::info('error retrieving spotify now playing '.$e->getMessage());

            return $defaultResponse;
        }

        return $defaultResponse;
    }
}
