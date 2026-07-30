<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(6);
        $slug = Str::slug($title);

        return [
            'tag_id' => Tag::factory(),
            'title' => $title,
            'slug' => $slug,
            'description' => fake()->sentence(),
            'content' => fake()->paragraphs(5, true),
            'content_html' => '<p>'.fake()->paragraph().'</p>',
            'image' => sprintf('posts/%s/cover.webp', $slug),
            'reading_time_minutes' => fake()->numberBetween(1, 15),
            'published_at' => fake()->dateTimeBetween('-2 years', 'now'),
            'views_count' => 0,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null,
        ]);
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => now()->subDay(),
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => now()->addDay(),
        ]);
    }
}
