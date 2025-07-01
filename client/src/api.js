import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

const api = axios.create({
  baseURL: API_URL,
});

// Добавляем токен авторизации ко всем запросам
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (userName, password) =>
  api.post('/auth/login', { userName, password });

export const register = (userName, email, password) =>
  api.post('/auth/register', { userName, email, password });

export const getAllBirthdays = () => api.get('/person');
export const getTodayBirthdays = () => api.get('/person/today');
export const getUpcomingBirthdays = () => api.get('/person/upcoming');
export const getBirthday = (id) => api.get(`/person/${id}`);
export const addBirthday = (formData) => api.post('/person', formData);
export const updateBirthday = (id, formData) => api.put(`/person/${id}`, formData);
export const deleteBirthday = (id) => api.delete(`/person/${id}`); 