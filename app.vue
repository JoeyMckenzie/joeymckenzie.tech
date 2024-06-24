<template>
  <Body class="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
    <NuxtLayout>
      <Navbar />
      <NuxtPage />
      <Footer />
    </NuxtLayout>
  </Body>
</template>

<style>
.page-enter-active, .page-leave-active {
  transition: all 0.2s;
}

.page-enter-from, .page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
