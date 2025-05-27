import React, { useState } from 'react';
import { registerSiteManager } from '../api/SiteManagerAPI'; // Adjust path if needed
import './siteManager.css';

const AddSiteManager = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    site: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm(prevForm => ({ ...prevForm, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await registerSiteManager(form);
      setMessage(res.message || 'Site Manager created successfully.');
      setForm({ name: '', phone: '', password: '', site: '' });
    } catch (err) {
      const error = err.response?.data?.error || 'Something went wrong.';
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-site-manager-container">
      <h2>Create Site Manager</h2>
      {message && <p className="form-message">{message}</p>}
      <form className="site-manager-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="site"
          placeholder="Site Location"
          value={form.site}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Site Manager'}
        </button>
      </form>
    </div>
  );
};

export default AddSiteManager;
