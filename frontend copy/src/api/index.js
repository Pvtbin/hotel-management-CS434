import api from './client.js';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/me/password', data),
};

export const roomApi = {
  list: (params) => api.get('/rooms', { params }),
  get: (id) => api.get(`/rooms/${id}`),
  getReviews: (id) => api.get(`/rooms/${id}/reviews`),
  getTypes: () => api.get('/rooms/types'),
  checkAvailability: (params) => api.get('/rooms/availability', { params }),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

export const bookingApi = {
  create: (data) => api.post('/bookings', data),
  myBookings: () => api.get('/bookings/my'),
  get: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  all: (params) => api.get('/bookings', { params }),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  checkIn: (id) => api.put(`/bookings/${id}/check-in`),
  checkOut: (id) => api.put(`/bookings/${id}/check-out`),
  revenue: (params) => api.get('/bookings/stats/revenue', { params }),
};

export const paymentApi = {
  pay: (data) => api.post('/payments', data),
  get: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  all: () => api.get('/payments'),
  refund: (id) => api.put(`/payments/${id}/refund`),
};

export const reviewApi = {
  create: (data) => api.post('/reviews', data),
  my: () => api.get('/reviews/my'),
  all: () => api.get('/reviews'),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const serviceApi = {
  list: (params) => api.get('/services', { params }),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const userApi = {
  list: (params) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  toggleActive: (id) => api.put(`/users/${id}/toggle-active`),
};

export const supportApi = {
  create: (data) => api.post('/support', data),
  my: () => api.get('/support/my'),
  all: (params) => api.get('/support', { params }),
  update: (id, data) => api.put(`/support/${id}`, data),
  assign: (id) => api.put(`/support/${id}/assign`),
};

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  reports: (params) => api.get('/admin/reports', { params }),
};
