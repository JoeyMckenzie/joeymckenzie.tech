<?php

declare(strict_types=1);

namespace Tests\Feature\Public;

use Inertia\Testing\AssertableInertia;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class StaticPagesTest extends TestCase
{
    /**
     * @return array<string, array{string, string}>
     */
    public static function publicPageProvider(): array
    {
        return [
            'now' => ['now', 'now'],
            'uses' => ['uses', 'uses'],
            'cv' => ['cv', 'cv'],
        ];
    }

    #[Test]
    #[DataProvider('publicPageProvider')]
    public function it_renders_a_public_static_page(
        string $routeName,
        string $component,
    ): void {
        $this->get(route($routeName))
            ->assertOk()
            ->assertInertia(fn (Assert $page): AssertableInertia => $page
                ->component($component));
    }
}
