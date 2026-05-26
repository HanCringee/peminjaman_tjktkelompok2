<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePeminjamanStore } from '@/stores/peminjaman'
import { showSuccess, showError, showLoading, closeSwal } from '@/utils/notify'
import PeminjamanForm from '@/components/forms/PeminjamanForm.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const peminjamanStore = usePeminjamanStore()

const selectedAlatId = ref(route.query.alat_id ? Number(route.query.alat_id) : null)
const isSubmitting = ref(false)

async function handleSubmit(data) {
  isSubmitting.value = true
  showLoading('Mengajukan peminjaman...')

  try {
    const payload = {
      ...data,
      user_id: authStore.user.id,
      status: 'pending',
    }
    await peminjamanStore.createPeminjaman(payload)
    closeSwal()
    showSuccess('Peminjaman berhasil diajukan!')
    router.push('/peminjaman')
  } catch (err) {
    closeSwal()
    const responseData = err.response?.data
    if (responseData && typeof responseData === 'object') {
      const firstError = Object.values(responseData).flat()[0]
      showError(firstError || 'Gagal membuat peminjaman')
    } else {
      showError('Gagal membuat peminjaman')
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
        <h1 class="text-2xl font-bold text-text mb-6">Ajukan Peminjaman</h1>
        <PeminjamanForm
          :selectedAlatId="selectedAlatId"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>
