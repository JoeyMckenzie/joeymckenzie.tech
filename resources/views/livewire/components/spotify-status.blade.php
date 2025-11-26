{{ if spotifyStatus.nowPlaying }}
    {{ partial:components/spotify-now-listening }}
        {{ slot }}
    {{ /partial:components/spotify-now-listening }}
{{ else }}
    {{ partial:components/spotify-silent }}
        {{ slot }}
    {{ /partial:components/spotify-silent }}
{{ /if }}
