import { useState, useEffect } from 'react';
import axios from 'axios';
import './siteManager.css';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';

export default function SiteManagerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [siteManagers, setSiteManagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // If user is not an ADMIN, redirect them away
    if (user?.role !== 'ADMIN') {
      navigate('/not-authorized'); // Create this route or redirect to dashboard
    } else {
      fetchSiteManagers();
    }
  }, [user, navigate]);

  const fetchSiteManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users?role=SITE_MANAGER', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSiteManagers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/register', {
        ...formData,
        role: 'SITE_MANAGER',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Site Manager added!');
      fetchSiteManagers();
      setFormData({ name: '', email: '', password: '', phone: '' });
      setShowForm(false);
    } catch (error) {
      setMessage('Error adding site manager');
    }
  };

  const filteredManagers = siteManagers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="site-manager-container">
      <h2>Manage Site Managers</h2>
      <div className="header-actions">
        <input
          type="text"
          placeholder="Search site managers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'Add New Site Manager'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="site-manager-form">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit">Submit</button>
        </form>
      )}

      {message && <p className="message">{message}</p>}

      <table className="site-manager-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredManagers.map(manager => (
            <tr key={manager._id}>
              <td>{manager.name}</td>
              <td>{manager.email}</td>
              <td>
                <button>Edit</button>
                <button className="delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
