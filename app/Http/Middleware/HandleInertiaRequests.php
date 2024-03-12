<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Contracts\MusicTrackerContract;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Override;
use Tightenco\Ziggy\Ziggy;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(private readonly MusicTrackerContract $musicTracker)
    {
    }

    /**
     * Determine the current asset version.
     */
    #[Override]
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    #[Override]
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'commit' => config('misc.commit_sha'),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'spotify' => $this->musicTracker->getNowPlaying(),
        ];
    }
}
