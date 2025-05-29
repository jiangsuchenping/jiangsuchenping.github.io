import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Chinese from '../views/Chinese.vue'
import MathGame from '../views/Math.vue'
import English from '../views/English.vue'
import Games from '../views/Games.vue'
import CheckIn from '../views/CheckIn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/chinese',
      name: 'chinese',
      component: Chinese
    },
    {
      path: '/math',
      name: 'math',
      component: MathGame
    },
    {
      path: '/english',
      name: 'english',
      component: English
    },
    {
      path: '/games',
      name: 'games',
      component: Games
    },
    {
      path: '/check-in',
      name: 'check-in',
      component: CheckIn
    }
  ]
})

export default router 