// src/pages/CurrentTerm.js
import React, { useEffect, useState } from 'react';
import { createTerm, getCurrentTerm } from '../features/Term/termApi';
import './CurrentTerm.css';

const CurrentTerm = () => {
  const [formData, setFormData] = useState({
    academicYear: '',
    term: '',
    startDate: '',
    endDate: '',
    breakStart: '',
    breakEnd: '',
  });

  const [currentTerm, setCurrentTerm] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCurrent = async () => {
    try {
      const result = await getCurrentTerm();
      setCurrentTerm(result);
      setMessage('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to fetch current term');
    }
  };

  useEffect(() => {
    fetchCurrent();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await createTerm(formData);
      setMessage('Term created successfully.');
      fetchCurrent();
      setFormData({
        academicYear: '',
        term: '',
        startDate: '',
        endDate: '',
        breakStart: '',
        breakEnd: '',
      });

      // Optional: clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating term');
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely capitalize term
  const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

  return (
    <div className="container">
      <h1>Term Configuration</h1>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Academic Year:</label>
          <input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            placeholder="e.g. 2024-2025"
            required
          />
        </div>

        <div className="form-group">
          <label>Term:</label>
          <select name="term" value={formData.term} onChange={handleChange} required>
            <option value="">Select Term</option>
            <option value="first">First Term</option>
            <option value="second">Second Term</option>
            <option value="third">Third Term</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Break Start:</label>
          <input type="date" name="breakStart" value={formData.breakStart} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Break End:</label>
          <input type="date" name="breakEnd" value={formData.breakEnd} onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Create Term'}
        </button>
      </form>

      {currentTerm && (
        <div className="term-display">
          <h2>Current Active Term</h2>
          <p><strong>Academic Year:</strong> {currentTerm.academicYear || 'N/A'}</p>
          <p><strong>Term:</strong> {capitalize(currentTerm.term) || 'N/A'}</p>
          <p><strong>Start:</strong> {currentTerm.startDate ? new Date(currentTerm.startDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>End:</strong> {currentTerm.endDate ? new Date(currentTerm.endDate).toLocaleDateString() : 'N/A'}</p>
          {currentTerm.breakStart && currentTerm.breakEnd && (
            <p>
              <strong>Break:</strong> {new Date(currentTerm.breakStart).toLocaleDateString()} -{' '}
              {new Date(currentTerm.breakEnd).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentTerm;
