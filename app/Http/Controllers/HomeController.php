<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\OfficeQuote;
use Illuminate\View\View;

final class HomeController
{
    public function index(): View
    {
        $quote = OfficeQuote::inRandomOrder()->first();

        return view('index', [
            'quote' => $quote,
        ]);
    }
}
