<script setup>
defineProps({
  message: { type: String, default: 'Memuat data...' },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div
      class="inline-block w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"
    ></div>
    <p class="mt-4 text-muted text-sm">{{ message }}</p>
  </div>
</template>
