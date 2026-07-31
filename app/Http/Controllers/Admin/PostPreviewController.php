<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PostPreviewRequest;
use App\Services\MarkdownRenderer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use League\CommonMark\Exception\CommonMarkException;

/**
 * Renders editor markdown for the live preview pane.
 *
 * This deliberately goes through the same `MarkdownRenderer` that publishing
 * uses, so the preview is byte-identical to the published page rather than an
 * approximation of it (docs/adr/0004).
 */
final class PostPreviewController extends Controller
{
    public function __construct(
        private readonly MarkdownRenderer $renderer,
    ) {
        //
    }

    /**
     * @throws CommonMarkException
     */
    public function __invoke(PostPreviewRequest $request): JsonResponse
    {
        $content = Arr::string($request->validated(), 'content');

        return response()->json([
            'html' => $this->renderer->render($content),
        ]);
    }
}
