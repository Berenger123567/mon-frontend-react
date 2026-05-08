import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://imani-backend-2s5k.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('imani_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ===== AUTH =====
export const authAPI = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  verify: () =>
    api.get('/api/auth/verify'),
  changePassword: (currentPassword, newPassword) =>
    api.post('/api/auth/change-password', { currentPassword, newPassword }),
  updateEmail: (email) =>
    api.post('/api/auth/update-email', { email }),
}

// ===== ORDERS =====
export const ordersAPI = {
  getAll: (filters = {}) =>
    api.get('/api/orders', { params: filters }),
  getById: (id) =>
    api.get(`/api/orders/${id}`),
  create: (data) =>
    api.post('/api/orders', data),
  updateStatus: (id, status) =>
    api.patch(`/api/orders/${id}/status`, { status }),
  reply: (id, data) => {
    const formData = new FormData()
    formData.append('message', data.message)
    if (data.file) formData.append('pdf', data.file)
    return api.post(`/api/orders/${id}/reply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ===== STATS =====
export const statsAPI = {
  getDashboard: () =>
    api.get('/api/stats'),
}

export default api
