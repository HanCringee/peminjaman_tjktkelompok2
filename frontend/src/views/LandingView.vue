<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background">
    <div class="text-center max-w-2xl mx-auto px-4">
      <h1 class="text-4xl sm:text-5xl font-bold text-text mb-6">
        Sistem Peminjaman Alat
        <span class="text-accent">TJKT</span>
      </h1>
      <p class="text-lg text-muted mb-8 max-w-lg mx-auto">
        Kemudahan dalam meminjam dan mengelola alat-alat Teknik Komputer dan
        Telekomunikasi secara digital.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/alat"
          class="bg-accent text-white px-8 py-3 rounded-lg text-base font-medium hover:opacity-90 transition"
        >
          Lihat Daftar Alat
        </router-link>
        <router-link
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="bg-primary text-text px-8 py-3 rounded-lg text-base font-medium border border-muted/20 hover:bg-secondary transition"
        >
          Masuk
        </router-link>
        <router-link
          v-if="authStore.isAuthenticated"
          to="/dashboard"
          class="bg-primary text-text px-8 py-3 rounded-lg text-base font-medium border border-muted/20 hover:bg-secondary transition"
        >
          Dashboard
        </router-link>
      </div>
      <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
        <div class="bg-surface p-6 rounded-xl border border-muted/10">
          <div class="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="font-semibold text-text mb-2">Daftar Alat</h3>
          <p class="text-sm text-muted">Lihat seluruh alat yang tersedia untuk dipinjam dengan informasi lengkap.</p>
        </div>
        <div class="bg-surface p-6 rounded-xl border border-muted/10">
          <div class="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 class="font-semibold text-text mb-2">Peminjaman Mudah</h3>
          <p class="text-sm text-muted">Ajukan peminjaman alat dengan cepat melalui sistem online.</p>
        </div>
        <div class="bg-surface p-6 rounded-xl border border-muted/10">
          <div class="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="font-semibold text-text mb-2">Manajemen Admin</h3>
          <p class="text-sm text-muted">Admin dapat mengelola alat, approve, dan menyelesaikan peminjaman.</p>
        </div>
      </div>
    </div>
  </div>
</template>
