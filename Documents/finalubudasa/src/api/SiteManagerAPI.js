// src/api/SiteManagerAPI.js
import axios from 'axios';

// ✅ Update this to point directly to your backend
const API_BASE_URL = 'http://localhost:5000/api/users';

export const registerSiteManager = async (formData) => {
  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    `${API_BASE_URL}/admin/register-site-manager`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' // Optional but recommended
      },
    }
  );
  
  return response.data;
};

// New function to fetch all site managers
export const fetchSiteManagers = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(
    `${API_BASE_URL}/admin/site-managers`, // Adjust this endpoint if needed
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
