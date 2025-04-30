import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Membuat instance axios dengan baseURL API Anda
const api = axios.create({
  baseURL: 'http://localhost:9100/api',
  withCredentials: true, // Mengaktifkan pengiriman cookie
})

// Request interceptor: tidak perlu menyertakan token karena sudah ada di cookie
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// ==== Tambahan: mencegah multiple refresh request ====
// let isRefreshing = false
// let failedQueue = []

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((promise) => {
//     if (error) {
//       promise.reject(error)
//     } else {
//       promise.resolve(token)
//     }
//   })
//   failedQueue = []
// }

// Response interceptor: menangani error, misalnya token expired (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Jika 401 (unauthorized) dan belum pernah dicoba refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Panggil endpoint refresh token
        await axios.post('http://localhost:9100/api/refresh-token', {}, { withCredentials: true })

        // Ulangi request asli setelah token diperbarui
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token gagal:', refreshError)

        // Jika refresh gagal, arahkan ke login
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
