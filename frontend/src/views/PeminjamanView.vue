<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePeminjamanStore } from '@/stores/peminjaman'
import { useAuthStore } from '@/stores/auth'
import { showSuccess, showError } from '@/utils/notify'
import { formatDate, formatStatus, getStatusColor } from '@/utils/helpers'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/modals/ConfirmDialog.vue'

const peminjamanStore = usePeminjamanStore()
const authStore = useAuthStore()
const router = useRouter()

const searchQuery = ref('')
const filterStatus = ref('')
const isLoading = ref(true)
const deleteTarget = ref(null)

const filteredList = computed(() => {
  return peminjamanStore.list.filter((p) => {
    const matchSearch =
      p.alat?.nama_alat?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.user?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = filterStatus.value ? p.status === filterStatus.value : true
    return matchSearch && matchStatus
  })
})

function goToDetail(id) {
  router.push(`/peminjaman/${id}`)
}

function goToEdit(id) {
  router.push(`/peminjaman/${id}/edit`)
}

function confirmDelete(p) {
  deleteTarget.value = p
}

async function handleDelete() {
  if (!deleteTarget.value) return
  try {
    await peminjamanStore.deletePeminjaman(deleteTarget.value.peminjaman_id)
    showSuccess('Peminjaman berhasil dihapus')
  } catch {
    showError('Gagal menghapus peminjaman')
  } finally {
    deleteTarget.value = null
  }
}

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
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-bold text-text">Peminjaman Saya</h1>
      <router-link
        v-if="!authStore.isAdmin"
        to="/peminjaman/create"
        class="mt-3 sm:mt-0 inline-flex items-center bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
      >
        + Pinjam Alat
      </router-link>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari alat atau peminjam..."
        class="flex-1 px-4 py-2.5 bg-surface border border-muted/10 rounded-lg text-sm text-text placeholder-muted focus:ring-2 focus:ring-accent outline-none"
      />
      <select
        v-model="filterStatus"
        class="px-4 py-2.5 bg-surface border border-muted/10 rounded-lg text-sm text-text focus:ring-2 focus:ring-accent outline-none"
      >
        <option value="">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Disetujui</option>
        <option value="selesai">Selesai</option>
        <option value="ditolak">Ditolak</option>
      </select>
    </div>

    <LoadingSpinner v-if="isLoading" />

    <EmptyState
      v-else-if="filteredList.length === 0"
      title="Tidak ada peminjaman"
      :description="authStore.isAdmin ? 'Belum ada peminjaman yang diajukan.' : 'Anda belum memiliki peminjaman. Mulai pinjam alat sekarang.'"
    >
      <template #action>
        <router-link
          v-if="!authStore.isAdmin"
          to="/peminjaman/create"
          class="inline-block bg-accent text-white px-4 py-2 rounded-lg text-sm"
        >
          Pinjam Alat
        </router-link>
      </template>
    </EmptyState>

    <div v-else class="bg-surface rounded-xl border border-muted/10 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-primary/50">
            <tr>
              <th class="text-left px-6 py-3 font-medium text-muted">Alat</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Jumlah</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Tgl Pinjam</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Tgl Kembali</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Status</th>
              <th class="text-right px-6 py-3 font-medium text-muted">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-muted/10">
            <tr
              v-for="p in filteredList"
              :key="p.peminjaman_id"
              class="hover:bg-primary/30 cursor-pointer"
              @click="goToDetail(p.peminjaman_id)"
            >
              <td class="px-6 py-4 font-medium text-text">
                {{ p.alat?.nama_alat || '-' }}
              </td>
              <td class="px-6 py-4 text-muted">{{ p.jumlah }}</td>
              <td class="px-6 py-4 text-muted">{{ formatDate(p.tanggal_pinjam) }}</td>
              <td class="px-6 py-4 text-muted">{{ formatDate(p.tanggal_kembali) }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getStatusColor(p.status)"
                >
                  {{ formatStatus(p.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right" @click.stop>
                <div class="flex justify-end gap-2">
                  <button
                    @click="goToEdit(p.peminjaman_id)"
                    v-if="p.status === 'pending'"
                    class="text-accent hover:text-accent/80 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(p)"
                    v-if="p.status === 'pending'"
                    class="text-danger hover:text-danger/80 text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmDialog
      :visible="!!deleteTarget"
      title="Hapus Peminjaman"
      :message="`Yakin ingin menghapus peminjaman ${deleteTarget?.alat?.nama_alat || ''}?`"
      @confirm="handleDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
