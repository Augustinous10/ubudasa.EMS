const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('accessToken') ||
                sessionStorage.getItem('token') ||
                sessionStorage.getItem('authToken');
  
  console.log('Retrieved Token:', token); // LOG
  return token;
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('Auth Headers:', headers); // LOG
  return headers;
};

const handleApiResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  console.log('Raw Response Status:', response.status); // LOG

  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Authentication failed. Clearing tokens and redirecting...'); // LOG
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }

    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData); // LOG
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } else {
      const htmlText = await response.text();
      if (htmlText.includes('<!DOCTYPE')) {
        console.error('Received HTML instead of JSON - possible server error'); // LOG
        throw new Error('Server returned HTML instead of JSON - check backend server and endpoints');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    console.log('API JSON Response:', data); // LOG
    return data;
  } else {
    const text = await response.text();
    console.log('API Text Response:', text); // LOG
    if (text.includes('<!DOCTYPE')) {
      throw new Error('Server returned HTML instead of JSON');
    }
    throw new Error('Response is not JSON');
  }
};

// All the functions below now include logs

export const getPayrolls = async () => {
  console.log('Calling GET /payrolls'); // LOG
  try {
    const response = await fetch(`${API_BASE_URL}/payrolls`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('getPayrolls error:', error);
    throw error;
  }
};

export const getEmployees = async () => {
  console.log('Calling GET /employees'); // LOG
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('getEmployees error:', error);
    throw error;
  }
};

export const getTerms = async () => {
  console.log('Calling GET /term-configs'); // LOG
  try {
    const response = await fetch(`${API_BASE_URL}/term-configs`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('getTerms error:', error);
    throw error;
  }
};

export const createPayroll = async (payrollData) => {
  console.log('Calling POST /payrolls with data:', payrollData); // LOG
  try {
    const response = await fetch(`${API_BASE_URL}/payrolls`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payrollData),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('createPayroll error:', error);
    throw error;
  }
};

export const updatePayroll = async (id, payrollData) => {
  console.log(`Calling PUT /payrolls/${id} with data:`, payrollData); // LOG
  try {
    const response = await fetch(`${API_BASE_URL}/payrolls/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payrollData),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('updatePayroll error:', error);
    throw error;
  }
};

export const deletePayroll = async (id) => {
  console.log(`Calling DELETE /payrolls/${id}`); // LOG
  try {
    const response = await fetch(`${API_BASE_URL}/payrolls/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('deletePayroll error:', error);
    throw error;
  }
};

export const markAsPaid = async (id) => {
  console.log(`Calling PUT /payrolls/${id}/mark-paid`); // LOG
  try {
    const response = await fetch(`${API_BASE_URL}/payrolls/${id}/mark-paid`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('markAsPaid error:', error);
    throw error;
  }
};
