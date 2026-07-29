<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Actions\Fortify\CreateNewUser;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Validation\ValidationException;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

#[Signature("users:create
    {--name= : The user's name}
    {--email= : The user's email address}
    {--password= : The user's password}")]
#[Description('Create a user with a verified email (registration is disabled)')]
final class CreateUser extends Command
{
    public function handle(CreateNewUser $creator): int
    {
        $name = $this->stringOption('name') ?? text(label: 'Name', required: true);
        $email = $this->stringOption('email') ?? text(label: 'Email', required: true);
        $password = $this->stringOption('password') ?? password(label: 'Password', required: true);

        try {
            $user = $creator->create([
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'password_confirmation' => $password,
            ]);
        } catch (ValidationException $validationException) {
            foreach ($validationException->validator->errors()->all() as $message) {
                $this->error($message);
            }

            return self::FAILURE;
        }

        $user->markEmailAsVerified();

        $this->info(sprintf('User [%s] created with a verified email.', $user->email));

        return self::SUCCESS;
    }

    private function stringOption(string $key): ?string
    {
        $value = $this->option($key);

        return is_string($value) && filled($value) ? $value : null;
    }
}
