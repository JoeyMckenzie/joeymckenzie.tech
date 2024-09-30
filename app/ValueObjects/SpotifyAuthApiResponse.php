<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Illuminate\Http\Client\Response;

final readonly class SpotifyAuthApiResponse
{
    private function __construct(public string $tokenType, public string $accessToken, public string $authorizationHeader)
    {
    }

    public static function fromResponse(Response $response): self
    {
        /** @var array{token_type: string, access_token: string} $authResponse */
        $authResponse = json_decode($response->body(), true, JSON_THROW_ON_ERROR);
        $tokenType = $authResponse['token_type'];
        $accessToken = $authResponse['access_token'];
        $authorizationHeader = "$tokenType $accessToken";

        return new self($tokenType, $accessToken, $authorizationHeader);
    }
}
