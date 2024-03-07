<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
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
