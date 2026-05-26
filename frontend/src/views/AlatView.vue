<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAlatStore } from '@/stores/alat'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { showError, showInfo } from '@/utils/notify'
import { getKondisiColor, getStokBadge } from '@/utils/helpers'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const alatStore = useAlatStore()
const authStore = useAuthStore()
const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('')
const showDropdown = ref(false)
const isLoading = ref(true)

const categories = computed(() => {
  const cats = [...new Set(alatStore.list.map((a) => a.kategori))]
  return cats.filter(Boolean)
})

const filteredAlat = computed(() => {
  return alatStore.list.filter((a) => {
    const matchSearch = a.nama_alat?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = selectedCategory.value ? a.kategori === selectedCategory.value : true
    return matchSearch && matchCategory
  })
})

function goToDetail(id) {
  router.push(`/alat/${id}`)
}

function goToPinjam(id) {
  if (!authStore.isAuthenticated) {
    showInfo('Silakan login terlebih dahulu')
    router.push({ path: '/login', query: { redirect: `/alat/${id}` } })
    return
  }
  router.push({ path: '/peminjaman/create', query: { alat_id: id } })
}

onMounted(async () => {
  try {
    await alatStore.fetchAlat()
  } catch {
    showError('Gagal memuat data alat')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="py-8 px-4 sm:px-6 lg:px-8 bg-background">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-bold text-text">Daftar Alat</h1>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari alat..."
          class="w-full px-4 py-2.5 bg-surface border border-muted/10 rounded-lg text-sm text-text placeholder-muted focus:ring-2 focus:ring-accent focus:border-accent outline-none"
        />
      </div>
      <select
        v-model="selectedCategory"
        class="px-4 py-2.5 bg-surface border border-muted/10 rounded-lg text-sm text-text focus:ring-2 focus:ring-accent outline-none"
      >
        <option value="">Semua Kategori</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <LoadingSpinner v-if="isLoading" message="Memuat daftar alat..." />

    <EmptyState
      v-else-if="filteredAlat.length === 0"
      title="Tidak ada alat ditemukan"
      :description="searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada alat yang terdaftar'"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="alat in filteredAlat"
        :key="alat.alat_id"
        class="bg-surface rounded-xl border border-muted/10 p-6 hover:bg-primary transition cursor-pointer"
        @click="goToDetail(alat.alat_id)"
      >
        <h3 class="text-lg font-semibold text-text mb-2">{{ alat.nama_alat }}</h3>
        <p class="text-sm text-muted mb-4">{{ alat.kategori }}</p>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
            class="px-2.5 py-1 rounded-full text-xs font-medium"
            :class="getStokBadge(alat.stok).class"
          >
            {{ getStokBadge(alat.stok).label }} ({{ alat.stok }})
          </span>
          <span
            class="px-2.5 py-1 rounded-full text-xs font-medium"
            :class="getKondisiColor(alat.kondisi)"
          >
            {{ alat.kondisi }}
          </span>
        </div>

        <div class="flex gap-2">
          <button
            @click.stop="goToDetail(alat.alat_id)"
            class="flex-1 text-center bg-accent/20 text-accent py-2 rounded-lg text-sm font-medium hover:bg-accent/30 transition"
          >
            Detail
          </button>
          <button
            v-if="authStore.isAuthenticated"
            @click.stop="goToPinjam(alat.alat_id)"
            class="flex-1 text-center bg-accent text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Pinjam
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
