<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePeminjamanStore } from '@/stores/peminjaman'
import { showSuccess, showError } from '@/utils/notify'
import { formatDate, formatStatus, getStatusColor } from '@/utils/helpers'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/modals/ConfirmDialog.vue'

const peminjamanStore = usePeminjamanStore()
const router = useRouter()

const searchQuery = ref('')
const filterStatus = ref('')
const isLoading = ref(true)
const deleteTarget = ref(null)
const approveTarget = ref(null)
const selesaiTarget = ref(null)

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
  router.push(`/admin/peminjaman/${id}`)
}

function confirmApprove(p) {
  approveTarget.value = p
}

function confirmSelesai(p) {
  selesaiTarget.value = p
}

function confirmDelete(p) {
  deleteTarget.value = p
}

async function handleApprove() {
  if (!approveTarget.value) return
  try {
    await peminjamanStore.approvePeminjaman(approveTarget.value.peminjaman_id)
    showSuccess('Peminjaman berhasil disetujui')
  } catch {
    showError('Gagal approve peminjaman')
  } finally {
    approveTarget.value = null
  }
}

async function handleSelesai() {
  if (!selesaiTarget.value) return
  try {
    await peminjamanStore.selesaiPeminjaman(selesaiTarget.value.peminjaman_id)
    showSuccess('Peminjaman selesai')
  } catch {
    showError('Gagal menyelesaikan peminjaman')
  } finally {
    selesaiTarget.value = null
  }
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
  <div class="bg-background py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-bold text-text mb-6">Manajemen Peminjaman</h1>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari peminjam atau alat..."
        class="flex-1 px-4 py-2.5 bg-background border border-muted/20 rounded-lg text-sm text-text placeholder-muted focus:ring-2 focus:ring-accent outline-none"
      />
      <select
        v-model="filterStatus"
        class="px-4 py-2.5 bg-background border border-muted/20 rounded-lg text-sm text-text focus:ring-2 focus:ring-accent outline-none"
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
      description="Belum ada peminjaman yang diajukan."
    />

    <div v-else class="bg-surface rounded-xl border border-muted/10 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-primary/50">
            <tr>
              <th class="text-left px-6 py-3 font-medium text-muted">Peminjam</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Alat</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Jumlah</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Tgl Pinjam</th>
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
              <td class="px-6 py-4 font-medium text-text">{{ p.user?.name || '-' }}</td>
              <td class="px-6 py-4 text-muted">{{ p.alat?.nama_alat || '-' }}</td>
              <td class="px-6 py-4 text-muted">{{ p.jumlah }}</td>
              <td class="px-6 py-4 text-muted">{{ formatDate(p.tanggal_pinjam) }}</td>
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
                    v-if="p.status === 'pending'"
                    @click="confirmApprove(p)"
                    class="bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-secondary transition"
                  >
                    Approve
                  </button>
                  <button
                    v-if="p.status === 'approved'"
                    @click="confirmSelesai(p)"
                    class="bg-secondary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-80 transition"
                  >
                    Selesai
                  </button>
                  <button
                    v-if="p.status === 'pending'"
                    @click="confirmDelete(p)"
                    class="bg-danger text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-80 transition"
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
      :visible="!!approveTarget"
      title="Approve Peminjaman"
      :message="`Setujui peminjaman ${approveTarget?.alat?.nama_alat || ''} oleh ${approveTarget?.user?.name || ''}?`"
      confirm-text="Approve"
      @confirm="handleApprove"
      @cancel="approveTarget = null"
    />
    <ConfirmDialog
      :visible="!!selesaiTarget"
      title="Selesaikan Peminjaman"
      :message="`Tandai peminjaman ${selesaiTarget?.alat?.nama_alat || ''} sebagai selesai?`"
      confirm-text="Selesai"
      @confirm="handleSelesai"
      @cancel="selesaiTarget = null"
    />
    <ConfirmDialog
      :visible="!!deleteTarget"
      title="Hapus Peminjaman"
      :message="`Yakin ingin menghapus peminjaman ${deleteTarget?.alat?.nama_alat || ''}?`"
      @confirm="handleDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
