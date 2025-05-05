import { createContext, useContext, useState } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the app with context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@ubudasa.com' && password === 'admin123') {
          const loggedInUser = { name: 'Admin User', email };
          setUser(loggedInUser);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          resolve(loggedInUser);
        } else {
          reject('Invalid credentials');
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user, // Add this for convenience
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
