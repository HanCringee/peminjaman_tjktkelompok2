<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePeminjamanStore } from '@/stores/peminjaman'
import { showError } from '@/utils/notify'
import { formatDate, formatStatus, getStatusColor } from '@/utils/helpers'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const peminjamanStore = usePeminjamanStore()

const isLoading = ref(true)

onMounted(async () => {
  try {
    await peminjamanStore.fetchPeminjamanById(route.params.id)
  } catch {
    showError('Gagal memuat detail peminjaman')
    router.push('/peminjaman')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="py-8 px-4 sm:px-6 lg:px-8 bg-background">
    <LoadingSpinner v-if="isLoading" />

    <template v-else-if="peminjamanStore.detail">
      <button
        @click="router.back()"
        class="flex items-center text-sm text-accent hover:text-accent/80 mb-6"
      >
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <div class="max-w-2xl">
        <div class="bg-surface rounded-xl border border-muted/10 p-8">
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-text">Detail Peminjaman</h1>
            <span
              class="px-3 py-1.5 rounded-full text-sm font-medium"
              :class="getStatusColor(peminjamanStore.detail.status)"
            >
              {{ formatStatus(peminjamanStore.detail.status) }}
            </span>
          </div>

          <div class="border-t border-muted/10 pt-6">
            <dl class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm text-muted">Peminjam</dt>
                  <dd class="text-sm font-medium text-text">
                    {{ peminjamanStore.detail.user?.name || '-' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">NIS</dt>
                  <dd class="text-sm font-medium text-text">
                    {{ peminjamanStore.detail.user?.nik || '-' }}
                  </dd>
                </div>
              </div>
              <div>
                <dt class="text-sm text-muted">Alat</dt>
                <dd class="text-sm font-medium text-text">
                  {{ peminjamanStore.detail.alat?.nama_alat || '-' }}
                </dd>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm text-muted">Jumlah</dt>
                  <dd class="text-sm font-medium text-text">{{ peminjamanStore.detail.jumlah }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Status</dt>
                  <dd class="text-sm font-medium text-text">{{ formatStatus(peminjamanStore.detail.status) }}</dd>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm text-muted">Tanggal Pinjam</dt>
                  <dd class="text-sm font-medium text-text">
                    {{ formatDate(peminjamanStore.detail.tanggal_pinjam) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Tanggal Kembali</dt>
                  <dd class="text-sm font-medium text-text">
                    {{ formatDate(peminjamanStore.detail.tanggal_kembali) }}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
