<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Note extends Model
{
    protected $visible = [
        'title',
        'description'
    ];

    protected $fillable = [
        'title',
        'description'
    ];
}
