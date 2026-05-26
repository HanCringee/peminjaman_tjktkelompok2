<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlatStore } from '@/stores/alat'
import { useAuthStore } from '@/stores/auth'
import { showError, showInfo } from '@/utils/notify'
import { getKondisiColor, getStokBadge } from '@/utils/helpers'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const alatStore = useAlatStore()
const authStore = useAuthStore()

const isLoading = ref(true)

function goToPinjam() {
  if (!authStore.isAuthenticated) {
    showInfo('Silakan login terlebih dahulu')
    router.push({ path: '/login', query: { redirect: `/alat/${route.params.id}` } })
    return
  }
  router.push({ path: '/peminjaman/create', query: { alat_id: alatStore.detail?.alat_id } })
}

onMounted(async () => {
  try {
    await alatStore.fetchAlatById(route.params.id)
  } catch {
    showError('Gagal memuat detail alat')
    router.push('/alat')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="py-8 px-4 sm:px-6 lg:px-8 bg-background">
    <LoadingSpinner v-if="isLoading" />

    <template v-else-if="alatStore.detail">
      <button
        @click="router.back()"
        class="flex items-center text-sm text-accent hover:text-accent/80 mb-6"
      >
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <div class="bg-surface rounded-xl border border-muted/10 p-8 max-w-2xl">
        <h1 class="text-2xl font-bold text-text mb-2">{{ alatStore.detail.nama_alat }}</h1>
        <p class="text-muted mb-6">{{ alatStore.detail.kategori }}</p>

        <div class="flex flex-wrap gap-2 mb-6">
          <span
            class="px-3 py-1.5 rounded-full text-sm font-medium"
            :class="getStokBadge(alatStore.detail.stok).class"
          >
            Stok: {{ alatStore.detail.stok }}
          </span>
          <span
            class="px-3 py-1.5 rounded-full text-sm font-medium"
            :class="getKondisiColor(alatStore.detail.kondisi)"
          >
            {{ alatStore.detail.kondisi }}
          </span>
        </div>

        <div class="border-t border-muted/10 pt-6">
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm text-muted">Kategori</dt>
              <dd class="text-sm font-medium text-text">{{ alatStore.detail.kategori }}</dd>
            </div>
            <div>
              <dt class="text-sm text-muted">Stok</dt>
              <dd class="text-sm font-medium text-text">{{ alatStore.detail.stok }}</dd>
            </div>
            <div>
              <dt class="text-sm text-muted">Kondisi</dt>
              <dd class="text-sm font-medium text-text">{{ alatStore.detail.kondisi }}</dd>
            </div>
          </dl>
        </div>

        <button
          v-if="authStore.isAuthenticated"
          @click="goToPinjam"
          :disabled="alatStore.detail.stok <= 0"
          class="mt-6 w-full bg-accent text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ alatStore.detail.stok <= 0 ? 'Stok Habis' : 'Pinjam Alat Ini' }}
        </button>
      </div>
    </template>
  </div>
</template>
