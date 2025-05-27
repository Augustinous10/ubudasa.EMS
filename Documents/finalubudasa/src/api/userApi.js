// userApi.js
import axios from 'axios';

export async function getAllSiteManagers() {
  const token = localStorage.getItem('token');  // get saved JWT token
  const response = await axios.get('http://localhost:5000/api/users/admin/site-managers', {
    headers: {
      Authorization: `Bearer ${token}`,  // Include token in headers
    },
  });
  return response.data;
}
