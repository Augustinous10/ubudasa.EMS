import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

import { AuthProvider } from './context/AuthContext';
import { PayrollProvider } from './context/PayrollContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { EmployeeProvider } from './context/EmployeeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PayrollProvider>
          <AttendanceProvider>
            <EmployeeProvider>
              <App />
            </EmployeeProvider>
          </AttendanceProvider>
        </PayrollProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
