<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/api-client'
import AvatarUploader from '@/components/common/AvatarUploader.vue'
import { showSuccess, showError, showLoading, closeSwal } from '@/utils/notify'

const emit = defineEmits(['afterSubmit'])

const authStore = useAuthStore()

const form = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  password: '',
  password_confirmation: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
})

const avatarFile = ref(null)
const isLoading = ref(false)

function validate() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  let valid = true

  if (!form.name || form.name.length < 3) {
    errors.name = 'Nama minimal 3 karakter'
    valid = false
  }
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email tidak valid'
    valid = false
  }
  if (form.password && form.password.length < 8) {
    errors.password = 'Password minimal 8 karakter'
    valid = false
  }
  if (form.password && form.password !== form.password_confirmation) {
    errors.password = 'Password tidak cocok'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validate()) return

  isLoading.value = true
  showLoading('Menyimpan perubahan...')

  try {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('email', form.email)
    if (form.password) {
      fd.append('password', form.password)
      fd.append('password_confirmation', form.password_confirmation)
    }
    if (avatarFile.value instanceof File) {
      fd.append('avatar', avatarFile.value)
    }

    const res = await api.post('/profile', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    const updatedUser = res.data.user || res.data.data
    if (updatedUser) {
      authStore.user.name = updatedUser.name
      authStore.user.email = updatedUser.email
      if (updatedUser.avatar_url) {
        authStore.user.avatar_url = updatedUser.avatar_url
      }
      localStorage.setItem('auth_user', JSON.stringify(authStore.user))
    }

    closeSwal()
    showSuccess('Profil berhasil diperbarui')
    emit('afterSubmit')
  } catch (err) {
    closeSwal()
    const data = err.response?.data
    if (data) {
      Object.keys(data).forEach((key) => {
        if (errors[key] !== undefined) {
          errors[key] = Array.isArray(data[key]) ? data[key][0] : data[key]
        }
      })
    }
    showError('Gagal update profil. Cek kembali data Anda.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <AvatarUploader
      v-model="avatarFile"
      :currentAvatar="authStore.user?.avatar_url"
      :userName="authStore.user?.name"
    />

    <div>
      <label class="block text-sm font-medium text-muted mb-1">Nama Lengkap</label>
      <input
        v-model="form.name"
        type="text"
        class="w-full px-4 py-2.5 bg-background border rounded-lg text-sm text-text focus:ring-2 focus:ring-accent outline-none transition"
        :class="errors.name ? 'border-danger' : 'border-muted/20'"
      />
      <p v-if="errors.name" class="text-danger text-xs mt-1">{{ errors.name }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-muted mb-1">Email</label>
      <input
        v-model="form.email"
        type="email"
        class="w-full px-4 py-2.5 bg-background border rounded-lg text-sm text-text focus:ring-2 focus:ring-accent outline-none transition"
        :class="errors.email ? 'border-danger' : 'border-muted/20'"
      />
      <p v-if="errors.email" class="text-danger text-xs mt-1">{{ errors.email }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-muted mb-1">
        Password Baru <span class="text-muted/50">(opsional)</span>
      </label>
      <input
        v-model="form.password"
        type="password"
        class="w-full px-4 py-2.5 bg-background border rounded-lg text-sm text-text focus:ring-2 focus:ring-accent outline-none transition"
        :class="errors.password ? 'border-danger' : 'border-muted/20'"
        placeholder="Kosongkan jika tidak ingin ganti"
      />
    </div>

    <div v-if="form.password">
      <label class="block text-sm font-medium text-muted mb-1">Konfirmasi Password</label>
      <input
        v-model="form.password_confirmation"
        type="password"
        class="w-full px-4 py-2.5 bg-background border rounded-lg text-sm text-text focus:ring-2 focus:ring-accent outline-none transition"
        :class="form.password !== form.password_confirmation && form.password_confirmation ? 'border-danger' : 'border-muted/20'"
        placeholder="Ulangi password baru"
      />
      <p v-if="errors.password" class="text-danger text-xs mt-1">{{ errors.password }}</p>
    </div>

    <button
      type="submit"
      :disabled="isLoading"
      class="w-full bg-accent text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
    </button>
  </form>
</template>
