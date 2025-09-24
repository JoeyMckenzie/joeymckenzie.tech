<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actions\GetCurrentSpotifyStatusAction;
use Illuminate\Support\Facades;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\View;
use Override;
use Spatie\CommonMarkShikiHighlighter\HighlightCodeExtension;
use Statamic\Events\EntrySaved;
use Statamic\Facades\Markdown;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    #[Override]
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        self::configureMarkdown();
        self::configureViewComposers();
        self::configureEvents();
    }

    private function configureMarkdown(): void
    {
        Markdown::addExtensions(fn (): array => [
            new HighlightCodeExtension(theme: 'one-dark-pro'),
        ]);
    }

    private function configureViewComposers(): void
    {
        Facades\View::composer('*', function (View $view): void {
            $response = new GetCurrentSpotifyStatusAction()->handle();

            $view->with('spotifyStatus', [
                'nowPlaying' => $response->nowPlaying,
                'href' => $response->href,
                'albumImageSrc' => $response->albumImageSrc,
                'trackTitle' => $response->trackTitle,
                'artist' => $response->artist,
            ]);
        });
    }

    private function configureEvents(): void
    {
        Event::listen(function (EntrySaved $event): void {
            /** @var array{slug: string} $entry */
            $entry = $event->entry;

            if (Cache::has($entry['slug'])) {
                Cache::forget($entry['slug']);
            }
        });
    }
}
