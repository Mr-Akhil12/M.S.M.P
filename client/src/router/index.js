// filepath: client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Landing from '../views/Landing.vue'
import OTPVerify from '../views/OTPVerify.vue'
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue' 

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { path: '/verify-otp', name: 'OTPVerify', component: OTPVerify },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router