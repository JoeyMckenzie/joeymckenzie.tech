<?php

namespace App\Http\Controllers;

use DateInterval;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use OpenBrewery\OpenBrewery\ClientConnector;

class NowController
{
    public function index(): Response
    {
        if (Cache::has('randomBrewery')) {
            /** @var array{name:string, url:string} $cachedRandomBrewery */
            $cachedRandomBrewery = Cache::get('randomBrewery');

            return Inertia::render('Now', [
                'brewery' => $cachedRandomBrewery,
            ]);
        }

        $breweryWithUrlFound = false;
        $client = new ClientConnector();

        /** @var array{name:string, url:string}|null $breweryToCache */
        $breweryToCache = null;

        while (! $breweryWithUrlFound) {
            $random = $client->breweries()->random();
            $randomBrewery = $random[0];

            if (! empty($randomBrewery->websiteUrl)) {
                $breweryWithUrlFound = true;
                $breweryToCache = [
                    'name' => $randomBrewery->name,
                    'url' => $randomBrewery->websiteUrl,
                ];

                Cache::set('randomBrewery', $breweryToCache, new DateInterval('P1D'));
            }
        }

        return Inertia::render('Now', [
            'brewery' => $breweryToCache,
        ]);
    }
}
