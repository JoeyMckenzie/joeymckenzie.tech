<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentSync extends Model
{
    protected $visible = [
        'commit',
    ];

    protected $fillable = [
        'commit',
    ];
}
