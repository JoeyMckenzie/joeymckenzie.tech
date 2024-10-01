<?php

declare(strict_types=1);

namespace App\ValueObjects;

final class OfficeQuote
{
    public string $quote;

    public string $author;

    /**
     * @param  array{quote: string, author: string}  $data
     */
    public function __construct(array $data)
    {
        $this->quote = $data['quote'];
        $this->author = $data['author'];
    }
}
