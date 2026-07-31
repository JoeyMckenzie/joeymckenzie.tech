<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Cache;

/**
 * Cached blog reads, and the writes that have to invalidate them.
 */
final class BlogCache
{
    /**
     * The home page's recent-posts list, cached for five minutes.
     */
    public const string RECENT_POSTS = 'home:recent_posts';

    /**
     * Drop the home page's cached list so an admin write shows up immediately
     * instead of trailing the five-minute TTL.
     */
    public static function forgetRecentPosts(): void
    {
        Cache::forget(self::RECENT_POSTS);
    }
}
