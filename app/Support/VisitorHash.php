<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

final class VisitorHash
{
    /**
     * A stable per-visitor hash for anonymous dedup (views + reactions):
     * xxh128 of the request IP, salted with the app key so raw IPs aren't
     * recoverable from the stored value.
     */
    public static function for(Request $request): string
    {
        return hash('xxh128', Config::string('app.key').'|'.($request->ip() ?? 'unknown'));
    }
}
