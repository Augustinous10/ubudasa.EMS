import React, { useEffect, useState, useCallback } from 'react';
import {
  getAllSites,
  createSite,
  updateSite,
  deleteSite,
  markSiteAsFinished,
} from '../api/siteApi';
import './RegisterSite.css';

const SitePage = () => {
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    workDescription: '',
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSiteId, setEditingSiteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const token = localStorage.getItem('token');
  const isAdmin = (() => {
    try {
      if (!token) return false;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'ADMIN';
    } catch {
      return false;
    }
  })();

  const fetchSites = useCallback(
    async (page) => {
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        const res = await getAllSites(page, pageSize);
        if (res.success) {
          setSites(res.data || []);
          setTotalPages(res.pagination?.totalPages || 1);
        } else {
          setError(res.error || 'Failed to load sites.');
          setSites([]);
          setTotalPages(1);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch sites.');
        setSites([]);
        setTotalPages(1);
      }
      setLoading(false);
    },
    [pageSize]
  );

  useEffect(() => {
    fetchSites(currentPage);
  }, [fetchSites, currentPage]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', workDescription: '' });
    setEditingSiteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = editingSiteId
        ? await updateSite(editingSiteId, formData)
        : await createSite(formData);

      if (res.success) {
        setMessage(editingSiteId ? 'Site updated!' : 'Site created!');
        resetForm();
        setShowForm(false);
        fetchSites(currentPage);
      } else {
        setError(res.error || 'Operation failed.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
    setLoading(false);
  };

  const handleEdit = (site) => {
    setFormData({
      name: site.name,
      location: site.location,
      workDescription: site.workDescription,
    });
    setEditingSiteId(site._id);
    setShowForm(true);
    setMessage(null);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this site?')) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await deleteSite(id);
      if (res.success) {
        setMessage('Site deleted.');
        if (sites.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchSites(currentPage);
        }
      } else {
        setError(res.error || 'Failed to delete site.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
    setLoading(false);
  };

  const handleMarkFinished = async (id) => {
    if (!window.confirm('Mark this site as finished?')) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await markSiteAsFinished(id);
      if (res.success) {
        setMessage('Site marked as finished.');
        fetchSites(currentPage);
      } else {
        setError(res.error || 'Failed to update status.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
    setLoading(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const getAssignmentStatus = (site) => {
    if (site.status === 'finished') return 'Finished';
    if (site.status === 'available') {
      if (!site.siteManager) return 'Available & Not Assigned';
      return 'Assigned';
    }
    return site.status || 'Unknown';
  };

  return (
    <div className="site-page">
      <h2>All Sites</h2>

      {isAdmin && (
        <button
          className="add-site-btn"
          onClick={() => {
            setShowForm((prev) => !prev);
            resetForm();
            setError(null);
            setMessage(null);
          }}
        >
          {showForm ? 'Cancel' : editingSiteId ? 'Edit Site' : 'Add New Site'}
        </button>
      )}

      {showForm && (
        <form className="site-form" onSubmit={handleSubmit}>
          <div>
            <label>
              Site Name<span className="required">*</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </label>
          </div>

          <div>
            <label>
              Location
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
              />
            </label>
          </div>

          <div>
            <label>
              Work Description<span className="required">*</span>
              <textarea
                name="workDescription"
                value={formData.workDescription}
                onChange={handleChange}
                rows={4}
                required
                disabled={loading}
              />
            </label>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading
              ? editingSiteId
                ? 'Updating...'
                : 'Adding...'
              : editingSiteId
              ? 'Update Site'
              : 'Add Site'}
          </button>
        </form>
      )}

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <div className="table-container">
        <table className="site-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Work Description</th>
              <th>Status</th>
              <th>Assignment</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sites.length > 0 ? (
              sites.map((site) => (
                <tr key={site._id}>
                  <td>{site.name}</td>
                  <td>{site.location}</td>
                  <td>{site.workDescription}</td>
                  <td>{site.status}</td>
                  <td>
                    {getAssignmentStatus(site)}
                    {site.siteManager && (
                      <>
                        {' '}
                        - <strong>{site.siteManager.name}</strong>
                      </>
                    )}
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        onClick={() => handleEdit(site)}
                        disabled={loading}
                        title="Edit Site"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(site._id)}
                        disabled={loading}
                        title="Delete Site"
                      >
                        Delete
                      </button>
                      {site.status === 'available' && (
                        <button
                          onClick={() => handleMarkFinished(site._id)}
                          disabled={loading}
                          title="Mark as Finished"
                        >
                          Mark as Finished
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 6 : 5}>No sites available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
          Previous
        </button>
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages || loading}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SitePage;
