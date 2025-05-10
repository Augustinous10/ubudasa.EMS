import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { Outlet } from 'react-router-dom';

import './main-layout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <div className="content-wrapper">
        <div className="sidebar">
          <Sidebar />
        </div>
        <main className="main-content">
          <Outlet /> {/* <-- This is where routed pages will appear */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
