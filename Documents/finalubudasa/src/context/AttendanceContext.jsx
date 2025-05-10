// AttendanceContext.js
import { createContext, useContext, useState, useEffect } from 'react';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      // Mock data
      const mockData = [
        {
          id: 1,
          date: '2025-05-01',
          employeesPresent: [1, 2],
          notes: 'All employees arrived on time.',
          images: ['image1.jpg', 'image2.jpg']
        },
        {
          id: 2,
          date: '2025-05-02',
          employeesPresent: [2, 3],
          notes: 'One employee was late.',
          images: []
        }
      ];

      setAttendanceRecords(mockData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch attendance');
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider value={{ attendanceRecords, loading, error }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};