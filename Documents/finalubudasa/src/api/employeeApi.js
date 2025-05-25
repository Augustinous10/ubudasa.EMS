// src/api/employeeApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const checkRecentAttendance = (phone) =>
  API.post('/employees/check-recent', { phone }, getAuthHeader());

export const finalizeAttendance = (formData) =>
  API.post('/employees/attendance/finalize', formData, {
    ...getAuthHeader(),
    headers: {
      ...getAuthHeader().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
