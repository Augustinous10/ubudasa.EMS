import { createContext, useState, useEffect, useContext } from 'react';
import { useEmployees } from './EmployeeContext'; // Change to useEmployees

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { employees } = useEmployees(); // Use useEmployees hook to access employees
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employees.length > 0) {
      fetchAttendanceRecords();
    }
  }, [employees]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await attendanceService.getAllAttendance();
      
      // For development, using mock data
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const mockAttendance = [
        {
          id: 1,
          date: today.toISOString().split('T')[0],
          employeesPresent: [1, 2, 3],
          images: ['attendance-group-2023-05-01.jpg'],
          notes: 'All staff present'
        },
        {
          id: 2,
          date: yesterday.toISOString().split('T')[0],
          employeesPresent: [1, 3],
          images: ['attendance-group-2023-04-30.jpg'],
          notes: 'Jane Smith absent - called in sick'
        }
      ];
      
      setAttendanceRecords(mockAttendance);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch attendance records');
      setLoading(false);
      console.error('Error fetching attendance:', err);
    }
  };

  const addAttendanceRecord = async (attendanceData) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const newRecord = await attendanceService.createAttendanceRecord(attendanceData);
      
      // For development
      const newRecord = {
        id: attendanceRecords.length + 1,
        ...attendanceData
      };
      
      setAttendanceRecords([...attendanceRecords, newRecord]);
      setLoading(false);
      return newRecord;
    } catch (err) {
      setError('Failed to add attendance record');
      setLoading(false);
      console.error('Error adding attendance record:', err);
      throw err;
    }
  };

  const updateAttendanceRecord = async (id, attendanceData) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const updatedRecord = await attendanceService.updateAttendanceRecord(id, attendanceData);
      
      // For development
      const updatedRecords = attendanceRecords.map(record => 
        record.id === id ? { ...record, ...attendanceData } : record
      );
      
      setAttendanceRecords(updatedRecords);
      setLoading(false);
      return updatedRecords.find(record => record.id === id);
    } catch (err) {
      setError('Failed to update attendance record');
      setLoading(false);
      console.error('Error updating attendance record:', err);
      throw err;
    }
  };

  const deleteAttendanceRecord = async (id) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // await attendanceService.deleteAttendanceRecord(id);
      
      // For development
      const filteredRecords = attendanceRecords.filter(record => record.id !== id);
      setAttendanceRecords(filteredRecords);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Failed to delete attendance record');
      setLoading(false);
      console.error('Error deleting attendance record:', err);
      throw err;
    }
  };

  const uploadAttendanceImage = async (date, imageFile) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to upload the image
      // const imageUrl = await attendanceService.uploadImage(date, imageFile);
      
      // For development - simulating image upload
      const imageUrl = `attendance-${date}-${Math.floor(Math.random() * 1000)}.jpg`;
      
      // Find and update the record for this date
      const existingRecordIndex = attendanceRecords.findIndex(
        record => record.date === date
      );
      
      if (existingRecordIndex >= 0) {
        // Update existing record
        const updatedRecords = [...attendanceRecords];
        updatedRecords[existingRecordIndex] = {
          ...updatedRecords[existingRecordIndex],
          images: [...(updatedRecords[existingRecordIndex].images || []), imageUrl]
        };
        setAttendanceRecords(updatedRecords);
      }
      
      setLoading(false);
      return imageUrl;
    } catch (err) {
      setError('Failed to upload attendance image');
      setLoading(false);
      console.error('Error uploading attendance image:', err);
      throw err;
    }
  };

  const getAttendanceByDate = (date) => {
    return attendanceRecords.find(record => record.date === date) || null;
  };

  const getAttendanceByEmployee = (employeeId) => {
    return attendanceRecords.filter(record => 
      record.employeesPresent.includes(Number(employeeId))
    );
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        loading,
        error,
        fetchAttendanceRecords,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        uploadAttendanceImage,
        getAttendanceByDate,
        getAttendanceByEmployee
      }}
    >
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
