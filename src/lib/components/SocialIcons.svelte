<script lang="ts">
  import Icon from '@iconify/svelte';

  const socials = [
    {
      href: 'https://twitter.com/_joeyMcKenzie',
      display: 'Twitter',
      icon: 'simple-icons:x',
    },
    {
      href: 'https://github.com/JoeyMcKenzie',
      display: 'GitHub',
      icon: 'mdi:github',
    },
    {
      href: 'https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#',
      display: 'YouTube',
      icon: 'mdi:youtube',
    },
    {
      href: 'https://twitch.tv/JoeTheDevMan',
      display: 'Twitch',
      icon: 'mdi:twitch',
    },
    {
      href: 'https://linkedin.com/in/JoeyMcKenzie',
      display: 'LinkedIn',
      icon: 'mdi:linkedin',
    },
  ];
</script>

<div class="flex justify-center space-x-6">
  {#each socials as { href, icon, display }}
    <a {href}>
      <span class="sr-only">{display}</span>
      <Icon
        {icon}
        class="h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
      />
    </a>
  {/each}
</div>
