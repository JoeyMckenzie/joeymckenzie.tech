<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViewCount extends Model
{
    use HasFactory;

    /**
     * @var string[]
     */
    protected $fillable = [
        'slug',
        'views',
    ];
}
