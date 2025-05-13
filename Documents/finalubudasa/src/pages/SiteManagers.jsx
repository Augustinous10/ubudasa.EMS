import React, { useState } from 'react';
import './siteManagers.css'; // Make sure your CSS is imported

const SiteManagers = () => {
  const [managers, setManagers] = useState(
    JSON.parse(localStorage.getItem('siteManagers')) || []
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [showForm, setShowForm] = useState(false); // 👈 Control form visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddManager = (e) => {
    e.preventDefault();
    const updated = [...managers, formData];
    setManagers(updated);
    localStorage.setItem('siteManagers', JSON.stringify(updated));
    setFormData({ name: '', email: '', phone: '' });
    setShowForm(false); // 👈 Optionally hide form after submission
  };

  return (
    <div className="page">
      <h2>Site Managers</h2>

      <button
        className="toggle-form-btn"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? 'Close Form' : 'Add Site Manager'}
      </button>

      {showForm && (
        <form onSubmit={handleAddManager} className="site-manager-form">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
          <button type="submit">Save</button>
        </form>
      )}

      <h3>All Site Managers</h3>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th></tr>
        </thead>
        <tbody>
          {managers.map((mgr, index) => (
            <tr key={index}>
              <td>{mgr.name}</td>
              <td>{mgr.email}</td>
              <td>{mgr.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SiteManagers;
