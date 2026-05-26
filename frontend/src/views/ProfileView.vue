<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ProfileForm from '@/components/forms/ProfileForm.vue'
import { getAvatarUrl, getInitials, getAvatarBg } from '@/utils/helpers'

const authStore = useAuthStore()
const isEditing = ref(false)

const avatarUrl = getAvatarUrl(authStore.user)
const initials = getInitials(authStore.user?.name)
const bgGradient = getAvatarBg(authStore.user?.name)
</script>

<template>
  <div class="py-8 px-4 sm:px-6 lg:px-8 bg-background">
    <div class="max-w-lg mx-auto">

      <template v-if="!isEditing">
        <div class="bg-surface rounded-2xl border border-muted/10 overflow-hidden shadow-lg">
          <div class="h-32 bg-gradient-to-r from-primary via-secondary to-accent/40 relative">
            <div class="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div class="w-24 h-24 rounded-full border-4 border-surface overflow-hidden shadow-xl">
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  alt="avatar"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br flex items-center justify-center"
                  :class="bgGradient"
                >
                  <span class="text-white text-2xl font-bold">{{ initials }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-16 pb-8 px-8 text-center">
            <h2 class="text-xl font-bold text-text">{{ authStore.user?.name }}</h2>
            <p class="text-sm text-muted/70 mt-1">{{ authStore.user?.email }}</p>

            <div class="flex justify-center gap-6 mt-6">
              <div class="text-center">
                <p class="text-xs text-muted/50 uppercase tracking-wider">NIS</p>
                <p class="text-sm text-text font-medium mt-1">{{ authStore.user?.nik }}</p>
              </div>
              <div class="w-px bg-muted/20"></div>
              <div class="text-center">
                <p class="text-xs text-muted/50 uppercase tracking-wider">Role</p>
                <p class="text-sm text-text font-medium capitalize mt-1">{{ authStore.user?.role }}</p>
              </div>
            </div>

            <button
              @click="isEditing = true"
              class="mt-8 w-full bg-accent text-white py-2.5 rounded-xl text-sm font-medium hover:bg-accent/80 transition"
            >
              Edit Profil
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-text">Edit Profil</h1>
          <button
            @click="isEditing = false"
            class="text-sm text-muted hover:text-text transition"
          >
            Batal
          </button>
        </div>

        <div class="bg-surface rounded-2xl border border-muted/10 p-8 shadow-lg">
          <ProfileForm @after-submit="isEditing = false" />
        </div>
      </template>

    </div>
  </div>
</template>
