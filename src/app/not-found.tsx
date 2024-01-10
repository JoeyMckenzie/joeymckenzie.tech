import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          You seem to be lost...
        </h1>
        <p className="mt-6 text-base leading-7">
          Or, something's broken that I&apos;ll probably never fix.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button variant="outline">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
