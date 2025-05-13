import React, { useState } from 'react';
import './dailyReport.css';

const DailyReport = () => {
  const [report, setReport] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    activities: '',
    nextDayPlan: '',
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Report:', report);
    // TODO: Send report to backend API
  };

  return (
    <div className="report-container">
      <h2>Daily Site Manager Report</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <label>
          Date:
          <input type="date" name="date" value={report.date} onChange={handleChange} />
        </label>
        <label>
          Time (e.g. 08:00 - 17:00):
          <input type="text" name="time" value={report.time} onChange={handleChange} />
        </label>
        <label>
          Activities Completed:
          <textarea name="activities" rows="4" value={report.activities} onChange={handleChange} />
        </label>
        <label>
          Plan for Next Day:
          <textarea name="nextDayPlan" rows="3" value={report.nextDayPlan} onChange={handleChange} />
        </label>
        <label>
          Comments:
          <textarea name="comments" rows="2" value={report.comments} onChange={handleChange} />
        </label>
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default DailyReport;
