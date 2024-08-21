<template>
  <Head>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
  </Head>
  <Body class="mx-auto max-w-3xl p-4 sm:px-6 lg:px-8">
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
