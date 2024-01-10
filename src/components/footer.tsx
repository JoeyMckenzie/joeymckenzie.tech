import { FaSpotify } from "react-icons/fa";
import { PoweredBy } from "./powered-by";
import { SocialIcons } from "./social-icons";
import { SpotifyTracker } from "./spotify-tracker";

export function Footer() {
  return (
    <div className="max-w-screen-4xl mx-auto mt-auto flex w-full flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end">
      <SocialIcons />
      <SpotifyTracker>
        <FaSpotify className="h-6 w-6 text-green-500" />
      </SpotifyTracker>
      <PoweredBy />
    </div>
  );
}
