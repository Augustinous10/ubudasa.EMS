// Updated App.js
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { PayrollProvider } from './context/PayrollContext';
import './styles/global.css';

function App() {
  // No need to define onMarkAttendance here anymore
  // The functionality is now in the AttendanceContext

  return (
    <Router>
      <AuthProvider>
        <EmployeeProvider>
          <AttendanceProvider>
            <PayrollProvider>
              {/* No need to pass onMarkAttendance here */}
              <AppRoutes />
            </PayrollProvider>
          </AttendanceProvider>
        </EmployeeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;