<script>
  import { buttonVariants } from '$lib/components/ui/button';
  import Icon from '@iconify/svelte';
</script>

<main class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
    <p class="text-base font-semibold">404</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
      You seem to be lost...
    </h1>
    <p class="mt-6 text-base leading-7">
      The page you're looking for doesn't exact, or something catastrophic
      happened that I'll probably never fix.
    </p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a
        class={`${buttonVariants({
          variant: 'secondary',
        })} flex flex-row gap-x-2`}
        href="/"
      >
        <Icon class="h-5 w-5" icon="mdi:arrow-left" />
        Back to safety
      </a>
    </div>
  </div>
</main>
