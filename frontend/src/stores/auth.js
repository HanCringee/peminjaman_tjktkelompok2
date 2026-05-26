import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api-client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const token = ref(localStorage.getItem('auth_token') || '')
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setAuth(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(newUser))
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  function clearAuth() {
    token.value = ''
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    delete api.defaults.headers.common['Authorization']
  }

  async function register(data) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/register', data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal mendaftar' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(nik, password) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/login', { nik, password })
      setAuth(response.data.token, response.data.user)
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Login gagal' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await api.post('/logout')
    } catch {
    } finally {
      clearAuth()
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    setAuth,
    clearAuth,
    register,
    login,
    logout,
  }
})
