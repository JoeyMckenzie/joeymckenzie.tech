<?php

declare(strict_types=1);

namespace App\Http\Controllers\Concerns;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;

/**
 * @phpstan-require-extends Controller
 */
trait HasCoverUrl
{
    private function coverUrl(?string $image): ?string
    {
        if (blank($image)) {
            return null;
        }

        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return $image;
        }

        return Storage::disk(Config::string('blog.image_disk'))->url($image);
    }
}
