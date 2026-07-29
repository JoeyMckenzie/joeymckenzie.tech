<?php

declare(strict_types=1);

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class ExampleTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function environment_is_testing(): void
    {
        $this->assertSame('testing', app()->environment());
    }
}
