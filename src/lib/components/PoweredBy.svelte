<script lang="ts">
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  export let commitSha = '';
  const commitShaForDisplay = commitSha.substring(0, 6);
  const commitUrl = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${commitSha}`;
  const poweredBy = [
    {
      display: 'Svelte',
      href: 'https://svelte.dev',
      icon: 'logos:svelte-icon',
    },
    {
      display: 'Vercel',
      href: 'https://vercel.com',
      icon: 'simple-icons:vercel',
      classes: 'dark:text-white text-black',
    },
  ];

  onMount(() => console.log(commitSha));
</script>

<div class="mx-auto inline-flex flex-row items-center gap-x-4 md:mx-0">
  <p class="font-ubuntu text-center text-xs leading-5">Powered by</p>
  {#each poweredBy as { display, icon, href, classes }}
    <a {href}>
      <span class="sr-only">{display}</span>
      <Icon
        class={`h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ${classes}`}
        {icon}
      />
    </a>
  {/each}
  <a class="font-ubuntu text-center text-xs leading-5" href={commitUrl}>
    {commitShaForDisplay}
  </a>
</div>
