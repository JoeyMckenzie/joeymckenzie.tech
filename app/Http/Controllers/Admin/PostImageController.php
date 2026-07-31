<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PostImageRequest;
use App\Services\ImageProcessor;
use Illuminate\Http\JsonResponse;

/**
 * Accepts an inline body image from the editor.
 *
 * Returns the absolute public URL rather than the object key, because inline
 * images are embedded in free-text markdown and the browser needs a real src
 * (docs/adr/0002). Cover images, which the admin re-processes, keep their key.
 */
final class PostImageController extends Controller
{
    public function __construct(
        private readonly ImageProcessor $images,
    ) {
        //
    }

    public function __invoke(PostImageRequest $request): JsonResponse
    {
        $stored = $this->images->store(
            $request->uploadedImage(),
            $request->storagePrefix(),
        );

        return response()->json([
            'url' => $stored['url'],
        ]);
    }
}
