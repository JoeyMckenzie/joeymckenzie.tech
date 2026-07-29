<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class RegistrationTest extends TestCase
{
    #[Test]
    public function registration_endpoints_are_unavailable(): void
    {
        $registration = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $this->get('/register')->assertNotFound();
        $this->post('/register', $registration)->assertNotFound();
    }
}
