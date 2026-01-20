import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (email: string, password: string, name?: string) =>
    apiClient.post('/auth/register', { email, password, name }),

  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  getMe: () => apiClient.get('/auth/me'),
};

export const uploadApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  list: () => apiClient.get('/uploads'),

  get: (id: string) => apiClient.get(`/uploads/${id}`),

  delete: (id: string) => apiClient.delete(`/uploads/${id}`),
};

export const insightsApi = {
  analyze: (uploadId: string) =>
    apiClient.post('/insights/analyze', { uploadId }),

  get: (uploadId: string) => apiClient.get(`/insights/${uploadId}`),

  status: () => apiClient.get('/insights/status'),
};
