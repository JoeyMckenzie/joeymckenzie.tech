import { PoweredBy } from './powered-by';
import { SocialIcons } from './socials-icons';

export function Footer() {
  return (
    <div className="mx-auto flex w-full max-w-screen-md flex-col items-center justify-evenly gap-y-8 p-8 sm:flex-row">
      <PoweredBy />
      <SocialIcons />
    </div>
  );
}
