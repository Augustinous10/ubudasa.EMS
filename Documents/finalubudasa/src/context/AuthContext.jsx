import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; // Adjust this path to your axios instance location

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Helper to parse JWT token payload
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse JWT:', e);
      return null;
    }
  };

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? parseJwt(token) : null;
  });

  const login = async ({ phone, password }) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      const decodedUser = parseJwt(data.token);
      setUser(decodedUser);

      api.setAuthToken(data.token);  // Set token in axios headers

      return decodedUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');

    api.removeAuthToken(); // Remove token from axios headers
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = parseJwt(token);
      setUser(decodedUser);

      api.setAuthToken(token);  // Set axios token on app load
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
