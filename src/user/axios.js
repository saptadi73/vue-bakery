import axios from 'axios'
import router from '../router'
import { BASE_URL } from '../base.utils.url.ts'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Automatically add access_token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('Token in axios interceptor:', token) // Debugging line
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors and redirect to login (tanpa refresh token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 0)
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

export default api
