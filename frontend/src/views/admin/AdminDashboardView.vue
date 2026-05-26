<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAlatStore } from '@/stores/alat'
import { usePeminjamanStore } from '@/stores/peminjaman'
import { useAuthStore } from '@/stores/auth'
import { showError } from '@/utils/notify'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const alatStore = useAlatStore()
const peminjamanStore = usePeminjamanStore()
const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(true)

const stats = computed(() => {
  const p = peminjamanStore.list
  return {
    totalAlat: alatStore.list.length,
    totalPeminjaman: p.length,
    pending: p.filter((x) => x.status === 'pending').length,
    approved: p.filter((x) => x.status === 'approved').length,
    selesai: p.filter((x) => x.status === 'selesai').length,
  }
})

onMounted(async () => {
  try {
    await Promise.all([alatStore.fetchAlat(), peminjamanStore.fetchPeminjaman()])
  } catch {
    showError('Gagal memuat data')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="bg-background py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-text">Admin Dashboard</h1>
      <p class="text-muted mt-1">Kelola alat dan peminjaman.</p>
    </div>

    <LoadingSpinner v-if="isLoading" />

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div class="bg-surface rounded-xl border border-muted/10 p-5">
          <p class="text-sm text-muted font-medium">Total Alat</p>
          <p class="text-2xl font-bold text-text mt-1">{{ stats.totalAlat }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-muted/10 p-5">
          <p class="text-sm text-muted font-medium">Total Peminjaman</p>
          <p class="text-2xl font-bold text-text mt-1">{{ stats.totalPeminjaman }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-muted/10 p-5">
          <p class="text-sm text-muted font-medium">Pending</p>
          <p class="text-2xl font-bold text-yellow-400 mt-1">{{ stats.pending }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-muted/10 p-5">
          <p class="text-sm text-muted font-medium">Disetujui</p>
          <p class="text-2xl font-bold text-blue-400 mt-1">{{ stats.approved }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-muted/10 p-5">
          <p class="text-sm text-muted font-medium">Selesai</p>
          <p class="text-2xl font-bold text-green-400 mt-1">{{ stats.selesai }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          to="/admin/alat"
          class="bg-surface rounded-xl border border-muted/10 p-6 hover:bg-primary/30 transition"
        >
          <h3 class="font-semibold text-text">Manajemen Alat</h3>
          <p class="text-sm text-muted mt-1">Tambah, edit, dan hapus alat</p>
        </router-link>
        <router-link
          to="/admin/alat/create"
          class="bg-surface rounded-xl border border-muted/10 p-6 hover:bg-primary/30 transition"
        >
          <h3 class="font-semibold text-text">Tambah Alat Baru</h3>
          <p class="text-sm text-muted mt-1">Tambahkan alat ke inventory</p>
        </router-link>
        <router-link
          to="/admin/peminjaman"
          class="bg-surface rounded-xl border border-muted/10 p-6 hover:bg-primary/30 transition"
        >
          <h3 class="font-semibold text-text">Manajemen Peminjaman</h3>
          <p class="text-sm text-muted mt-1">Approve dan selesaikan peminjaman</p>
        </router-link>
      </div>
    </template>
  </div>
</template>
