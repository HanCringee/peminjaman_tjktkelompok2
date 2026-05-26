import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/LandingView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { auth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { auth: true },
  },
  {
    path: '/alat',
    name: 'alat',
    component: () => import('@/views/AlatView.vue'),
  },
  {
    path: '/alat/:id',
    name: 'alat-detail',
    component: () => import('@/views/AlatDetailView.vue'),
  },
  {
    path: '/peminjaman',
    name: 'peminjaman',
    component: () => import('@/views/PeminjamanView.vue'),
    meta: { auth: true },
  },
  {
    path: '/peminjaman/create',
    name: 'peminjaman-create',
    component: () => import('@/views/PeminjamanCreateView.vue'),
    meta: { auth: true },
  },
  {
    path: '/peminjaman/:id',
    name: 'peminjaman-detail',
    component: () => import('@/views/PeminjamanDetailView.vue'),
    meta: { auth: true },
  },
  {
    path: '/peminjaman/:id/edit',
    name: 'peminjaman-edit',
    component: () => import('@/views/PeminjamanEditView.vue'),
    meta: { auth: true },
  },
  {
    path: '/admin',
    redirect: '/admin/peminjaman',
  },
  {
    path: '/admin/alat',
    name: 'admin-alat',
    component: () => import('@/views/admin/AdminAlatView.vue'),
    meta: { auth: true, admin: true },
  },
  {
    path: '/admin/alat/create',
    name: 'admin-alat-create',
    component: () => import('@/views/admin/AdminAlatCreateView.vue'),
    meta: { auth: true, admin: true },
  },
  {
    path: '/admin/alat/:id/edit',
    name: 'admin-alat-edit',
    component: () => import('@/views/admin/AdminAlatEditView.vue'),
    meta: { auth: true, admin: true },
  },
  {
    path: '/admin/peminjaman',
    name: 'admin-peminjaman',
    component: () => import('@/views/admin/AdminPeminjamanView.vue'),
    meta: { auth: true, admin: true },
  },
  {
    path: '/admin/peminjaman/:id',
    name: 'admin-peminjaman-detail',
    component: () => import('@/views/admin/AdminPeminjamanDetailView.vue'),
    meta: { auth: true, admin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.auth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else if (to.meta.admin && !authStore.isAdmin) {
    next({ name: 'dashboard' })
  } else if (to.name === 'peminjaman-create' && authStore.isAdmin) {
    next({ name: 'admin-peminjaman' })
  } else {
    next()
  }
})

export default router
