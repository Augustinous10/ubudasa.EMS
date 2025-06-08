import React, { useState, useEffect, useCallback } from 'react';
import {
  getAllSites,
  getAvailableSites,
} from '../api/siteApi';
import {
  registerSiteManager,
  fetchSiteManagers,
  updateSiteManager,
  deleteSiteManager,
} from '../api/SiteManagerAPI';

import './siteManager.css';

const SiteManager = () => {
  const [form, setForm] = useState({ name: '', phone: '', password: '', site: '' });
  const [availableSites, setAvailableSites] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [siteManagers, setSiteManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchSites = async () => {
    try {
      const all = await getAllSites();
      setAllSites(all.data || all);
      const available = await getAvailableSites();
      setAvailableSites(available.data || available);
    } catch (err) {
      console.error('Error fetching sites:', err);
      setMessage('Failed to load sites.');
    }
  };

  const fetchManagers = useCallback(async (pageNumber = 1) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetchSiteManagers(pageNumber, limit);
      const data = response.data || response;
      setSiteManagers(data.siteManagers || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Error fetching site managers:', err);
      setSiteManagers([]);
      setTotalPages(1);
      setMessage('Failed to load site managers.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchSites();
    fetchManagers(1);
  }, [fetchManagers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});
    try {
      if (editId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateSiteManager(editId, payload);
        setMessage('Site Manager updated successfully.');
      } else {
        await registerSiteManager(form);
        setMessage('Site Manager created successfully.');
      }
      setForm({ name: '', phone: '', password: '', site: '' });
      setEditId(null);
      setShowForm(false);
      await fetchManagers(page);
      await fetchSites();
    } catch (err) {
      console.error('Submit error:', err);
      const backendError = err.response?.data?.error || err.message || 'Phone number already in use.';
      if (backendError === 'Phone number already in use.') {
        setErrors({ phone: 'This phone number is already registered. Please use a different phone number.' });
        setMessage('');
      } else {
        setMessage(backendError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (manager) => {
    setForm({
      name: manager.name,
      phone: manager.phone,
      password: '',
      site: manager.site?._id || manager.site || '',
    });
    setEditId(manager._id);
    setMessage('');
    setErrors({});
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ name: '', phone: '', password: '', site: '' });
    setEditId(null);
    setMessage('');
    setErrors({});
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this site manager?')) return;
    setLoading(true);
    setMessage('');
    try {
      await deleteSiteManager(id);
      setMessage('Site Manager deleted.');
      const newPage = siteManagers.length === 1 && page > 1 ? page - 1 : page;
      await fetchManagers(newPage);
      await fetchSites();
    } catch (err) {
      console.error('Delete error:', err);
      setMessage(err.response?.data?.error || 'Failed to delete site manager.');
    } finally {
      setLoading(false);
    }
  };

  const getSiteName = (siteIdOrObject) => {
    if (!siteIdOrObject) return 'Unknown';
    const id = typeof siteIdOrObject === 'string' ? siteIdOrObject : siteIdOrObject._id;
    const site = allSites.find(s => s._id === id);
    return site ? site.name : 'Unknown';
  };

  const handlePrevPage = () => {
    if (page > 1) fetchManagers(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) fetchManagers(page + 1);
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const filteredAvailableSites = availableSites.filter(site =>
    !siteManagers.some(manager => {
      const managerSiteId = typeof manager.site === 'object' ? manager.site._id : manager.site;
      return managerSiteId === site._id;
    })
  );

  return (
    <div className="add-site-manager-container">
      <h2>Site Managers</h2>

      <button
        className="toggle-form-btn"
        onClick={() => {
          setShowForm(!showForm);
          setMessage('');
          setErrors({});
          if (!showForm) {
            setForm({ name: '', phone: '', password: '', site: '' });
            setEditId(null);
          }
        }}
        disabled={loading}
      >
        {showForm ? 'Hide Form' : 'Add New Site Manager'}
      </button>

      {message && <p className="form-message">{message}</p>}

      {showForm && (
        <form className="site-manager-form" onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            disabled={loading}
            className={errors.phone ? 'input-error-border' : ''}
          />
          {errors.phone && <p className="input-error">{errors.phone}</p>}

          <select
            name="site"
            value={form.site}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Site</option>
            {filteredAvailableSites.length > 0 ? (
              filteredAvailableSites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.name}
                </option>
              ))
            ) : (
              <option disabled>No available sites</option>
            )}
          </select>

          <input
            type="password"
            name="password"
            placeholder={editId ? 'New Password (leave blank to keep current)' : 'Password'}
            value={form.password}
            onChange={handleChange}
            required={!editId}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? (editId ? 'Updating...' : 'Creating...') : editId ? 'Update' : 'Create'}
          </button>

          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <h3>All Site Managers</h3>
      {loading && !showForm && <p>Loading...</p>}

      {/* Scrollable table container */}
      <div className="table-scroll-container">
        <table className="site-managers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Site</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {siteManagers.length > 0 ? (
              siteManagers.map((manager) => (
                <tr key={manager._id}>
                  <td>{manager.name}</td>
                  <td>{manager.phone}</td>
                  <td>{manager.site?.name || getSiteName(manager.site)}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(manager)} disabled={loading}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(manager._id)} disabled={loading}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No site managers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={loading || page <= 1}>
          &laquo; Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={loading || page >= totalPages}>
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default SiteManager;
