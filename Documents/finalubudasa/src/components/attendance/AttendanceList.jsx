import { useAttendance } from '../../context/AttendanceContext';
import './attendance-list.css';

const AttendanceList = () => {
  const { records } = useAttendance();

  return (
    <div className="attendance-list">
      <h3>Attendance Records</h3>
      <ul>
        {records.map((rec) => (
          <li key={rec.id}>
            {rec.name} – {rec.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceList;
