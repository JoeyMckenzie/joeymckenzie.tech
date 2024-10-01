<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

final class FeedbackController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $request->validate([
            'feedback' => ['required', 'string', 'max:2000'],
        ]);

        /** @var string $feedback */
        $feedback = $request->feedback;

        Feedback::create([
            'text' => $feedback,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return Redirect::route('blogs.index')->with('status', 'Thanks for the feedback!');
    }
}
