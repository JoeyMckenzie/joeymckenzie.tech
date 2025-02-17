<?php

declare(strict_types=1);

namespace App\ValueObjects;

use App\Services\BlueskyConnector;
use Carbon\Carbon;

/**
 * @phpstan-import-type BlueskyPostSchema from BlueskyConnector
 */
final class BlueskyPostMeta
{
    public function __construct(
        public string $avatar,
        public string $text,
        public Carbon $createdAt,
        public int $replies,
        public int $likes,
        public int $reposts,
        public int $quotes,
        public string $uri,
        public ?string $imageUrl = null,
    ) {
        //
    }

    /**
     * @param  BlueskyPostSchema  $data
     */
    public static function from(array $data): self
    {
        return new self(
            $data['author']['avatar'],
            $data['record']['text'],
            Carbon::parse($data['record']['createdAt']),
            $data['replyCount'],
            $data['likeCount'],
            $data['repostCount'],
            $data['quoteCount'],
            $data['uri'],
            isset($data['embed']) ? $data['embed']['images'][0]['fullsize'] : null,
        );
    }

    public function getPostId(): string
    {
        return basename($this->uri);
    }

    public function getFormattedCreatedAt(): string
    {
        return $this->createdAt->diffForHumans(['short' => true, 'parts' => 1]);
    }
}
