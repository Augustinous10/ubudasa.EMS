import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { PayrollProvider } from './context/PayrollContext';
import { DailyReportProvider } from './context/DailyReportContext';
import { SiteManagerProvider } from './context/SiteManagerContext'; // ✅ Site Manager Context

import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <EmployeeProvider>
          <AttendanceProvider>
            <PayrollProvider>
              <DailyReportProvider>
                <SiteManagerProvider> {/* ✅ Wrap AppRoutes with SiteManagerProvider */}
                  <AppRoutes />
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
