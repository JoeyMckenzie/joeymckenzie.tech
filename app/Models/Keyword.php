<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class Keyword extends Model
{
    protected $fillable = [
        'word',
    ];

    protected $visible = [
        'word',
    ];

    /**
     * @return BelongsToMany<Post, covariant $this>
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }
}
