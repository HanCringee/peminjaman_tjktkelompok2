<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { showSuccess, showError } from '@/utils/notify'
import { getAvatarUrl, getInitials, getAvatarBg } from '@/utils/helpers'

const authStore = useAuthStore()
const router = useRouter()
const mobileOpen = ref(false)

const avatarUrl = computed(() => getAvatarUrl(authStore.user))
const initials = computed(() => getInitials(authStore.user?.name))
const bgGradient = computed(() => getAvatarBg(authStore.user?.name))

async function handleLogout() {
  try {
    await authStore.logout()
    showSuccess('Logout berhasil')
    router.push('/login')
  } catch {
    showError('Gagal logout')
  }
}
</script>

<template>
  <nav class="bg-surface shadow-sm border-b border-muted/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center gap-3">
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-surface border border-muted/20 shadow-sm">
              <img src="/logo.svg" alt="TJKT Alat" class="w-8 h-8 rounded-xl" />
            </span>
            <span class="text-xl font-bold text-accent tracking-tight">TJKT</span>
          </router-link>
          <div class="hidden md:flex ml-10 items-center space-x-1">
            <router-link
              to="/alat"
              class="text-text/80 hover:text-text hover:bg-muted/10 px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              Daftar Alat
            </router-link>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/dashboard"
              class="text-text/80 hover:text-text hover:bg-muted/10 px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              Dashboard
            </router-link>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/peminjaman"
              class="text-text/80 hover:text-text hover:bg-muted/10 px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              Peminjaman
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin/peminjaman"
              class="text-text/80 hover:text-text hover:bg-muted/10 px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              Admin
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <router-link
              to="/profile"
              class="flex items-center group"
            >
              <div
                class="w-8 h-8 rounded-full overflow-hidden border-2 border-muted/20 group-hover:border-accent transition flex-shrink-0"
              >
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  alt="avatar"
                  class="w-full h-full object-cover"
                  @error="authStore.user.avatar_url = null"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br flex items-center justify-center"
                  :class="bgGradient"
                >
                  <span class="text-white text-xs font-bold">{{ initials }}</span>
                </div>
              </div>
            </router-link>
            <button
              @click="handleLogout"
              class="bg-secondary text-text px-4 py-2 rounded-lg text-sm font-medium hover:bg-danger hover:text-white transition"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-text/80 hover:text-text px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="bg-secondary text-text px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent hover:text-white transition"
            >
              Register
            </router-link>
          </template>

          <button class="md:hidden p-2 text-muted hover:text-text" @click="mobileOpen = !mobileOpen">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="mobileOpen" class="md:hidden pb-4 space-y-1">
        <router-link
          to="/alat"
          class="block text-text/80 hover:text-text hover:bg-muted/10 px-3 py-2 rounded-lg text-sm font-medium transition"
          @click="mobileOpen = false"
        >
          Daftar Alat
        </router-link>
        <router-link
          v-if="authStore.isAuthenticated"
          to="/dashboard"
          class="block text-text/80 hover:text-text hover:bg-muted/10 px-3 py-2 rounded-lg text-sm font-medium transition"
          @click="mobileOpen = false"
        >
          Dashboard
        </router-link>
        <router-link
          v-if="authStore.isAuthenticated"
          to="/peminjaman"
          class="block text-text/80 hover:text-text hover:bg-muted/10 px-3 py-2 rounded-lg text-sm font-medium transition"
          @click="mobileOpen = false"
        >
          Peminjaman
        </router-link>
        <router-link
          v-if="authStore.isAdmin"
          to="/admin/peminjaman"
          class="block text-text/80 hover:text-text hover:bg-muted/10 px-3 py-2 rounded-lg text-sm font-medium transition"
          @click="mobileOpen = false"
        >
          Admin
        </router-link>
      </div>
    </div>
  </nav>
</template>
