import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/users';

// Get token helper to avoid repetition
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Register a new site manager (Admin only)
export const registerSiteManager = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/register-site-manager`,
      formData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

// Fetch paginated site managers (Admin only)
export const fetchSiteManagers = async (page = 1, limit = 5) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_BASE_URL}/admin/site-managers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch site managers' };
  }
};

// Update a site manager by ID (Admin only)
export const updateSiteManager = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/users/${id}`,
      formData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Update failed' };
  }
};

// Delete a site manager by ID (Admin only)
export const deleteSiteManager = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_BASE_URL}/admin/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Delete failed' };
  }
};
