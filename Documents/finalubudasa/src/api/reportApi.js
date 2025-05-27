// reportApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Function to get authorization headers
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  };
};

// Create a new report (POST)
export const createReport = async (data) => {
  const response = await API.post('/reports', data, getAuthHeader());
  return response.data;
};

// Get reports filtered by query params (GET)
export const getReportsByFilter = async (params) => {
  const response = await API.get('/reports/filter', {
    ...getAuthHeader(),
    params,
  });
  return response.data;
};
