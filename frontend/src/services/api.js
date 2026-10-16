import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para enviar el token JWT automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Métodos del Panel Auxiliar
export const getDashboardSummary = () => API.get('/auxiliar/dashboard-summary');
export const getCitasAuxiliar = (params) => API.get('/auxiliar/citas', { params });
export const getClienteById = (clienteId) => API.get(`/clientes/${clienteId}`);
export const getHorarioAuxiliar = () => API.get('/auxiliar/horario');

export default API;