<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\RandomizableCache;
use App\ValueObjects\OfficeQuote;
use App\ValueObjects\OfficeQuoteCollection;
use Cache;
use DateInterval;
use Override;

/**
 * @implements RandomizableCache<OfficeQuote>
 */
final class OfficeQuotesCache implements RandomizableCache
{
    private const string CACHE_KEY = 'daily-office-quote';

    #[Override]
    public function getRandomValue(): ?OfficeQuote
    {
        if (Cache::has(self::CACHE_KEY)) {
            /** @var OfficeQuote $randomQuote */
            $randomQuote = Cache::get(self::CACHE_KEY);

            return $randomQuote;
        }

        $filePath = storage_path('files/office-quotes.json');
        $quotes = file_get_contents($filePath);

        if ($quotes !== false) {
            /** @var array{quotes: array<int, array{quote: string, author: string}>} $parsedQuotes */
            $parsedQuotes = json_decode($quotes, true, JSON_THROW_ON_ERROR);
            $quotesCollection = new OfficeQuoteCollection($parsedQuotes['quotes']);
            $randomQuote = $quotesCollection->getRandomQuote();

            Cache::set(self::CACHE_KEY, $randomQuote, new DateInterval('P1D'));

            return $quotesCollection->getRandomQuote();
        }

        return null;
    }
}
