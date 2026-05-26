<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showSuccess, showError } from '@/utils/notify'
import { registerSchema } from '@/utils/validators'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  nik: '',
  name: '',
  email: '',
  password: '',
})

const errors = reactive({
  nik: '',
  name: '',
  email: '',
  password: '',
})

const isLoading = ref(false)

const passwordStrength = computed(() => {
  const pwd = form.password
  if (!pwd) return { level: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) return { level: 1, label: 'Lemah', color: 'bg-red-500' }
  if (score === 2) return { level: 2, label: 'Sedang', color: 'bg-yellow-500' }
  if (score === 3) return { level: 3, label: 'Kuat', color: 'bg-accent' }
  return { level: 4, label: 'Sangat Kuat', color: 'bg-green-600' }
})

async function handleRegister() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))

  const result = registerSchema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach((err) => {
      if (errors[err.path[0]] !== undefined) {
        errors[err.path[0]] = err.message
      }
    })
    return
  }

  isLoading.value = true
  try {
    await authStore.register(form)
    showSuccess('Register berhasil! Silakan login.')
    router.push('/login')
  } catch (err) {
    const data = err.response?.data
    if (data) {
      Object.keys(data).forEach((key) => {
        if (errors[key] !== undefined) {
          errors[key] = Array.isArray(data[key]) ? data[key][0] : data[key]
        }
      })
    }
    showError('Gagal mendaftar')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto w-full">
    <div class="bg-surface rounded-xl shadow-lg border border-muted/20 p-8">
      <h2 class="text-2xl font-bold text-text mb-6 text-center">Register</h2>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-muted mb-1">NIS</label>
          <input
            v-model="form.nik"
            type="text"
            class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            :class="errors.nik ? 'border-danger' : 'border-muted/20'"
            placeholder="Masukkan NIS"
          />
          <p v-if="errors.nik" class="text-danger text-xs mt-1">{{ errors.nik }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-muted mb-1">Nama Lengkap</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            :class="errors.name ? 'border-danger' : 'border-muted/20'"
            placeholder="Masukkan nama lengkap"
          />
          <p v-if="errors.name" class="text-danger text-xs mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-muted mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            :class="errors.email ? 'border-danger' : 'border-muted/20'"
            placeholder="contoh@email.com"
          />
          <p v-if="errors.email" class="text-danger text-xs mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-muted mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            :class="errors.password ? 'border-danger' : 'border-muted/20'"
            placeholder="Minimal 8 karakter"
          />
          <div v-if="form.password" class="mt-2">
            <div class="flex gap-1 mb-1">
              <div
                v-for="i in 4"
                :key="i"
                class="h-1.5 flex-1 rounded-full transition-all"
                :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-muted/20'"
              ></div>
            </div>
            <p class="text-xs text-muted">Kekuatan: {{ passwordStrength.label }}</p>
          </div>
          <p v-if="errors.password" class="text-danger text-xs mt-1">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-secondary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ isLoading ? 'Memproses...' : 'Register' }}
        </button>
      </form>

      <p class="text-center text-sm text-muted mt-6">
        Sudah punya akun?
        <router-link to="/login" class="text-accent hover:text-muted font-medium">
          Login di sini
        </router-link>
      </p>
    </div>
  </div>
</template>
