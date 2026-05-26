<script setup>
import { useRouter } from 'vue-router'
import { useAlatStore } from '@/stores/alat'
import { showSuccess, showError } from '@/utils/notify'
import AlatForm from '@/components/forms/AlatForm.vue'

const router = useRouter()
const alatStore = useAlatStore()

async function handleSubmit(data) {
  try {
    await alatStore.createAlat(data)
    showSuccess('Alat berhasil ditambahkan')
    router.push('/admin/alat')
  } catch (err) {
    const responseData = err.response?.data
    if (responseData && typeof responseData === 'object') {
      const firstError = Object.values(responseData).flat()[0]
      showError(firstError || 'Gagal menambah alat')
    } else {
      showError('Gagal menambah alat')
    }
  }
}

function handleCancel() {
  router.push('/admin/alat')
}
</script>

<template>
  <div class="bg-background py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <button
        @click="handleCancel"
        class="flex items-center text-sm text-muted hover:text-text mb-6"
      >
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <div class="bg-surface rounded-xl border border-muted/10 p-8">
        <h1 class="text-2xl font-bold text-text mb-6">Tambah Alat Baru</h1>
        <AlatForm @submit="handleSubmit" @cancel="handleCancel" />
      </div>
    </div>
  </div>
</template>
