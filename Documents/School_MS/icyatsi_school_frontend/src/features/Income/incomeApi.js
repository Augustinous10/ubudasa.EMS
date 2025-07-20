// API Helper for Income Management
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust to your backend URL

const apiHelper = {
  getToken: () => localStorage.getItem('token'), // Fixed: Changed from 'authToken' to 'token'
  
  request: async (endpoint, options = {}) => {
    const token = apiHelper.getToken();
    
    // Debug logging
    console.log('API Request Debug:', {
      endpoint,
      tokenExists: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'null',
      localStorage: !!localStorage.getItem('token') // Fixed: Changed from 'authToken' to 'token'
    });
    
    // Check if token exists for protected routes
    if (!token) {
      console.error('No authentication token found in localStorage');
      console.error('Current localStorage keys:', Object.keys(localStorage));
      // Redirect to login or throw specific error
      throw new Error('No token provided');
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Always include if token exists
        ...options.headers,
      },
      ...options,
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      if (!response.ok) {
        // Handle 401 specifically
        if (response.status === 401) {
          console.error('Authentication failed - token may be expired');
          localStorage.removeItem('token'); // Fixed: Changed from 'authToken' to 'token'
          // You might want to redirect to login here
          // window.location.href = '/login';
        }
        
        const errorMessage = typeof data === 'object' ? data.message : data;
        throw new Error(errorMessage || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Income API endpoints
  income: {
    getAll: (params = {}) => {
      // Remove empty params to clean up URL
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '' && value != null)
      );
      const queryString = new URLSearchParams(cleanParams).toString();
      return apiHelper.request(`/incomes${queryString ? `?${queryString}` : ''}`);
    },
    
    getById: (id) => {
      if (!id) throw new Error('Income ID is required');
      return apiHelper.request(`/incomes/${id}`);
    },
    
    create: (data) => {
      if (!data) throw new Error('Income data is required');
      return apiHelper.request('/incomes', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    update: (id, data) => {
      if (!id) throw new Error('Income ID is required');
      if (!data) throw new Error('Income data is required');
      return apiHelper.request(`/incomes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    
    delete: (id) => {
      if (!id) throw new Error('Income ID is required');
      return apiHelper.request(`/incomes/${id}`, {
        method: 'DELETE',
      });
    },
    
    getStatistics: (params = {}) => {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '' && value != null)
      );
      const queryString = new URLSearchParams(cleanParams).toString();
      return apiHelper.request(`/incomes/statistics${queryString ? `?${queryString}` : ''}`);
    },
  },

  // Students API endpoints
  students: {
    getAll: () => apiHelper.request('/students'),
    
    getById: (id) => {
      if (!id) throw new Error('Student ID is required');
      return apiHelper.request(`/students/${id}`);
    }
  },

  // Auth helper methods
  auth: {
    isAuthenticated: () => {
      const token = apiHelper.getToken();
      if (!token) return false;
      
      try {
        // Basic JWT token validation (check if not expired)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
      } catch (error) {
        console.error('Invalid token format:', error);
        return false;
      }
    },
    
    logout: () => {
      localStorage.removeItem('token'); // Fixed: Changed from 'authToken' to 'token'
      // Redirect to login page
      window.location.href = '/login';
    },
    
    setToken: (token) => {
      localStorage.setItem('token', token); // Fixed: Changed from 'authToken' to 'token'
    }
  }
};

export default apiHelper;