import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Castle from '../views/Castle.vue'
import Nearby from '../views/Nearby.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/castles/:id',
    name: 'Castle',
    component: Castle,
  },
  {
    path: '/nearby',
    name: 'Nearby',
    component: Nearby,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
