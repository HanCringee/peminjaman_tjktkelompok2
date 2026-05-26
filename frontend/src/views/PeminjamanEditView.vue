<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePeminjamanStore } from '@/stores/peminjaman'
import { showSuccess, showError, showWarning } from '@/utils/notify'
import PeminjamanForm from '@/components/forms/PeminjamanForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const peminjamanStore = usePeminjamanStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const peminjaman = ref(null)

onMounted(async () => {
  try {
    await peminjamanStore.fetchPeminjamanById(route.params.id)
    peminjaman.value = peminjamanStore.detail
    if (peminjaman.value && peminjaman.value.status !== 'pending') {
      showWarning('Peminjaman dengan status ini tidak dapat diedit')
      router.push(`/peminjaman/${route.params.id}`)
    }
  } catch {
    showError('Gagal memuat data peminjaman')
    router.push('/peminjaman')
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit(data) {
  isSubmitting.value = true
  try {
    await peminjamanStore.updatePeminjaman(route.params.id, data)
    showSuccess('Peminjaman berhasil diupdate')
    router.push(`/peminjaman/${route.params.id}`)
  } catch (err) {
    const responseData = err.response?.data
    if (responseData && typeof responseData === 'object') {
      const firstError = Object.values(responseData).flat()[0]
      showError(firstError || 'Gagal mengupdate peminjaman')
    } else {
      showError('Gagal mengupdate peminjaman')
    }
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  router.back()
}
</script>

<template>
  <div class="py-8 px-4 sm:px-6 lg:px-8 bg-background">
    <LoadingSpinner v-if="isLoading" />

    <template v-else-if="peminjaman">
      <div class="max-w-2xl mx-auto">
        <button
          @click="handleCancel"
          class="flex items-center text-sm text-accent hover:text-accent/80 mb-6"
        >
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>

        <div class="bg-surface rounded-xl border border-muted/10 p-8">
          <h1 class="text-2xl font-bold text-text mb-6">Edit Peminjaman</h1>
          <PeminjamanForm
            :initialData="peminjaman"
            :isEditing="true"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </template>
  </div>
</template>
