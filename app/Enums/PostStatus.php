<?php

declare(strict_types=1);

namespace App\Enums;

use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use InvalidArgumentException;

/**
 * Publication state as the admin talks about it.
 *
 * This is a presentation and form concern only — `posts.published_at` remains the
 * single source of truth, so there is no status column to drift out of sync.
 */
enum PostStatus: string
{
    case Draft = 'draft';

    case Published = 'published';

    case Scheduled = 'scheduled';

    /**
     * Derive the status a post is currently in from its publish timestamp.
     */
    public static function fromPublishedAt(?CarbonInterface $publishedAt): self
    {
        if (! $publishedAt instanceof CarbonInterface) {
            return self::Draft;
        }

        return $publishedAt->isFuture() ? self::Scheduled : self::Published;
    }

    /**
     * Resolve the `published_at` a save should persist.
     *
     * Publishing a post that is already live keeps its original date, so editing a
     * typo years later never re-dates the post. Publishing a scheduled post instead
     * brings it forward to now.
     *
     * @param  CarbonInterface|null  $current  The post's existing publish timestamp.
     * @param  CarbonInterface|null  $scheduledFor  The requested go-live, for scheduled saves.
     */
    public function publishedAt(?CarbonInterface $current, ?CarbonInterface $scheduledFor): ?CarbonImmutable
    {
        return match ($this) {
            self::Draft => null,
            self::Published => CarbonImmutable::instance(
                $current instanceof CarbonInterface && $current->isPast() ? $current : now(),
            ),
            self::Scheduled => CarbonImmutable::instance(
                $scheduledFor ?? throw new InvalidArgumentException('A scheduled post requires a publish date.'),
            ),
        };
    }
}
