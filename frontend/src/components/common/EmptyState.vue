<script setup>
defineProps({
  title: { type: String, default: 'Tidak ada data' },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="text-center py-12 px-6 bg-surface rounded-lg">
    <svg
      class="mx-auto h-12 w-12 text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-text">{{ title }}</h3>
    <p v-if="description" class="mt-1 text-sm text-muted">{{ description }}</p>
  </div>
</template>
