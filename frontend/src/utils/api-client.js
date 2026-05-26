import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const publicEndpoints = ['/login', '/register']

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || ''
    const isPublic = publicEndpoints.some((ep) => url.includes(ep))
    if (error.response?.status === 401 && !isPublic) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
