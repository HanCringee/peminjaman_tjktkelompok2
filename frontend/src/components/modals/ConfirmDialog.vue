<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Apakah Anda yakin?' },
  confirmText: { type: String, default: 'Ya' },
  cancelText: { type: String, default: 'Batal' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="fixed inset-0 bg-background/80" @click="emit('cancel')"></div>
    <div class="relative bg-surface rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
      <h3 class="text-lg font-semibold text-text mb-2">{{ title }}</h3>
      <p class="text-sm text-muted mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button
          @click="emit('cancel')"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-text bg-surface rounded-lg hover:bg-secondary border border-muted/20 disabled:opacity-50"
        >
          {{ cancelText }}
        </button>
        <button
          @click="emit('confirm')"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-text bg-secondary rounded-lg hover:bg-accent disabled:opacity-50"
        >
          {{ loading ? 'Memproses...' : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
