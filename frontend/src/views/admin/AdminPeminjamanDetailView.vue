<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePeminjamanStore } from '@/stores/peminjaman'
import { showSuccess, showError } from '@/utils/notify'
import { formatDate, formatStatus, getStatusColor } from '@/utils/helpers'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ConfirmDialog from '@/components/modals/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const peminjamanStore = usePeminjamanStore()

const isLoading = ref(true)
const approveTarget = ref(false)
const selesaiTarget = ref(false)

onMounted(async () => {
  try {
    await peminjamanStore.fetchPeminjamanById(route.params.id)
  } catch {
    showError('Gagal memuat detail peminjaman')
    router.push('/admin/peminjaman')
  } finally {
    isLoading.value = false
  }
})

async function handleApprove() {
  try {
    await peminjamanStore.approvePeminjaman(route.params.id)
    showSuccess('Peminjaman berhasil disetujui')
    approveTarget.value = false
    await peminjamanStore.fetchPeminjamanById(route.params.id)
  } catch {
    showError('Gagal approve peminjaman')
  }
}

async function handleSelesai() {
  try {
    await peminjamanStore.selesaiPeminjaman(route.params.id)
    showSuccess('Peminjaman selesai')
    selesaiTarget.value = false
    await peminjamanStore.fetchPeminjamanById(route.params.id)
  } catch {
    showError('Gagal menyelesaikan peminjaman')
  }
}
</script>

<template>
  <div class="bg-background py-8 px-4 sm:px-6 lg:px-8">
    <LoadingSpinner v-if="isLoading" />

    <template v-else-if="peminjamanStore.detail">
      <button
        @click="router.push('/admin/peminjaman')"
        class="flex items-center text-sm text-muted hover:text-text mb-6"
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
                <dt class="text-sm text-muted">Email</dt>
                <dd class="text-sm font-medium text-text">
                  {{ peminjamanStore.detail.user?.email || '-' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-muted">Alat</dt>
                <dd class="text-sm font-medium text-text">
                  {{ peminjamanStore.detail.alat?.nama_alat || '-' }}
                </dd>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm text-muted">Kategori Alat</dt>
                  <dd class="text-sm font-medium text-text">
                    {{ peminjamanStore.detail.alat?.kategori || '-' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Jumlah</dt>
                  <dd class="text-sm font-medium text-text">{{ peminjamanStore.detail.jumlah }}</dd>
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

          <div v-if="peminjamanStore.detail.status === 'pending'" class="mt-6 flex gap-3">
            <button
              @click="approveTarget = true"
              class="flex-1 bg-accent text-white py-3 rounded-lg text-sm font-medium hover:bg-secondary transition"
            >
              Approve Peminjaman
            </button>
          </div>
          <div v-else-if="peminjamanStore.detail.status === 'approved'" class="mt-6">
            <button
              @click="selesaiTarget = true"
              class="w-full bg-secondary text-white py-3 rounded-lg text-sm font-medium hover:opacity-80 transition"
            >
              Tandai Selesai
            </button>
          </div>
        </div>
      </div>
    </template>

    <ConfirmDialog
      :visible="approveTarget"
      title="Approve Peminjaman"
      :message="`Setujui peminjaman ini?`"
      confirm-text="Approve"
      @confirm="handleApprove"
      @cancel="approveTarget = false"
    />
    <ConfirmDialog
      :visible="selesaiTarget"
      title="Selesaikan Peminjaman"
      :message="`Tandai peminjaman sebagai selesai?`"
      confirm-text="Selesai"
      @confirm="handleSelesai"
      @cancel="selesaiTarget = false"
    />
  </div>
</template>
