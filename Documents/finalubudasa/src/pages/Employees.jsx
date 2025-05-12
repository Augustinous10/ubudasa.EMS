// Employees.js
import React, { useState, useEffect } from 'react';
import './employees.css';

const Employees = ({ onMarkAttendance }) => {
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeSalary, setNewEmployeeSalary] = useState('');
  const [employees, setEmployees] = useState([]);
  const [attendanceForTheDay, setAttendanceForTheDay] = useState([]);
  const [finalizedAttendance, setFinalizedAttendance] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [groupImage, setGroupImage] = useState(null);

  // Pagination
  const [currentEmployeePage, setCurrentEmployeePage] = useState(1);
  const [currentAttendancePage, setCurrentAttendancePage] = useState(1);
  const [currentFinalizedPage, setCurrentFinalizedPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceDate(today);
  }, []);

  useEffect(() => {
    setCurrentEmployeePage(1);
  }, [employees.length]);

  useEffect(() => {
    setCurrentAttendancePage(1);
  }, [attendanceForTheDay.length]);

  useEffect(() => {
    setCurrentFinalizedPage(1);
  }, [finalizedAttendance.length]);

  const handleAddEmployee = () => {
    if (newEmployeeName.trim() !== '' && newEmployeeSalary.trim() !== '') {
      const newEmployee = {
        id: Date.now().toString(),
        name: newEmployeeName,
        salary: parseFloat(newEmployeeSalary),
        status: 'absent',
        image: ''
      };
      setEmployees((prev) => [...prev, newEmployee]);
      setNewEmployeeName('');
      setNewEmployeeSalary('');
    }
  };

  const handleMarkPresent = (employeeId) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === employeeId ? { ...emp, status: 'present' } : emp
    );
    setEmployees(updatedEmployees);

    const employee = updatedEmployees.find((emp) => emp.id === employeeId);

    if (employee && !attendanceForTheDay.some((emp) => emp.id === employee.id)) {
      setAttendanceForTheDay(prev => [...prev, { ...employee, date: attendanceDate }]);
    } else {
      setAttendanceForTheDay(prev => 
        prev.map(att => 
          att.id === employeeId ? { ...att, status: 'present' } : att
        )
      );
    }
  };

  const handleGroupImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setGroupImage(imageUrl);
    }
  };

  const handleAddAttendanceForTheDay = () => {
    if (attendanceForTheDay.length > 0) {
      const updatedAttendance = attendanceForTheDay.map((record) => ({
        ...record,
        image: groupImage,
        date: attendanceDate,
      }));

      if (typeof onMarkAttendance === 'function') {
        onMarkAttendance(updatedAttendance);
      }

      setFinalizedAttendance(prev => [...prev, ...updatedAttendance]);
      setAttendanceForTheDay([]);
      setGroupImage(null);
    }
  };

  // Pagination helpers
  const indexOfLastEmployee = currentEmployeePage * itemsPerPage;
  const currentEmployees = employees.slice(indexOfLastEmployee - itemsPerPage, indexOfLastEmployee);

  const indexOfLastAttendance = currentAttendancePage * itemsPerPage;
  const currentAttendance = attendanceForTheDay.slice(indexOfLastAttendance - itemsPerPage, indexOfLastAttendance);

  const uniqueDates = [...new Set(finalizedAttendance.map(record => record.date))];
  const indexOfLastDate = currentFinalizedPage * itemsPerPage;
  const currentDates = uniqueDates.slice(indexOfLastDate - itemsPerPage, indexOfLastDate);

  const Pagination = ({ currentPage, setCurrentPage, totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
      </div>
    );
  };

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>

      <div className="add-employee-form">
        <input
          type="text"
          value={newEmployeeName}
          onChange={(e) => setNewEmployeeName(e.target.value)}
          placeholder="Enter employee name"
        />
        <input
          type="number"
          value={newEmployeeSalary}
          onChange={(e) => setNewEmployeeSalary(e.target.value)}
          placeholder="Enter salary"
        />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>

      <div className="employee-list">
        <h3>Employees</h3>
        <table className="employees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.salary}</td>
                <td className={`status-${employee.status}`}>{employee.status}</td>
                <td>
                  {employee.status === 'absent' && (
                    <button onClick={() => handleMarkPresent(employee.id)}>Mark Present</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination 
          currentPage={currentEmployeePage} 
          setCurrentPage={setCurrentEmployeePage} 
          totalItems={employees.length} 
        />
      </div>

      {attendanceForTheDay.length > 0 && (
        <div className="group-image-upload">
          <label htmlFor="group-image-upload">Upload Group Image for Present Employees:</label>
          <input id="group-image-upload" type="file" accept="image/*" onChange={handleGroupImageUpload} />
          {groupImage && (
            <div className="preview-image">
              <img src={groupImage} alt="Group preview" className="preview-group-image" />
            </div>
          )}
        </div>
      )}

      <div className="attendance-report">
        <h3>Attendance Report</h3>
        {attendanceForTheDay.length > 0 ? (
          <>
            <button onClick={handleAddAttendanceForTheDay}>Finalize Today's Attendance</button>
            <h4>Today's Attendance ({attendanceDate})</h4>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.name}</td>
                    <td>{record.salary}</td>
                    <td className={`status-${record.status}`}>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination 
              currentPage={currentAttendancePage} 
              setCurrentPage={setCurrentAttendancePage} 
              totalItems={attendanceForTheDay.length} 
            />
          </>
        ) : (
          <p>No attendance marked for today. Mark employees as present first.</p>
        )}
      </div>

      {finalizedAttendance.length > 0 && (
        <div className="finalized-attendance">
          <h3>Finalized Attendance Records</h3>
          {currentDates.map(date => {
            const recordsForDate = finalizedAttendance.filter(record => record.date === date);
            const groupImageForDate = recordsForDate[0]?.image;
            return (
              <div key={date} className="attendance-date-section">
                <h4>Date: {date}</h4>
                {groupImageForDate && (
                  <div className="group-photo-container">
                    <img src={groupImageForDate} alt={`Group on ${date}`} className="group-image" />
                  </div>
                )}
                <table className="finalized-attendance-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Salary</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recordsForDate.slice(0, 10).map((record, index) => (
                      <tr key={`${record.id}-${index}`}>
                        <td>{record.name}</td>
                        <td>{record.salary}</td>
                        <td className={`status-${record.status}`}>{record.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
          <Pagination 
            currentPage={currentFinalizedPage} 
            setCurrentPage={setCurrentFinalizedPage} 
            totalItems={uniqueDates.length} 
          />
        </div>
      )}
    </div>
  );
};

export default Employees;
