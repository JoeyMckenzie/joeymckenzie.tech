<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center justify-center text-sm">
      <ULink
        to="/"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        Home
      </ULink>
      <UIcon size="16" name="i-mdi-slash-forward" class="text-neutral-500" />
      <ULink
        to="/now"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        Now
      </ULink>
      <UIcon size="16" name="i-mdi-slash-forward" class="text-neutral-500" />
      <!-- Kind of a hacky workaround to get child routes while maintaining the same active/inactive classes like other routes -->
      <ULink
        to="/blog"
        :class="{
          'active text-primary': $route.path.includes('/blog'),
          'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200': !$route.path.includes('/blog'),
        }"
      >
        Blog
      </ULink>
    </div>
    <ThemeToggle />
  </div>
</template>
