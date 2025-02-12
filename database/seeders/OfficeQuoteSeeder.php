<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\OfficeQuote;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

final class OfficeQuoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /** @var array{quotes: array<int, array{author: string, quote: string}>} $quotesJson */
        $quotesJson = File::json(storage_path('files/quotes.json'));

        collect($quotesJson['quotes'])
            ->map(fn (array $quoteData) => OfficeQuote::create([
                'quote' => $quoteData['quote'],
                'author' => $quoteData['author'],
                'created_at' => now(),
                'updated_at' => now(),
            ]));
    }
}
