import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import './css/layout.css';

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
          <footer className="admin-site-footer">
            <div className="admin-footer-inner">
              {/* 좌측: 로고 영역 */}
              <div className="admin-footer-logo-area">
                <div className="admin-footer-logos">
                  <div className="admin-footer-logo-group">
                    <img src="/images/neoclue.png" alt="네오클루" className="admin-footer-logo-neoclue" />
                    <img src="/images/neoclue_text.png" alt="네오클루 텍스트" className="admin-footer-logo-neoclue-text" />
                  </div>
                  <img src="/images/logo_v2_white.png" alt="동네방네" className="admin-footer-logo-dnbn" />
                </div>
              </div>

              {/* 중앙: 회사 정보 */}
              <div className="admin-footer-info">
                <p className="admin-footer-company-name">네오클루주식회사</p>
                <p>대전광역시 서구 대덕대로168번길 82, 202호(갈마동, 웰리움)</p>
                <p>사업자등록번호 : 537-88-01571 &nbsp;|&nbsp; 통신판매업신고 : 제2025-대전대덕-0160호</p>
                <p>대표자 : 홍성환 &nbsp;|&nbsp; 개인정보관리책임자 : 홍성환</p>
                <p>부서 : 개인정보보호팀 &nbsp;|&nbsp; 연락처 : 042-710-7322 &nbsp;|&nbsp; 이메일 : sky9040@neoclue.com</p>
              </div>

              {/* 우측: 고객지원센터 + 링크 */}
              <div className="admin-footer-right">
                <div className="admin-footer-support">
                  <p className="admin-footer-support-label">고객지원센터</p>
                  <p className="admin-footer-support-number">1544-8576</p>
                </div>
                <div className="admin-footer-links">
                  <a href="#!">개인정보처리방침</a>
                  <span className="admin-footer-divider">|</span>
                  <a href="#!">이용약관</a>
                  <span className="admin-footer-divider">|</span>
                  <a href="#!">사업자 정보확인</a>
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