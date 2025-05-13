import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create context
const DailyReportContext = createContext();

// Hook to use the context
export const useDailyReport = () => useContext(DailyReportContext);

// Provider component
export const DailyReportProvider = ({ children }) => {
  const [dailyReports, setDailyReports] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dailyReports');
      const parsed = stored ? JSON.parse(stored) : [];
      setDailyReports(parsed);
    } catch (error) {
      console.error('Error loading daily reports from localStorage:', error);
      setDailyReports([]);
    }
  }, []);

  const addDailyReport = useCallback((report) => {
    setDailyReports(prev => {
      const updated = [...prev, report];
      localStorage.setItem('dailyReports', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <DailyReportContext.Provider value={{ dailyReports, addDailyReport }}>
      {children}
    </DailyReportContext.Provider>
  );
};
