import React, { useState } from 'react';
import { createSiteRegistration } from '../api/siteApi';  // import API helper
// import './RegisterSite.css';

const RegisterSite = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    workDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token'); // JWT token from local storage

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Call API helper and pass token
      const response = await createSiteRegistration(formData, token);

      if (response.success) {
        setMessage('Site registered successfully!');
        setFormData({ name: '', location: '', workDescription: '' });
      } else {
        setError('Failed to register site.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ddd', borderRadius: 4 }}>
      <h2>Register New Site</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Site Name<span style={{ color: 'red' }}> *</span><br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Location<br />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Work Description<span style={{ color: 'red' }}> *</span><br />
            <textarea
              name="workDescription"
              value={formData.workDescription}
              onChange={handleChange}
              required
              rows={4}
              style={{ width: '100%', padding: 8 }}
            ></textarea>
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Registering...' : 'Register Site'}
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: 12 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
    </div>
  );
};

export default RegisterSite;
