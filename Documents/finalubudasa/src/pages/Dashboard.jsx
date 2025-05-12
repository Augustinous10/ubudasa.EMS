import Card from '../components/common/Card';
import { useEmployee } from '../context/EmployeeContext'; // ✅ Fixed import
import { useAttendance } from '../context/AttendanceContext';
import { usePayroll } from '../context/PayrollContext';

import '../pages/dashboard.css';

const Dashboard = () => {
  const { employees = [] } = useEmployee(); // ✅ Fixed usage
  const { records = [] } = useAttendance() || {};
  const { payrolls = [] } = usePayroll() || {};

  const totalPayroll = payrolls.reduce((sum, p) => sum + Number(p.salary || 0), 0);

  return (
    <>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <Card title="Total Employees" value={employees.length} color="#3366ff" />
        <Card title="Attendance Records" value={records.length} color="#00b894" />
        <Card title="Total Payroll Paid" value={`${totalPayroll} RWF`} color="#e17055" />
      </div>
    </>
  );
};

export default Dashboard;
