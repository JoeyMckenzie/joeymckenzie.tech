<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Feedback extends Model
{
    protected $fillable = [
        'text',
        'ip_address',
        'user_agent',
    ];
}
