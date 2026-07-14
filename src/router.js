import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'home', component: () => import('./views/Home.vue') },
  { path: '/regions', name: 'regions', component: () => import('./views/Regions.vue') },
  { path: '/regions/:rid', name: 'hospitals', component: () => import('./views/Hospitals.vue'), props: true },
  { path: '/projects', name: 'projects-all', component: () => import('./views/Projects.vue') },
  { path: '/projects/:hid', name: 'projects-hospital', component: () => import('./views/Projects.vue'), props: true },
  { path: '/detail/:id', name: 'detail', component: () => import('./views/Detail.vue'), props: true },
  { path: '/booking/:id', name: 'booking', component: () => import('./views/Booking.vue'), props: true },
  { path: '/confirm', name: 'confirm', component: () => import('./views/Confirm.vue') },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
