<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\ContentRepositoryContract;
use Inertia\Inertia;
use Inertia\Response;

final class HomeController extends Controller
{
    public function __construct(private readonly ContentRepositoryContract $contentRepository)
    {
    }

    public function __invoke(): Response
    {
        $frontMatters = collect($this->contentRepository->getLatestBlogPostMetadata())
            ->toArray();

        return Inertia::render('Index', [
            'frontMatters' => array_values($frontMatters),
        ]);
    }
}
