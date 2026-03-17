import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import './css/layout.css';

const Layout = () => {
  useEffect(() => {
    // Sidebar toggle
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', event => {
        event.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
      });
    }
  }, []);

  return (
    <div className="sb-nav-fixed">
      <TopNav />
      <div id="layoutSidenav">
        <Sidebar />
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <Outlet />
            </div>
          </main>
          <footer className="site-footer">
            <div className="footer-inner">
              {/* 좌측: 로고 영역 */}
              <div className="footer-logo-area">
                <div className="footer-logos">
                  <div className="footer-logo-group">
                    <img src="/images/neoclue.png" alt="네오클루" className="footer-logo-neoclue" />
                    <img src="/images/neoclue_text.png" alt="네오클루 텍스트" className="footer-logo-neoclue-text" />
                  </div>
                  <img src="/images/logo_v2_white.png" alt="동네방네" className="footer-logo-dnbn" />
                </div>
              </div>

              {/* 중앙: 회사 정보 */}
              <div className="footer-info">
                <p className="footer-company-name">네오클루주식회사</p>
                <p>대전광역시 서구 대덕대로168번길 82, 202호(갈마동, 웰리움)</p>
                <p>사업자등록번호 : 537-88-01571 &nbsp;|&nbsp; 통신판매업신고 : 제2025-대전대덕-0160호</p>
                <p>대표자 : 홍성환 &nbsp;|&nbsp; 개인정보관리책임자 : 홍성환</p>
                <p>부서 : 개인정보보호팀 &nbsp;|&nbsp; 연락처 : 042-710-7322 &nbsp;|&nbsp; 이메일 : sky9040@neoclue.com</p>
              </div>

              {/* 우측: 고객지원센터 + 링크 */}
              <div className="footer-right">
                <div className="footer-support">
                  <p className="footer-support-label">고객지원센터</p>
                  <p className="footer-support-number">1544-8576</p>
                </div>
                <div className="footer-links">
                  <a href="#!">개인정보처리방침</a>
                  <span className="footer-divider">|</span>
                  <a href="#!">이용약관</a>
                  <span className="footer-divider">|</span>
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