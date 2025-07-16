// api/authService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class AuthService {
  // Login API call
  static async login(phone, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store token and user data
        this.setAuthData(data.data.token, data.data.user);
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  // Store authentication data
  static setAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get stored token
  static getToken() {
    return localStorage.getItem('token');
  }

  // Get stored user data
  static getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.getToken();
  }

  // Logout user
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Get authentication headers
  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // API call with authentication
  static async authenticatedFetch(endpoint, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // Handle unauthorized responses
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data: data.data || data };
      } else {
        return { success: false, message: data.message || 'Request failed' };
      }
    } catch (error) {
      console.error('API error:', error);
      return { success: false, message: error.message || 'Network error' };
    }
  }
}

// User API calls
class UserService {
  // Get all users
  static async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    return AuthService.authenticatedFetch(endpoint);
  }

  // Get user by ID
  static async getUserById(id) {
    return AuthService.authenticatedFetch(`/users/${id}`);
  }

  // Create new user (register)
  static async createUser(userData) {
    return AuthService.authenticatedFetch('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Update user
  static async updateUser(id, userData) {
    return AuthService.authenticatedFetch(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  // Delete user
  static async deleteUser(id) {
    return AuthService.authenticatedFetch(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Change password
  static async changePassword(id, currentPassword, newPassword) {
    return AuthService.authenticatedFetch(`/users/${id}/change-password`, {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
  }
}

// Route protection helper
class RouteProtection {
  static checkAuth() {
    return AuthService.isAuthenticated();
  }

  static checkRole(requiredRole) {
    const user = AuthService.getUser();
    if (!user) return false;
    
    const roleHierarchy = {
      admin: ['admin', 'head_teacher', 'accountant', 'cashier'],
      head_teacher: ['head_teacher', 'accountant', 'cashier'],
      accountant: ['accountant'],
      cashier: ['cashier']
    };

    return roleHierarchy[user.role]?.includes(requiredRole) || false;
  }

  static redirectByRole() {
    const user = AuthService.getUser();
    if (!user) return '/login';

    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'head_teacher':
        return '/head-teacher/dashboard';
      case 'accountant':
        return '/accountant/dashboard';
      case 'cashier':
        return '/cashier/dashboard';
      default:
        return '/dashboard';
    }
  }
}

// Export all services
export { AuthService, UserService, RouteProtection };

// Default export
export default AuthService;