import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleOverlayClick = () => {
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  };

  // 화면 크기 변경 감지하여 사이드바 상태 초기화
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  return (
    <div className={`admin-sb-nav-fixed ${isSidebarOpen ? 'admin-sidebar-open' : ''}`}>
      <TopNav toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      {/* 오버레이 */}
      <div 
        className={`admin-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={handleOverlayClick}
      ></div>
      <div id="admin-layoutSidenav">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        <div id="admin-layoutSidenav_content">
          <main>
            <div>
              <Outlet />
            </div>
          </main>
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copyright; 동네방네 2025</div>
                <div>
                  <a href="#!">Privacy Policy</a>
                  &middot;
                  <a href="#!">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;