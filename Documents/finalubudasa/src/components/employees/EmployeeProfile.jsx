import './employee-profile.css';

const EmployeeProfile = ({ employee }) => {
  if (!employee) return <p>Employee not found.</p>;

  return (
    <div className="employee-profile">
      <h2>{employee.name}</h2>
      <p><strong>Position:</strong> {employee.position}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Joined:</strong> {employee.joinedDate || 'N/A'}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default EmployeeProfile;
