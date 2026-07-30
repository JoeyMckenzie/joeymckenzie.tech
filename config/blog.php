<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Blog image disk
    |--------------------------------------------------------------------------
    |
    | The filesystem disk post images are stored on and resolved from (covers
    | and inline body images). Production uses Cloudflare R2 ("r2"); local dev
    | can point at the "public" disk so images serve without R2 credentials.
    |
    */

    'image_disk' => env('BLOG_IMAGE_DISK', 'r2'),
];
