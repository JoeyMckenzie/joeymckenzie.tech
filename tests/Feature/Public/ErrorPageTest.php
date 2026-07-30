<?php

declare(strict_types=1);

namespace Tests\Feature\Public;

use Inertia\Testing\AssertableInertia;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class ErrorPageTest extends TestCase
{
    #[Test]
    public function an_unknown_route_renders_the_nocturne_error_page(): void
    {
        $this->get('/this-route-does-not-exist')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page): AssertableInertia => $page
                ->component('error')
                ->where('status', 404));
    }
}
