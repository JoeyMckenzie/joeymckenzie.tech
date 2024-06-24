<template>
  <div class="flex items-center justify-between px-4">
    <div class="flex items-center justify-center">
      <ULink
        to="/"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        Home
      </ULink>
      <UIcon size="24" name="i-mdi-slash-forward" class="text-neutral-500" />
      <ULink
        to="/now"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        Now
      </ULink>
      <UIcon size="24" name="i-mdi-slash-forward" class="text-neutral-500" />
      <ULink
        to="/blog"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        Blog
      </ULink>
    </div>
    <ThemeToggle />
  </div>
</template>
