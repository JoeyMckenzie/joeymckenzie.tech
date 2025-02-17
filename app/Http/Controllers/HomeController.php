<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\OfficeQuote;
use App\Services\BlueskyConnector;
use Illuminate\View\View;

final readonly class HomeController
{
    public function __construct(
        private BlueskyConnector $connector
    ) {
        //
    }

    public function index(): View
    {
        $quote = OfficeQuote::inRandomOrder()->first();
        $latestPost = $this->connector->getLatestPost();

        return view('index', [
            'quote' => $quote,
            'latestPost' => $latestPost,
        ]);
    }
}
