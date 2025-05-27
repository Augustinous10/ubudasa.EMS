import React, { useEffect, useState } from 'react';
import {
  getAllAttendance,
  getAttendanceByFilter,
} from '../api/attendanceApi';
import { getAllSiteManagers } from '../api/userApi';
import './attendance.css';

export default function AttendanceApp() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [siteManagers, setSiteManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');

  useEffect(() => {
    loadAttendances();
    loadSiteManagers();
  }, []);

  async function loadAttendances() {
    setLoading(true);
    const data = await getAllAttendance();
    setAttendances(data);
    setLoading(false);
  }

  async function loadSiteManagers() {
    try {
      const data = await getAllSiteManagers();
      const managersArray = Array.isArray(data)
        ? data
        : data.siteManagers || [];
      setSiteManagers(managersArray);
    } catch (err) {
      console.error('Failed to load site managers', err);
      setSiteManagers([]);
    }
  }

  async function handleFilter() {
    if (!dateFilter && !selectedManager) return loadAttendances();
    setLoading(true);
    const data = await getAttendanceByFilter(
      dateFilter ? 'date' : '',
      dateFilter,
      selectedManager || undefined
    );
    setAttendances(data);
    setLoading(false);
  }

  function getSiteManagerName(siteManager) {
    if (!siteManager) return 'Unknown';

    if (typeof siteManager === 'object' && siteManager.name) {
      return siteManager.name;
    }

    const manager = siteManagers.find(m => m._id === siteManager);
    return manager ? manager.name : siteManager;
  }

  return (
    <div className="attendance-app">
      <h1 className="title">Attendance Management</h1>

      <div className="filters">
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="input"
        />
        <select
          value={selectedManager}
          onChange={e => setSelectedManager(e.target.value)}
          className="input"
        >
          <option value="">All Managers</option>
          {Array.isArray(siteManagers) &&
            siteManagers.map(manager => (
              <option key={manager._id} value={manager._id}>
                {manager.name}
              </option>
            ))}
        </select>
        <button onClick={handleFilter} className="button primary">
          Filter
        </button>
        <button
          onClick={() => {
            setDateFilter('');
            setSelectedManager('');
            loadAttendances();
          }}
          className="button secondary"
        >
          Clear
        </button>
      </div>

      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Site Manager</th>
              <th>Group Image</th>
              <th>Employees</th>
              <th>Salary (RWF)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="center">
                  Loading...
                </td>
              </tr>
            ) : attendances.length === 0 ? (
              <tr>
                <td colSpan="5" className="center">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendances.map(att => (
                <tr key={att._id}>
                  <td>{new Date(att.date).toLocaleDateString()}</td>
                  <td>{getSiteManagerName(att.siteManager)}</td>
                  <td>
                    {att.groupImage ? (
                      <img
                        src={att.groupImage}
                        alt="Group"
                        style={{ width: '100px', height: 'auto' }}
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    {att.attendedEmployees.map(ae => (
                      <div key={ae.employee._id || ae.employee}>
                        {ae.employee.name || ae.employee}
                      </div>
                    ))}
                  </td>
                  <td>
                    {att.attendedEmployees.map(ae => (
                      <div key={ae.employee._id || ae.employee}>
                        {ae.salary != null ? `${ae.salary} RWF` : 'N/A'}
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
