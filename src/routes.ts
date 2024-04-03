import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/HomePage.vue'),
    },
    {
      path: '/now',
      name: 'now',
      component: () => import('./pages/NowPage.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('./pages/BlogPage.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'post',
      component: () => import('./pages/BlogPostPage.vue'),
    },
  ],
});

export default router;
