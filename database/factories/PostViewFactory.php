<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Post;
use App\Models\PostView;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PostView>
 */
class PostViewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::factory(),
            'ip_hash' => hash('xxh128', fake()->ipv4()),
            'referrer' => fake()->optional()->url(),
            'user_agent' => fake()->optional()->userAgent(),
            'viewed_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
