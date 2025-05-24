import React from 'react';

const SiteManagerDashboard = () => {
  return (
    <div style={{ padding: '2rem', color: '#333' }}>
      <h1 style={{ marginBottom: '1rem' }}>Welcome to Your Site Manager Dashboard</h1>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
        As a <strong>Site Manager</strong>, your role is essential to ensuring smooth daily operations at your site. 
        Please follow the steps below carefully every day:
      </p>

      <ol style={{ marginTop: '1.5rem', fontSize: '1.05rem', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
        <li><strong>Register New Employees</strong> – Add any new workers who have joined your site today.</li>
        <li><strong>Capture Group Photo</strong> – Take a group photo of the employees on-site as proof of attendance.</li>
        <li><strong>Finalize Attendance</strong> – Once all employees are present and verified, click on <em>"Finalize Attendance"</em> to submit it for the day.</li>
        <li><strong>Submit Daily Report</strong> – Fill out the daily site report detailing progress, issues, or needs. This report will be reviewed by the General Manager.</li>
      </ol>

      <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
        Your daily updates help management stay informed and make better decisions for the site and team. Thank you for your responsibility and dedication.
      </p>
    </div>
  );
};

export default SiteManagerDashboard;
