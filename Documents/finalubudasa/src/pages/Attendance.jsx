import React, { useEffect, useState } from 'react';
import {
  getAllAttendance,
  getAttendanceByFilter,
} from '../api/attendanceApi';
import { getAllSiteManagers } from '../api/userApi';
import { getReportsByFilter } from '../api/reportApi';
import './attendance.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong in AttendanceApp.</h2>;
    }
    return this.props.children;
  }
}

function AttendanceAppInner() {
  const [tab, setTab] = useState('attendance');

  const [attendances, setAttendances] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dateFilter, setDateFilter] = useState('');
  const [siteManagers, setSiteManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    console.log('Component mounted - loading attendances and site managers');
    loadAttendances();
    loadSiteManagers();
  }, []);

  async function loadAttendances() {
    setLoading(true);
    try {
      console.log('Loading all attendance records...');
      const data = await getAllAttendance();
      console.log('Attendance data loaded:', data);
      setAttendances(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to load attendances', err);
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadReports() {
    setLoading(true);
    try {
      console.log('Loading all reports...');
      // For no filters, just pass empty object
      const data = await getReportsByFilter({});
      console.log('Reports data loaded:', data);
      setReports(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to load reports', err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadSiteManagers() {
    try {
      console.log('Loading site managers...');
      const data = await getAllSiteManagers();
      const managersArray = Array.isArray(data) ? data : data.siteManagers || [];
      console.log('Site managers loaded:', managersArray);
      setSiteManagers(managersArray);
    } catch (err) {
      console.error('Failed to load site managers', err);
      setSiteManagers([]);
    }
  }

  async function handleFilter() {
    setLoading(true);
    try {
      console.log(`Filtering data for tab: ${tab}`);
      console.log('Date filter:', dateFilter);
      console.log('Selected Manager:', selectedManager);

      if (tab === 'attendance') {
        const data = await getAttendanceByFilter(
          dateFilter ? 'date' : '',
          dateFilter,
          selectedManager || undefined
        );
        console.log('Filtered attendance data:', data);
        setAttendances(Array.isArray(data) ? data : []);
      } else {
        // Prepare query parameters correctly
        const query = {};
        if (dateFilter) query.date = dateFilter; // e.g., '2025-05-27'
        if (selectedManager) query.siteManagerId = selectedManager;

        console.log('Query for reports filter:', query);
        const data = await getReportsByFilter(query);
        console.log('Filtered reports data:', data);
        setReports(Array.isArray(data) ? data : []);
      }
      setCurrentPage(1);
    } catch (err) {
      console.error('Filter error:', err);
      if (tab === 'attendance') {
        setAttendances([]);
      } else {
        setReports([]);
      }
    } finally {
      setLoading(false);
    }
  }

  function getSiteManagerName(siteManager) {
    if (!siteManager) return 'Unknown';
    if (typeof siteManager === 'object' && siteManager.name) {
      return siteManager.name;
    }
    const manager = siteManagers.find(m => m._id === siteManager);
    return manager ? manager.name : siteManager;
  }

  const safeAttendances = Array.isArray(attendances) ? attendances : [];
  const safeReports = Array.isArray(reports) ? reports : [];

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords =
    tab === 'attendance'
      ? safeAttendances.slice(indexOfFirstRecord, indexOfLastRecord)
      : safeReports.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(
    (tab === 'attendance' ? safeAttendances.length : safeReports.length) /
      recordsPerPage
  );

  return (
    <div className="attendance-app">
      <h1 className="title">Attendance Management</h1>

      <div className="tab-buttons">
        <button
          className={`button ${tab === 'attendance' ? 'active' : ''}`}
          onClick={() => {
            console.log('Switching tab to attendance');
            setTab('attendance');
            setReports([]); // clear reports when switching tab
            loadAttendances();
          }}
        >
          Attendance
        </button>
        <button
          className={`button ${tab === 'reports' ? 'active' : ''}`}
          onClick={() => {
            console.log('Switching tab to reports');
            setTab('reports');
            setAttendances([]); // clear attendance when switching tab
            loadReports(); // <-- Load all reports by default on tab switch
          }}
        >
          Daily Reports
        </button>
      </div>

      <div className="filters">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            console.log('Date filter changed:', e.target.value);
            setDateFilter(e.target.value);
          }}
          className="input"
        />
        <select
          value={selectedManager}
          onChange={(e) => {
            console.log('Selected manager changed:', e.target.value);
            setSelectedManager(e.target.value);
          }}
          className="input"
        >
          <option value="">All Managers</option>
          {siteManagers.map((manager) => (
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
            console.log('Clearing filters and reloading data');
            setDateFilter('');
            setSelectedManager('');
            if (tab === 'attendance') {
              loadAttendances();
            } else {
              loadReports();
            }
          }}
          className="button secondary"
        >
          Clear
        </button>
      </div>

      <div className="table-container">
        {tab === 'attendance' ? (
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
              ) : currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="center">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                currentRecords.map((att) => (
                  <tr key={att._id}>
                    <td>{new Date(att.date).toLocaleDateString()}</td>
                    <td>{getSiteManagerName(att.siteManager)}</td>
                    <td>
                      {att.groupImage ? (
                        <a
                          href={att.groupImage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={att.groupImage}
                            alt="Group"
                            style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
                          />
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      {att.attendedEmployees.map((ae) => (
                        <div key={ae.employee._id || ae.employee}>
                          {ae.employee.name || ae.employee}
                        </div>
                      ))}
                    </td>
                    <td>
                      {att.attendedEmployees.map((ae) => (
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
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Site Manager</th>
                <th>Activities Done</th>
                <th>Next Day Plan</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="center">
                    Loading...
                  </td>
                </tr>
              ) : currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="center">
                    No reports found.
                  </td>
                </tr>
              ) : (
                currentRecords.map((report) => (
                  <tr key={report._id}>
                    <td>{new Date(report.date).toLocaleDateString()}</td>
                    <td>{getSiteManagerName(report.siteManagerId)}</td>
                    <td>{report.activitiesDone}</td>
                    <td>{report.nextDayPlan}</td>
                    <td>{report.comments || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="button"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`button ${currentPage === i + 1 ? 'active' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function AttendanceApp() {
  return (
    <ErrorBoundary>
      <AttendanceAppInner />
    </ErrorBoundary>
  );
}
