// src/features/Employee/employeeApi.js

const API_BASE = '/api/employees'; // Relative path — proxy handles forwarding

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (res) => {
  const text = await res.text();

  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    throw new Error(`Server returned HTML instead of JSON. Status: ${res.status}. This usually means the API endpoint doesn't exist or proxy is misconfigured.`);
  }

  if (!text.trim()) {
    if (res.ok) return { success: true, data: null };
    throw new Error(`Empty response from server. Status: ${res.status}`);
  }

  try {
    return JSON.parse(text);
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 200)}...`);
  }
};

export async function getEmployees() {
  try {
    const res = await fetch(API_BASE, {
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(res);

    if (!res.ok) {
      throw new Error(`Failed to fetch employees: ${data.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error('getEmployees error:', error);
    throw error;
  }
}

export async function createEmployee(data) {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const responseData = await handleResponse(res);

    if (!res.ok) {
      throw new Error(`Failed to create employee: ${responseData.message || 'Unknown error'}`);
    }

    return responseData;
  } catch (error) {
    console.error('createEmployee error:', error);
    throw error;
  }
}

export async function updateEmployee(id, data) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const responseData = await handleResponse(res);

    if (!res.ok) {
      throw new Error(`Failed to update employee: ${responseData.message || 'Unknown error'}`);
    }

    return responseData;
  } catch (error) {
    console.error('updateEmployee error:', error);
    throw error;
  }
}

export async function deleteEmployee(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const responseData = await handleResponse(res);

    if (!res.ok) {
      throw new Error(`Failed to delete employee: ${responseData.message || 'Unknown error'}`);
    }

    return responseData;
  } catch (error) {
    console.error('deleteEmployee error:', error);
    throw error;
  }
}
