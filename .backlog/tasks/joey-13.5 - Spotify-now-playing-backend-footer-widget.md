---
id: JOEY-13.5
title: Spotify now-playing (backend + footer widget)
status: Done
assignee: []
created_date: '2026-07-30 18:33'
updated_date: '2026-07-30 19:40'
labels:
  - frontend
  - backend
milestone: m-3
dependencies: []
parent_task_id: JOEY-13
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the Spotify now-playing integration that lives in the PublicLayout footer statusline. Backend: a SpotifyService that exchanges the refresh token for an access token (cached ~10 min) and calls GET https://api.spotify.com/v1/me/player?type=track,episode, mapping to a NowPlaying shape (title, artist, album image, href) for both tracks and podcast episodes; a controller returning JSON, response cached ~30s; a `spotify` block in config/services.php. Credentials (SPOTIFY_CLIENT_ID/SECRET/REFRESH_TOKEN) are already in .env. No new Composer dependency — use Laravel's Http client. Frontend: a now-playing widget for the footer statusline slot (mono `▶ track — artist`, iris accent, graceful "not listening" fallback), polling ~30s. Old reference: ../joeymckenzie.tech.old/main/{app/Http/Controllers/Api/SpotifyController.php, app/Services/SpotifyService.php, app/Data/NowPlayingData.php, config/services.php, resources/js/components/spotify-now-playing.tsx}.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A now-playing endpoint returns the current track/episode (title, artist, album image, href) or a not-playing state, response cached ~30s; the access token is refreshed and cached
- [x] #2 The footer widget renders now-playing in the statusline, polls ~30s, and falls back gracefully when nothing is playing or the API errors
- [x] #3 A test with a faked HTTP client covers both a playing and a not-playing response
- [x] #4 No new Composer dependency; configuration via config/services.php + env
- [x] #5 composer fmt/lint/refactor and frontend format/lint/type checks pass
<!-- AC:END -->
