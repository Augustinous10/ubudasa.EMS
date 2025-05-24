import React, { useState } from 'react';
import { createReport } from '../api/reportApi'; // adjust if DailyReport.jsx is deeper
import './dailyReport.css';

const DailyReport = () => {
  const [formData, setFormData] = useState({
    date: '',
    activitiesDone: '',
    nextDayPlan: '',
    comments: '',
  });

  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await createReport(formData); // use the imported API function
      setMessage('✅ Report submitted successfully!');
      setFormData({ date: '', activitiesDone: '', nextDayPlan: '', comments: '' });
    } catch (error) {
      console.error('Report submission error:', error);
      setMessage(`❌ Failed to submit report: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Submit Daily Report</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <textarea
          name="activitiesDone"
          placeholder="Activities Done"
          value={formData.activitiesDone}
          onChange={handleChange}
          required
        />
        <textarea
          name="nextDayPlan"
          placeholder="Next Day Plan"
          value={formData.nextDayPlan}
          onChange={handleChange}
          required
        />
        <textarea
          name="comments"
          placeholder="Comments"
          value={formData.comments}
          onChange={handleChange}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default DailyReport;
