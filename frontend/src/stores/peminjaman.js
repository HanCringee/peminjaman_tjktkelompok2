import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api-client'

export const usePeminjamanStore = defineStore('peminjaman', () => {
  const list = ref([])
  const detail = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchPeminjaman() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/peminjaman')
      list.value = response.data.data || response.data
      return list.value
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal memuat data peminjaman' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPeminjamanById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/peminjaman/${id}`)
      detail.value = response.data.data || response.data
      return detail.value
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal memuat detail peminjaman' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPeminjaman(data) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/peminjaman', data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal membuat peminjaman' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePeminjaman(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/peminjaman/${id}`, data)
      const idx = list.value.findIndex((p) => p.peminjaman_id === id)
      if (idx !== -1) list.value[idx] = response.data.data || response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal mengupdate peminjaman' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePeminjaman(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`/peminjaman/${id}`)
      list.value = list.value.filter((p) => p.peminjaman_id !== id)
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal menghapus peminjaman' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approvePeminjaman(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/peminjaman/${id}/approve`)
      const idx = list.value.findIndex((p) => p.peminjaman_id === id)
      if (idx !== -1) list.value[idx].status = 'approved'
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal approve peminjaman' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function selesaiPeminjaman(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/peminjaman/${id}/selesai`)
      const idx = list.value.findIndex((p) => p.peminjaman_id === id)
      if (idx !== -1) list.value[idx].status = 'selesai'
      return response.data
    } catch (err) {
      error.value = err.response?.data || { message: 'Gagal menyelesaikan peminjaman' }
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
    fetchPeminjaman,
    fetchPeminjamanById,
    createPeminjaman,
    updatePeminjaman,
    deletePeminjaman,
    approvePeminjaman,
    selesaiPeminjaman,
  }
})
