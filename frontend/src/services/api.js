import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardSummary = () => API.get('/auxiliar/dashboard-summary');
export const getCitasAuxiliar = (params) => API.get('/auxiliar/citas', { params });
export const getCitaAuxiliar = (id) => API.get(`/auxiliar/citas/${id}`);
export const updateCitaAuxiliar = (id, data) => API.patch(`/auxiliar/citas/${id}`, data);
export const getClientes = () => API.get('/clientes');
export const getCliente = (id) => API.get(`/clientes/${id}`);
export const updateCliente = (id, data) => API.patch(`/clientes/${id}`, data);
export const getProcedimientos = () => API.get('/procedimientos');
export const getProcedimiento = (id) => API.get(`/procedimientos/${id}`);
export const updateProcedimiento = (id, data) => API.patch(`/procedimientos/${id}`, data);
export const getHorarioAuxiliar = (params) => API.get('/auxiliar/horario', { params });
export const getHorarios = (params) => API.get('/horarios', { params });
export const getHorario = (id) => API.get(`/horarios/${id}`);
export const updateHorario = (id, data) => API.patch(`/horarios/${id}`, data);

export default API;