<?php

declare(strict_types=1);

namespace App\Support;

final class ReadingTime
{
    private const int WORDS_PER_MINUTE = 200;

    /**
     * Estimated minutes to read a markdown body, rounded up and never below one.
     */
    public static function forMarkdown(string $markdown): int
    {
        return max(1, (int) ceil(str_word_count($markdown) / self::WORDS_PER_MINUTE));
    }
}
