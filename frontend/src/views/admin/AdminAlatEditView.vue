<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlatStore } from '@/stores/alat'
import { showSuccess, showError } from '@/utils/notify'
import AlatForm from '@/components/forms/AlatForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const alatStore = useAlatStore()

const isLoading = ref(true)
const alat = ref(null)

onMounted(async () => {
  try {
    await alatStore.fetchAlatById(route.params.id)
    alat.value = alatStore.detail
  } catch {
    showError('Gagal memuat data alat')
    router.push('/admin/alat')
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit(data) {
  try {
    await alatStore.updateAlat(route.params.id, data)
    showSuccess('Alat berhasil diupdate')
    router.push('/admin/alat')
  } catch (err) {
    const responseData = err.response?.data
    if (responseData && typeof responseData === 'object') {
      const firstError = Object.values(responseData).flat()[0]
      showError(firstError || 'Gagal mengupdate alat')
    } else {
      showError('Gagal mengupdate alat')
    }
  }
}

function handleCancel() {
  router.push('/admin/alat')
}
</script>

<template>
  <div class="bg-background py-8 px-4 sm:px-6 lg:px-8">
    <LoadingSpinner v-if="isLoading" />

    <template v-else-if="alat">
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
          <h1 class="text-2xl font-bold text-text mb-6">Edit Alat</h1>
          <AlatForm
            :initialData="alat"
            :isEditing="true"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </template>
  </div>
</template>
