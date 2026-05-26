<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAlatStore } from '@/stores/alat'
import { showSuccess, showError } from '@/utils/notify'
import { getKondisiColor, getStokBadge } from '@/utils/helpers'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/modals/ConfirmDialog.vue'

const alatStore = useAlatStore()
const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('')
const isLoading = ref(true)
const deleteTarget = ref(null)

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

function goToEdit(id) {
  router.push(`/admin/alat/${id}/edit`)
}

function confirmDelete(alat) {
  deleteTarget.value = alat
}

async function handleDelete() {
  if (!deleteTarget.value) return
  try {
    await alatStore.deleteAlat(deleteTarget.value.alat_id)
    showSuccess('Alat berhasil dihapus')
  } catch {
    showError('Gagal menghapus alat')
  } finally {
    deleteTarget.value = null
  }
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
  <div class="bg-background py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-bold text-text">Manajemen Alat</h1>
      <router-link
        to="/admin/alat/create"
        class="mt-3 sm:mt-0 inline-flex items-center bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition"
      >
        + Tambah Alat
      </router-link>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari alat..."
        class="flex-1 px-4 py-2.5 bg-background border border-muted/20 rounded-lg text-sm text-text placeholder-muted focus:ring-2 focus:ring-accent outline-none"
      />
      <select
        v-model="selectedCategory"
        class="px-4 py-2.5 bg-background border border-muted/20 rounded-lg text-sm text-text focus:ring-2 focus:ring-accent outline-none"
      >
        <option value="">Semua Kategori</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <LoadingSpinner v-if="isLoading" />

    <EmptyState
      v-else-if="filteredAlat.length === 0"
      title="Tidak ada alat"
      description="Belum ada alat yang terdaftar."
    />

    <div v-else class="bg-surface rounded-xl border border-muted/10 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-primary/50">
            <tr>
              <th class="text-left px-6 py-3 font-medium text-muted">Nama Alat</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Kategori</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Stok</th>
              <th class="text-left px-6 py-3 font-medium text-muted">Kondisi</th>
              <th class="text-right px-6 py-3 font-medium text-muted">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-muted/10">
            <tr v-for="a in filteredAlat" :key="a.alat_id" class="hover:bg-primary/30">
              <td class="px-6 py-4 font-medium text-text">{{ a.nama_alat }}</td>
              <td class="px-6 py-4 text-muted">{{ a.kategori }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getStokBadge(a.stok).class"
                >
                  {{ a.stok }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getKondisiColor(a.kondisi)"
                >
                  {{ a.kondisi }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    @click="goToEdit(a.alat_id)"
                    class="text-accent hover:text-muted text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(a)"
                    class="text-danger hover:text-red-400 text-sm font-medium"
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
      title="Hapus Alat"
      :message="`Yakin ingin menghapus ${deleteTarget?.nama_alat || ''}?`"
      @confirm="handleDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
