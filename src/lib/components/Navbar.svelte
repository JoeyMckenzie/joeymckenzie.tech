<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';

  type NavLinkProps = {
    href: string;
    display: string;
  };

  const links: NavLinkProps[] = [
    {
      display: 'Home',
      href: '/',
    },
    {
      display: 'About',
      href: '/about',
    },
    {
      display: 'Blog',
      href: '/blog',
    },
  ];
</script>

<header>
  <nav class="flex flex-row items-center justify-center gap-x-2 px-6 py-8">
    {#each links as { display, href }}
      <a class={buttonVariants({ variant: 'outline' })} {href}>
        {display}
      </a>
    {/each}
    <ThemeToggle />
  </nav>
</header>
