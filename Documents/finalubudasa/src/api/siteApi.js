const API_URL = 'http://localhost:5000/api/sites';

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'API request failed');
  }
  return res.json();
}

// Get all sites
export async function getAllSites() {
  const res = await fetch(API_URL);
  return handleResponse(res);
}

// Get site by ID
export async function getSiteById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return handleResponse(res);
}

// Create a new site registration
export async function createSiteRegistration(data, token) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Use token here
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Update site info by ID
export async function updateSite(id, data, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Delete site by ID
export async function deleteSite(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}
