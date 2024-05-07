<?php

declare(strict_types=1);

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function (): void {
    // @phpstan-ignore-next-line
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();
