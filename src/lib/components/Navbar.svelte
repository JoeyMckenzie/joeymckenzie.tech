<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';

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
    <!--
      Uncomment if you'd like a theme switcher - there's some performance issues
      with switching themes that I'm too lazy to look into at the moment.
     -->
    <!-- <ThemeToggle /> -->
  </nav>
</header>
