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

// Check recent attendance by phone number
export const checkRecentAttendance = (phone) =>
  API.post('/employees/check-recent', { phone }, getAuthHeader());

// Finalize attendance with multipart/form-data (e.g., file uploads)
export const finalizeAttendance = (formData) => {
  const authHeader = getAuthHeader();
  return API.post('/employees/attendance/finalize', formData, {
    headers: {
      ...authHeader.headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};