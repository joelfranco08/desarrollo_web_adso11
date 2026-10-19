import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardSummary = () => API.get('/auxiliar/dashboard-summary');
export const getCitasAuxiliar = () => API.get('/auxiliar/citas');
export const getHorarioAuxiliar = () => API.get('/auxiliar/horario');

export default API;