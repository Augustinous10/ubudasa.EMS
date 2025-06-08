import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Token headers for all dashboard requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Fetch employees
export const fetchEmployees = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/employees`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch employees' };
  }
};

// Fetch attendance records
export const fetchAttendance = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/attendance`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch attendance' };
  }
};

// Fetch site managers (page & limit params optional)
export const fetchSiteManagers = async (page = 1, limit = 1000) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/admin/site-managers`, {
      headers: getAuthHeaders(),
      params: { page, limit },
    });
    return res.data.siteManagers || res.data; // Adjust based on backend response
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch site managers' };
  }
};

// Fetch sites
export const fetchSites = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/sites`, {
      headers: getAuthHeaders(),
    });
    // Return sites array from response data or empty array if not present
    return res.data?.data || [];
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch sites' };
  }
};
