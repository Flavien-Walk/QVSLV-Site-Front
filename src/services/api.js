import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qvslv_token') || sessionStorage.getItem('qvslv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('qvslv_token')
      localStorage.removeItem('qvslv_user')
      sessionStorage.removeItem('qvslv_token')
      sessionStorage.removeItem('qvslv_user')
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)
export const getMe = () => api.get('/auth/me')

// Content
export const getContent = (params) => api.get('/content', { params })
export const getContentById = (id) => api.get(`/content/${id}`)

// Messages (shoutbox)
export const getMessages = () => api.get('/messages')
export const postMessage = (text) => api.post('/messages', { text })

export default api
