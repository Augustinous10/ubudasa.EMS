import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { PayrollProvider } from './context/PayrollContext';
import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <EmployeeProvider>
          <AttendanceProvider>
            <PayrollProvider>
              <AppRoutes />
            </PayrollProvider>
          </AttendanceProvider>
        </EmployeeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
