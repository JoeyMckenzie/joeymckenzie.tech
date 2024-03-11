<?php

declare(strict_types=1);

return [
    'commit_sha' => env('GIT_COMMIT_SHA', ''),
    'production_url' => env('PRODUCTION_URL', ''),
];
