import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Uses AuthContext
import './login.css';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth(); // ✅ Access auth state and login function

  useEffect(() => {
    // Auto-redirect if user already logged in
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'SITE_MANAGER') {
      navigate('/site-manager/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const loggedInUser = await login({ phone, password });

      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (loggedInUser.role === 'SITE_MANAGER') {
        navigate('/site-manager/dashboard');
      } else {
        alert('Unknown role: ' + loggedInUser.role);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src="/logo192.png" alt="Logo" className="login-logo" />
        <h2>Welcome Back!</h2>
        <p className="login-subtext">Please sign in to continue</p>
      </div>

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default Login;
