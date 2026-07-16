import api from './axios'

const unwrap = (res) => res.data.data

export const authApi = {
  register: (data) => api.post('/auth/register', data).then(unwrap),
  login: (data) => api.post('/auth/login', data).then(unwrap),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me').then(unwrap)
}

export const productApi = {
  getAll: (params) => api.get('/products', { params }).then(unwrap),
  getById: (id) => api.get(`/products/${id}`).then(unwrap),
  search: (params) => api.get('/products/search', { params }).then(unwrap),
  filter: (params) => api.get('/products/filter', { params }).then(unwrap),
  create: (data) => api.post('/products', data).then(unwrap),
  update: (id, data) => api.put(`/products/${id}`, data).then(unwrap),
  delete: (id) => api.delete(`/products/${id}`)
}

export const categoryApi = {
  getAll: () => api.get('/categories').then(unwrap),
  getById: (id) => api.get(`/categories/${id}`).then(unwrap),
  create: (data) => api.post('/categories', data).then(unwrap),
  update: (id, data) => api.put(`/categories/${id}`, data).then(unwrap),
  delete: (id) => api.delete(`/categories/${id}`)
}

export const cartApi = {
  get: () => api.get('/cart').then(unwrap),
  add: (data) => api.post('/cart', data).then(unwrap),
  update: (id, quantity) => api.put(`/cart/${id}`, null, { params: { quantity } }).then(unwrap),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart')
}

export const orderApi = {
  checkout: (data) => api.post('/orders/checkout', data).then(unwrap),
  getMyOrders: (params) => api.get('/orders', { params }).then(unwrap),
  getById: (id) => api.get(`/orders/${id}`).then(unwrap),
  track: (orderNumber) => api.get(`/orders/track/${orderNumber}`).then(unwrap),
  cancel: (id) => api.put(`/orders/${id}/cancel`).then(unwrap),
  downloadInvoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
  getAllAdmin: (params) => api.get('/orders/admin/all', { params }).then(unwrap),
  updateStatus: (id, status) => api.put(`/orders/admin/${id}/status`, null, { params: { status } }).then(unwrap)
}

export const wishlistApi = {
  get: () => api.get('/wishlist').then(unwrap),
  add: (productId) => api.post(`/wishlist/${productId}`).then(unwrap),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  moveToCart: (productId) => api.post(`/wishlist/${productId}/move-to-cart`).then(unwrap)
}

export const reviewApi = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`).then(unwrap),
  getMine: (productId) => api.get(`/reviews/product/${productId}/mine`).then(unwrap),
  create: (data) => api.post('/reviews', data).then(unwrap),
  update: (id, data) => api.put(`/reviews/${id}`, data).then(unwrap),
  delete: (id) => api.delete(`/reviews/${id}`)
}

export const userApi = {
  getProfile: () => api.get('/users/profile').then(unwrap),
  updateProfile: (data) => api.put('/users/profile', data).then(unwrap),
  getAll: (params) => api.get('/users', { params }).then(unwrap),
  getById: (id) => api.get(`/users/${id}`).then(unwrap),
  update: (id, data) => api.put(`/users/${id}`, data).then(unwrap),
  toggleStatus: (id) => api.patch(`/users/${id}/status`).then(unwrap),
  delete: (id) => api.delete(`/users/${id}`)
}

export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard').then(unwrap)
}

export const recommendationApi = {
  mostPurchased: () => api.get('/recommendations/most-purchased').then(unwrap),
  trending: () => api.get('/recommendations/trending').then(unwrap),
  similar: (productId) => api.get(`/recommendations/similar/${productId}`).then(unwrap),
  recentlyViewed: () => api.get('/recommendations/recently-viewed').then(unwrap),
  recordView: (productId) => api.post(`/recommendations/view/${productId}`)
}
