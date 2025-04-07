import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const today = new Date().toISOString().split('T')[0];
        return `/day/${today}`;
      },
    },
    {
      path: '/day/:date',
      name: 'day',
      component: Home,
    },
  ],
});

export default router;
