import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const signup = (data) => API.post('/api/auth/signup', data);
export const login = (data) => API.post('/api/auth/login', data);
export const getMe = () => API.get('/api/auth/me');

export const addEmployee = (data) => API.post('/api/employees', data);
export const getEmployees = () => API.get('/api/employees');
export const getEmployee = (id) => API.get(`/api/employees/${id}`);
export const searchEmployees = (params) => API.get('/api/employees/search', { params });
export const updateEmployee = (id, data) => API.put(`/api/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/api/employees/${id}`);

export const getAIRecommendation = (employees) =>
  API.post('/api/ai/recommend', { employees });

export default API;
