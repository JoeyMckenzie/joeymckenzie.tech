<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

final class Note extends Model
{
    protected $fillable = [
        'description',
    ];

    protected $appends = [
        'display_date',
    ];

    /**
     * @return Attribute<string, string>
     */
    public function displayDate(): Attribute
    {
        return new Attribute(
            get: fn (): string => $this->created_at?->format('M j, Y') ?? ''
        );
    }
}
