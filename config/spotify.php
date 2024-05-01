<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Spotify Refresh Token
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application. This value is used when the
    | framework needs to place the application's name in a notification or
    | any other location as required by the application or its packages.
    |
    */

    'refresh_token' => env('SPOTIFY_REFRESH_TOKEN', ''),

    /*
    |--------------------------------------------------------------------------
    | Spotify Client ID
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'client_id' => env('SPOTIFY_CLIENT_ID', ''),

    /*
    |--------------------------------------------------------------------------
    | Spotify Client Secret
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'client_secret' => env('SPOTIFY_CLIENT_SECRET', ''),
];
