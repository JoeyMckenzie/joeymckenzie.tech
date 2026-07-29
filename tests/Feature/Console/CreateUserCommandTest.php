<?php

declare(strict_types=1);

namespace Tests\Feature\Console;

use App\Actions\Fortify\CreateNewUser;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Console\Commands\CreateUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\PendingCommand;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use PHPUnit\Framework\Attributes\UsesTrait;
use Tests\TestCase;

#[CoversClass(CreateUser::class)]
#[CoversClass(CreateNewUser::class)]
#[UsesTrait(PasswordValidationRules::class)]
#[UsesTrait(ProfileValidationRules::class)]
#[UsesClass(User::class)]
final class CreateUserCommandTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function creates_a_user_with_a_verified_email_from_flags(): void
    {
        $exitCode = Artisan::call('users:create', [
            '--name' => 'Joey McKenzie',
            '--email' => 'joey@example.com',
            '--password' => 'super-secret-password',
        ]);

        $this->assertSame(0, $exitCode);
        $this->assertStringContainsString('joey@example.com', Artisan::output());

        $user = User::query()->where('email', 'joey@example.com')->firstOrFail();

        $this->assertSame('Joey McKenzie', $user->name);
        $this->assertNotNull($user->email_verified_at);
        $this->assertTrue(Hash::check('super-secret-password', $user->password));
    }

    #[Test]
    public function prompts_for_options_that_are_not_provided(): void
    {
        $command = $this->artisan('users:create', [
            '--name' => 'Joey McKenzie',
        ]);

        $this->assertInstanceOf(PendingCommand::class, $command);

        $command
            ->expectsQuestion('Email', 'joey@example.com')
            ->expectsQuestion('Password', 'super-secret-password')
            ->assertSuccessful()
            ->run();

        $user = User::query()->where('email', 'joey@example.com')->firstOrFail();

        $this->assertNotNull($user->email_verified_at);
    }

    #[Test]
    public function surfaces_fortify_validation_errors(): void
    {
        $exitCode = Artisan::call('users:create', [
            '--name' => 'Joey McKenzie',
            '--email' => 'not-an-email',
            '--password' => 'super-secret-password',
        ]);

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('valid email address', Artisan::output());
        $this->assertDatabaseCount('users', 0);
    }
}
