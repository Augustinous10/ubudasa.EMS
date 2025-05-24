import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const createReport = (data) => API.post('/reports', data, getAuthHeader());
export const getAllReports = () => API.get('/reports', getAuthHeader());
export const getReportsByFilter = (params) =>
  API.get('/reports/filter', { ...getAuthHeader(), params });
