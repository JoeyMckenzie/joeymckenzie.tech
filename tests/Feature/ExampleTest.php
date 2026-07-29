<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class ExampleTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function returns_a_successful_response(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
    }
}
