import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

import './main-layout.css';


const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <div className="content-wrapper">
        <div className="sidebar">
          <Sidebar />
        </div>
        <main className="main-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
