<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import Icon from '@iconify/svelte';

  const socials = [
    {
      href: 'https://github.com/joeymckenzie',
      icon: 'mdi:github',
      display: 'GitHub',
      external: 'gg:external',
    },
    {
      href: 'https://linkedin.com/in/JoeyMcKenzie',
      icon: 'mdi:linkedin',
      display: 'LinkedIn',
      external: 'gg:external',
    },
    {
      href: 'https://x.com/_joeyMcKenzie',
      icon: 'mdi:twitter',
      display: 'Twitter',
      external: 'gg:external',
    },
    {
      href: 'https://resume.joeymckenzie.tech/JoeyMcKenzie_resume.pdf',
      icon: 'carbon:identification',
      display: 'Resume',
      external: 'material-symbols:download-sharp',
    },
  ];
</script>

<div
  class="mx-auto grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 py-8 sm:grid-cols-4"
>
  {#each socials as { display, href, icon, external }}
    <a
      class={`${buttonVariants({ variant: 'outline' })} flex flex-row gap-x-2`}
      {href}
    >
      <Icon {icon} class="h-5 w-5" />
      {display}
      <Icon icon={external} class="h-5 w-5" />
    </a>
  {/each}
</div>
