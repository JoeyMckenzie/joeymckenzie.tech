<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

final class VisitorHash
{
    public static function for(Request $request): string
    {
        return hash('xxh128', Config::string('app.key').'|'.($request->ip() ?? 'unknown'));
    }
}
