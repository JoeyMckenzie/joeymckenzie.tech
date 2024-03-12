<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Note extends Model
{
    protected $visible = [
        'title',
        'description',
    ];

    protected $fillable = [
        'title',
        'description',
    ];
}
