<?php

declare(strict_types=1);

namespace App\ValueObjects;

use App\Services\BlueskyConnector;

/**
 * @phpstan-import-type BlueskyLinkPreviewSchema from BlueskyConnector
 */
final class BlueskyPostLinkPreview
{
    public function __construct(
        public string $uri,
        public string $thumb
    ) {
        //
    }

    /**
     * @param  BlueskyLinkPreviewSchema  $data
     */
    public static function fromJson(array $data): self
    {
        return new self(
            $data['uri'],
            $data['thumb']
        );
    }
}
