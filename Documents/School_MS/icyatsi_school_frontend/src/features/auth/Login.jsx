import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  School,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import './LoginPage.css'; // Pure CSS import

const LoginPage = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your backend

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (alert.show) {
      setAlert({ show: false, type: '', message: '' });
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.phone.trim() || !formData.password.trim()) {
      showAlert('error', 'Phone number and password are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.phone.trim(),
          password: formData.password.trim()
        })
      });

      const data = await response.json();

     if (data.success) {
  const token = data.data.token; // Optional clarity
 localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  console.log('Login successful:', data.data.user);

        showAlert('success', 'Login successful! Redirecting...');

        setTimeout(() => {
          const userRole = data.data.user.role;
       switch (userRole) {
  case 'admin':
    window.location.href = '/dashboard/admin';
    break;
  case 'head_teacher':
    window.location.href = '/dashboard/headteacher';
    break;
  case 'accountant':
    window.location.href = '/dashboard/accountant';
    break;
  case 'cashier':
    window.location.href = '/dashboard/cashier';
    break;
  default:
    window.location.href = '/dashboard';
}
        }, 1500);
      } else {
        showAlert('error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert(
        'error',
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="icon-center">
              <School className="school-icon" />
            </div>
            <h1 className="login-title">School Management System</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <div className="login-body">
            {alert.show && (
              <div className={`alert ${alert.type}`}>
                {alert.type === 'success' ? (
                  <CheckCircle className="alert-icon" />
                ) : (
                  <AlertCircle className="alert-icon" />
                )}
                <span>{alert.message}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-icon">
                <Phone className="input-left-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-icon">
                <Lock className="input-left-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <div className="loading-content">
                  <Loader2 className="spinner" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="login-footer">
              <p>
                Having trouble signing in?{' '}
                <button
                  onClick={() =>
                    showAlert(
                      'info',
                      'Please contact your administrator for assistance'
                    )
                  }
                  className="contact-link"
                >
                  Contact Administrator
                </button>
              </p>
            </div>

            <div className="role-info">
              <h3>System Roles:</h3>
              <div className="roles">
                <div className="role">
                  <span className="dot red"></span> Admin - Full system access
                </div>
                <div className="role">
                  <span className="dot blue"></span> Head Teacher - School management
                </div>
                <div className="role">
                  <span className="dot green"></span> Accountant - Financial management
                </div>
                <div className="role">
                  <span className="dot yellow"></span> Cashier - Payment processing
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
