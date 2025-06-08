import axios from 'axios';

// Base URL points to the backend API root (without /sites)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with base URL set to API root
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to each request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper to return consistent error objects
const handleError = (error, defaultMessage = 'An error occurred') => ({
  success: false,
  error: error.response?.data?.error || defaultMessage,
});

// Get all sites with pagination
export const getAllSites = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/sites', { params: { page, limit } });
    return {
      success: response.data.success,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    return handleError(error, 'Failed to fetch all sites');
  }
};

// Get available sites only
export const getAvailableSites = async () => {
  try {
    const response = await api.get('/sites/available');
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    return handleError(error, 'Failed to fetch available sites');
  }
};

// Get assignable sites only
export const getAssignableSites = async () => {
  try {
    const response = await api.get('/sites/assignable');
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    return handleError(error, 'Failed to fetch assignable sites');
  }
};

// Get a single site by ID
export const getSiteById = async (id) => {
  try {
    const response = await api.get(`/sites/${id}`);
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    return handleError(error, 'Failed to fetch site details');
  }
};

// Create a new site
export const createSite = async (siteData) => {
  try {
    const response = await api.post('/sites', siteData);
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    return handleError(error, 'Failed to create site');
  }
};

// Update an existing site
export const updateSite = async (id, siteData) => {
  try {
    const response = await api.put(`/sites/${id}`, siteData);
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    return handleError(error, 'Failed to update site');
  }
};

// Delete a site
export const deleteSite = async (id) => {
  try {
    const response = await api.delete(`/sites/${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    return handleError(error, 'Failed to delete site');
  }
};

// Mark a site as finished
export const markSiteAsFinished = async (id) => {
  try {
    const response = await api.put(`/sites/${id}/mark-finished`);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    return handleError(error, 'Failed to mark site as finished');
  }
};

// Assign a manager to a site
export const assignManager = async (id, managerId) => {
  try {
    const response = await api.post(`/sites/${id}/assign-manager`, { managerId });
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    return handleError(error, 'Failed to assign manager');
  }
};
