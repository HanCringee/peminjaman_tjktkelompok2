<script setup>
import { ref, computed, watch } from 'vue'
import { getAvatarUrl, getInitials, getAvatarBg } from '@/utils/helpers'

const props = defineProps({
  modelValue: { type: [File, String], default: null },
  currentAvatar: { type: String, default: '' },
  userName: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const localFile = ref(null)

const previewUrl = computed(() => {
  if (localFile.value) return localFile.value
  const url = getAvatarUrl({ avatar_url: props.currentAvatar })
  if (url) return url
  return null
})

const hasAvatar = computed(() => !!previewUrl.value)

watch(
  () => props.currentAvatar,
  () => {
    if (!(props.modelValue instanceof File)) {
      localFile.value = null
    }
  },
)

const initials = computed(() => {
  if (hasAvatar.value) return ''
  return getInitials(props.userName || 'User')
})

const bgGradient = computed(() => getAvatarBg(props.userName))

const inputRef = ref(null)

function triggerUpload() {
  inputRef.value?.click()
}

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    return
  }

  emit('update:modelValue', file)
  const reader = new FileReader()
  reader.onload = (ev) => {
    localFile.value = ev.target?.result || null
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="relative group cursor-pointer" @click="triggerUpload">
      <div
        class="w-24 h-24 rounded-full border-2 border-muted/30 overflow-hidden bg-primary flex items-center justify-center shadow-lg"
      >
        <img
          v-if="hasAvatar"
          :src="previewUrl"
          alt="avatar"
          class="w-full h-full object-cover"
          @error="localFile = null"
        />
        <div
          v-else
          class="w-full h-full bg-gradient-to-br flex items-center justify-center"
          :class="bgGradient"
        >
          <span class="text-white text-xl font-bold tracking-wide">
            {{ initials }}
          </span>
        </div>
      </div>
      <div
        class="absolute inset-0 w-24 h-24 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
      >
        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    </div>
    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/jpg"
      class="hidden"
      @change="handleFileChange"
    />
    <button
      type="button"
      @click="triggerUpload"
      class="text-sm text-accent hover:text-muted transition"
    >
      Upload Foto
    </button>
    <p class="text-xs text-muted/60">Format JPG/PNG, maks 2MB</p>
  </div>
</template>
