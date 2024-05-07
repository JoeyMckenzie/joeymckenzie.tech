<?php

declare(strict_types=1);

namespace App\Http\Actions;

use App\Contracts\ContentUtilityContract;
use App\Http\Controllers\Controller;
use DateInterval;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Spatie\Sitemap\Sitemap;

final class GenerateSitemap extends Controller
{
    private const int ONE_WEEK_SECONDS = 604800;

    private const string SITEMAP_CACHE_KEY = 'sitemap';

    public function __invoke(ContentUtilityContract $contentUtility): Response
    {
        if (Cache::has(self::SITEMAP_CACHE_KEY)) {
            /** @var Sitemap $cachedSitemap */
            $cachedSitemap = Cache::get(self::SITEMAP_CACHE_KEY);
            $sitemap = $cachedSitemap;
        } else {
            $sitemap = $contentUtility->generateSitemap();
            Cache::set(self::SITEMAP_CACHE_KEY, $sitemap, new DateInterval('PT5M'));
        }

        return response($sitemap->render(), 200, [
            'Content-Type' => 'application/xml',
            'Cache-Control' => 'max-age='.self::ONE_WEEK_SECONDS.', public',
        ]);
    }
}
