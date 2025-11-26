<?php

declare(strict_types=1);

namespace App\Data\Spotify;

use App\Data\Concerns\Defaultable;
use App\Data\Concerns\MappableResponse;
use Illuminate\Http\Client\Response;

/**
 * @phpstan-type AuthResponseSchema array{
 *     token_type: string,
 *     access_token: string,
 * }
 */
final readonly class AuthResponse implements Defaultable, MappableResponse
{
    private function __construct(
        public string $tokenType,
        public string $accessToken,
        public string $authorizationHeader)
    {
        //
    }

    public static function fromResponse(Response $response): self
    {
        /** @var AuthResponseSchema $authResponse */
        $authResponse = json_decode($response->body(), true, JSON_THROW_ON_ERROR);
        $tokenType = $authResponse['token_type'];
        $accessToken = $authResponse['access_token'];
        $authorizationHeader = "$tokenType $accessToken";

        return new self($tokenType, $accessToken, $authorizationHeader);
    }

    public static function default(): self
    {
        return new self('bearer', 'token', 'Bearer');
    }
}
