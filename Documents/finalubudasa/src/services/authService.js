export const login = async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@ubudasa.com' && password === 'admin123') {
          resolve({ name: 'Admin User', email });
        } else {
          reject('Invalid credentials');
        }
      }, 500);
    });
  };
  
  export const logout = () => {
    localStorage.removeItem('user');
  };
  
  export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  