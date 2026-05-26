import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api-client'

export const useAlatStore = defineStore('alat', () => {
  const list = ref([])
  const detail = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchAlat() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/alat')
      list.value = response.data.data || response.data
      return list.value
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal memuat data alat' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAlatById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/alat/${id}`)
      detail.value = response.data.data || response.data
      return detail.value
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal memuat detail alat' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createAlat(data) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/alat', data)
      list.value.push(response.data.data || response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal menambah alat' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAlat(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/alat/${id}`, data)
      const idx = list.value.findIndex((a) => a.alat_id === id)
      if (idx !== -1) list.value[idx] = response.data.data || response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal mengupdate alat' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteAlat(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`/alat/${id}`)
      list.value = list.value.filter((a) => a.alat_id !== id)
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal menghapus alat' }
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    list,
    detail,
    loading,
    error,
    fetchAlat,
    fetchAlatById,
    createAlat,
    updateAlat,
    deleteAlat,
  }
})
