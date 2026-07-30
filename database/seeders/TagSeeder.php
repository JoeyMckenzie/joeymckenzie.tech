<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        Tag::query()->upsert([
            ['id' => 1, 'name' => 'laravel', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'php', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'name' => 'dotnet', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'name' => 'angular', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'name' => 'astro', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 6, 'name' => 'design', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 7, 'name' => 'react', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 8, 'name' => 'rust', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 9, 'name' => 'zig', 'created_at' => $now, 'updated_at' => $now],
        ], ['id'], ['name', 'updated_at']);
    }
}
