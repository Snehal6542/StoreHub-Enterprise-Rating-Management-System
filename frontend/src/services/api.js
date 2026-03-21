import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  updatePassword: (password) => api.put('/auth/password', { password }),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (filters) => api.get('/admin/users', { params: filters }),
  getStores: (filters) => api.get('/admin/stores', { params: filters }),
  getStoreOwners: () => api.get('/admin/store-owners'),
  addUser: (userData) => api.post('/admin/users', userData),
  addStore: (storeData) => api.post('/admin/stores', storeData),
};

export const storeAPI = {
  getStores: (filters) => api.get('/stores', { params: filters }),
  submitRating: (storeId, rating, review) => api.post(`/stores/${storeId}/rating`, { rating, review }),
  getStoreReviews: (storeId) => api.get(`/stores/${storeId}/reviews`),
};

export const storeOwnerAPI = {
  getDashboard: () => api.get('/store-owner/dashboard'),
  createStore: (storeData) => api.post('/store-owner/store', storeData),
};

export default api;