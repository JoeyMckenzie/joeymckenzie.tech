<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Image\Image as ProcessedImage;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Normalises an image and stores it on the Cloudflare R2 disk (ADR 0002),
 * shared by the import backfill (JOEY-11) and the admin editor upload (JOEY-5.2).
 * Caps width at 1600px, re-encodes to WebP (~q70), stores publicly under
 * posts/{slug}/, and returns both the object key and its public URL.
 */
final class ImageProcessor
{
    private const int MAX_WIDTH = 1600;

    private const int WEBP_QUALITY = 70;

    /**
     * @param  UploadedFile|string  $source  An uploaded file, a local path, or raw image bytes.
     * @return array{key: string, url: string}
     */
    public function store(UploadedFile|string $source, string $slug, ?string $name = null): array
    {
        $image = $this->read($source);

        if ($image->width() > self::MAX_WIDTH) {
            $image = $image->scale(width: self::MAX_WIDTH);
        }

        $key = sprintf('posts/%s/%s.webp', $slug, $name ?? Str::random(20));
        $disk = Storage::disk(Config::string('blog.image_disk'));

        $disk->put($key, $image->optimize('webp', self::WEBP_QUALITY)->toBytes(), 'public');

        return [
            'key' => $key,
            'url' => $disk->url($key),
        ];
    }

    private function read(UploadedFile|string $source): ProcessedImage
    {
        if ($source instanceof UploadedFile) {
            return Image::fromUpload($source);
        }

        // Raw image bytes contain null bytes (and are never a path), so only
        // treat null-byte-free strings as candidate file paths.
        if (! str_contains($source, "\0") && is_file($source)) {
            return Image::fromPath($source);
        }

        return Image::fromBytes($source);
    }
}
