import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { PayrollProvider } from './context/PayrollContext';
import { DailyReportProvider } from './context/DailyReportContext';
import { SiteManagerProvider } from './context/SiteManagerContext';
import { SiteProvider } from './context/SiteContext';  // <-- import SiteProvider here

import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <EmployeeProvider>
          <AttendanceProvider>
            <PayrollProvider>
              <DailyReportProvider>
                <SiteManagerProvider>
                  <SiteProvider> {/* <-- Wrap here */}
                    <AppRoutes />
                  </SiteProvider>
                </SiteManagerProvider>
              </DailyReportProvider>
            </PayrollProvider>
          </AttendanceProvider>
        </EmployeeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
