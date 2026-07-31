<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use App\Support\ReadingTime;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ReadingTime::class)]
final class ReadingTimeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_reads_two_hundred_words_a_minute(): void
    {
        $this->assertSame(1, ReadingTime::forMarkdown($this->words(200)));
        $this->assertSame(3, ReadingTime::forMarkdown($this->words(600)));
    }

    #[Test]
    public function it_rounds_a_partial_minute_up(): void
    {
        $this->assertSame(2, ReadingTime::forMarkdown($this->words(201)));
        $this->assertSame(4, ReadingTime::forMarkdown($this->words(601)));
    }

    #[Test]
    public function it_never_reports_less_than_a_minute(): void
    {
        $this->assertSame(1, ReadingTime::forMarkdown(''));
        $this->assertSame(1, ReadingTime::forMarkdown('word'));
    }

    /**
     * A body of exactly $count space-separated words.
     */
    private function words(int $count): string
    {
        return trim(str_repeat('word ', $count));
    }
}
