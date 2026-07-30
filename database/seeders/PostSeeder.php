<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Seed a realistic set of published posts (plus one draft and one
     * scheduled post to exercise author-only visibility) so the redesigned
     * blog index (JOEY-4.2) renders against DB data. Real markdown import
     * lands later; content bodies here are factory-generated.
     *
     * @var list<array{title: string, description: string, tag: string, published_at: ?string, reading: int, views: int}>
     */
    private array $posts = [
        ['title' => 'Local Laravel with nix and devenv', 'description' => 'We have Herd at home.', 'tag' => 'laravel', 'published_at' => '2026-05-19', 'reading' => 14, 'views' => 1243],
        ['title' => 'The wonderful world of worktrees and Laravel', 'description' => 'One clone, many branches, zero context switching.', 'tag' => 'laravel', 'published_at' => '2026-02-22', 'reading' => 9, 'views' => 986],
        ['title' => 'Terminally driven, Laravel inspired', 'description' => 'Neovim (btw).', 'tag' => 'laravel', 'published_at' => '2026-01-22', 'reading' => 8, 'views' => 2117],
        ['title' => 'Parallel testing with Pest and SQLite', 'description' => 'Green suites, faster.', 'tag' => 'php', 'published_at' => '2025-05-20', 'reading' => 6, 'views' => 743],
        ['title' => 'Content caching with Statamic', 'description' => 'Flat files, fast reads.', 'tag' => 'laravel', 'published_at' => '2025-05-11', 'reading' => 7, 'views' => 512],
        ['title' => 'Dynamic error assertions with PHPStan', 'description' => 'Make the type checker do the arguing.', 'tag' => 'php', 'published_at' => '2025-03-11', 'reading' => 5, 'views' => 634],
        ['title' => 'Sharing types between PHP and the frontend with PHPStan', 'description' => 'One source of truth, two languages.', 'tag' => 'php', 'published_at' => '2025-02-13', 'reading' => 8, 'views' => 701],
        ['title' => 'Dapper multi-mapping, relationships, and value equality', 'description' => 'Hand-rolled ORM, honest SQL.', 'tag' => 'dotnet', 'published_at' => '2024-03-20', 'reading' => 9, 'views' => 458],
        ['title' => 'Exploring developer experience with PHP, public APIs, and beer', 'description' => "It's 2024 and PHP still isn't dead?!", 'tag' => 'php', 'published_at' => '2024-03-05', 'reading' => 10, 'views' => 1320],
        ['title' => 'Content-driven websites with PHP and Laravel', 'description' => 'Markdown in, static-fast pages out.', 'tag' => 'laravel', 'published_at' => '2023-12-03', 'reading' => 12, 'views' => 1567],
        ['title' => 'Back to the server with Rust, Axum, and htmx', 'description' => 'Insert meme about React devs rediscovering PHP.', 'tag' => 'rust', 'published_at' => '2023-07-11', 'reading' => 13, 'views' => 2894],
        ['title' => "Ziggin' around with linked lists", 'description' => 'Detecting loops on a whiteboard, in Zig.', 'tag' => 'zig', 'published_at' => '2023-05-23', 'reading' => 11, 'views' => 1102],
        ['title' => 'Going serverless with Rust and Shuttle', 'description' => 'Deploy a Rust API without touching a Dockerfile.', 'tag' => 'rust', 'published_at' => '2023-03-30', 'reading' => 12, 'views' => 1731],
        ['title' => 'Migrating to Astro', 'description' => 'Ship less JavaScript, keep the vibes.', 'tag' => 'astro', 'published_at' => '2023-03-15', 'reading' => 6, 'views' => 889],
        ['title' => 'React data fetching with RxJS', 'description' => 'Streams for people who miss Angular.', 'tag' => 'react', 'published_at' => '2022-03-02', 'reading' => 9, 'views' => 640],
        // Author-only: a draft and a future-dated post (hidden from guests).
        ['title' => 'Half-baked thoughts on effect systems', 'description' => 'A draft that guests should never see.', 'tag' => 'rust', 'published_at' => null, 'reading' => 7, 'views' => 0],
        ['title' => 'Something scheduled for later', 'description' => 'A future-dated post, author eyes only for now.', 'tag' => 'laravel', 'published_at' => '2027-06-01', 'reading' => 5, 'views' => 0],
    ];

    public function run(): void
    {
        /** @var array<string, int> $tagIds */
        $tagIds = [];

        foreach ($this->posts as $post) {
            $tagIds[$post['tag']] ??= Tag::query()->firstOrCreate(['name' => $post['tag']])->id;

            Post::factory()->create([
                'tag_id' => $tagIds[$post['tag']],
                'title' => $post['title'],
                'slug' => Str::slug($post['title']),
                'description' => $post['description'],
                'reading_time_minutes' => $post['reading'],
                'published_at' => $post['published_at'],
                'views_count' => $post['views'],
            ]);
        }
    }
}
