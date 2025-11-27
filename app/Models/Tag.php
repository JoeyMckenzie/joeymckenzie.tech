<?php

declare(strict_types=1);

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Sushi\Sushi;

/**
 * @property int $id
 * @property string|null $name
 * @property-read string $hash_tagged
 * @property-read Collection<int, Post> $posts
 * @property-read int|null $posts_count
 *
 * @method static Builder<static>|Tag newModelQuery()
 * @method static Builder<static>|Tag newQuery()
 * @method static Builder<static>|Tag query()
 * @method static Builder<static>|Tag whereId($value)
 * @method static Builder<static>|Tag whereName($value)
 *
 * @mixin Eloquent
 */
final class Tag extends Model
{
    use Sushi;

    /**
     * @var list<array{id: positive-int, name: string}>
     */
    protected array $rows = [
        [
            'id' => 1,
            'name' => 'laravel',
        ],
        [
            'id' => 2,
            'name' => 'php',
        ],
        [
            'id' => 3,
            'name' => 'dotnet',
        ],
        [
            'id' => 4,
            'name' => 'angular',
        ],
        [
            'id' => 5,
            'name' => 'astro',
        ],
        [
            'id' => 6,
            'name' => 'design',
        ],
        [
            'id' => 7,
            'name' => 'react',
        ],
        [
            'id' => 8,
            'name' => 'rust',
        ],
        [
            'id' => 9,
            'name' => 'zig',
        ],
    ];

    /**
     * @return HasMany<Post, covariant $this>
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * @return Attribute<non-falsy-string, never>
     */
    public function hashTagged(): Attribute
    {
        return Attribute::get(
            fn (): string => "#$this->name"
        );
    }
}
