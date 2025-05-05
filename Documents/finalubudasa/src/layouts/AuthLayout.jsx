import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
