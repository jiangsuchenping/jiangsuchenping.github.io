import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/chinese',
    name: 'Chinese',
    component: () => import('../views/Chinese.vue')
  },
  {
    path: '/math',
    name: 'Math',
    component: () => import('../views/Math.vue')
  },
  {
    path: '/english',
    name: 'English',
    component: () => import('../views/English.vue')
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('../views/Games.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 