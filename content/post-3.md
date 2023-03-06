---
title: Suh dude
summary: dude suh
date: 2021-12-24
image: ../public/me.jpg
category: design
---

Ullamco et nostrud magna commodo nostrud occaecat quis pariatur id ipsum. Ipsum
consequat enim id excepteur consequat nostrud esse esse fugiat dolore.
Reprehenderit occaecat exercitation non cupidatat in eiusmod laborum ex eu
fugiat aute culpa pariatur. Irure elit proident consequat veniam minim ipsum ex
pariatur.

Mollit nisi cillum exercitation minim officia velit laborum non Lorem
adipisicing dolore. Labore commodo consectetur commodo velit adipisicing irure
dolore dolor reprehenderit aliquip. Reprehenderit cillum mollit eiusmod
excepteur elit ipsum aute pariatur in. Cupidatat ex culpa velit culpa ad
labore exercitation irure laborum.

```ts
export async function getCurrentlyListeningTo(): Promise<
  ListentingToMeta | undefined
> {
  const token = await getSpotifyAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Note: 204 will comeback when nothing is playing
  if (response.ok && response.status === 200) {
    const listeningToResponse: CurrentlyListeningResponse =
      await response.json();

    // Podcasts nest all `context` nodes under the `item` node instead
    if (listeningToResponse.currently_playing_type === 'track') {
      const item = listeningToResponse.item;
      const context = listeningToResponse.context;

      const albumImage = item.album?.images[0];
      const trackTitle = item?.name;
      const artist = item?.artists ? item.artists[0]?.name : '';
      const href = context.external_urls?.spotify;

      return {
        albumImage,
        trackTitle,
        artist,
        href,
      };
    } else {
      const item = listeningToResponse.item;

      const albumImage = item.images![0];
      const trackTitle = item.name;
      const artist = item.show?.name ?? '';
      const href = item.external_urls?.spotify ?? '';

      return {
        albumImage,
        trackTitle,
        artist,
        href,
      };
    }
  }
}
```
