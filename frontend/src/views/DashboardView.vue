<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePeminjamanStore } from '@/stores/peminjaman'
import { useRouter } from 'vue-router'
import { showError } from '@/utils/notify'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const peminjamanStore = usePeminjamanStore()
const router = useRouter()
const isLoading = ref(true)

const stats = computed(() => {
  const list = peminjamanStore.list
  return {
    total: list.length,
    pending: list.filter((p) => p.status === 'pending').length,
    approved: list.filter((p) => p.status === 'approved').length,
    selesai: list.filter((p) => p.status === 'selesai').length,
  }
})

onMounted(async () => {
  try {
    await peminjamanStore.fetchPeminjaman()
  } catch {
    showError('Gagal memuat data peminjaman')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="py-8 px-4 sm:px-6 lg:px-8 bg-background">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-text">
        Selamat datang, {{ authStore.user?.name }}
      </h1>
      <p class="text-muted mt-1">Ini adalah dashboard peminjaman alat Anda.</p>
    </div>

    <LoadingSpinner v-if="isLoading" />

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-surface rounded-xl border border-muted/10 p-6">
          <p class="text-sm text-muted font-medium">Total Peminjaman</p>
          <p class="text-3xl font-bold text-text mt-2">{{ stats.total }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-muted/10 p-6">
          <p class="text-sm text-muted font-medium">Pending</p>
          <p class="text-3xl font-bold text-yellow-400 mt-2">{{ stats.pending }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-muted/10 p-6">
          <p class="text-sm text-muted font-medium">Disetujui</p>
          <p class="text-3xl font-bold text-blue-400 mt-2">{{ stats.approved }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-muted/10 p-6">
          <p class="text-sm text-muted font-medium">Selesai</p>
          <p class="text-3xl font-bold text-green-400 mt-2">{{ stats.selesai }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          to="/alat"
          class="bg-surface rounded-xl border border-muted/10 p-6 hover:bg-primary transition"
        >
          <h3 class="font-semibold text-text">Lihat Alat</h3>
          <p class="text-sm text-muted mt-1">Jelajahi alat yang tersedia</p>
        </router-link>
        <router-link
          to="/peminjaman"
          class="bg-surface rounded-xl border border-muted/10 p-6 hover:bg-primary transition"
        >
          <h3 class="font-semibold text-text">Peminjaman Saya</h3>
          <p class="text-sm text-muted mt-1">Lihat riwayat peminjaman</p>
        </router-link>
        <router-link
          v-if="!authStore.isAdmin"
          to="/peminjaman/create"
          class="bg-surface rounded-xl border border-muted/10 p-6 hover:bg-primary transition"
        >
          <h3 class="font-semibold text-text">Pinjam Alat</h3>
          <p class="text-sm text-muted mt-1">Ajukan peminjaman baru</p>
        </router-link>
        <router-link
          to="/profile"
          class="bg-surface rounded-xl border border-muted/10 p-6 hover:bg-primary transition"
        >
          <h3 class="font-semibold text-text">Edit Profil</h3>
          <p class="text-sm text-muted mt-1">Ubah data akun dan foto profil</p>
        </router-link>
        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          class="bg-surface rounded-xl border border-muted/10 p-6 hover:bg-primary transition"
        >
          <h3 class="font-semibold text-text">Admin Panel</h3>
          <p class="text-sm text-muted mt-1">Kelola alat dan peminjaman</p>
        </router-link>
      </div>
    </template>
  </div>
</template>
