import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/layout.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [isStaticOpen, setIsStaticOpen] = useState(false);
  const [isCustOpen, setIsCustOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [isSystemOpen, setIsSystemOpen] = useState(false);

  const handleLinkClick = () => {
    if (window.innerWidth < 992) {
      closeSidebar();
    }
  };

  return (
    <div id="admin-layoutSidenav_nav" className={isOpen ? 'admin-sidebar-visible' : ''}>
      <nav
        className="admin-sb-sidenav accordion admin-sb-sidenav-dark"
        id="sidenavAccordion"
      >
        <div className="admin-side-logo">
        <a className="navbar-brand" href="/admin">
          <img src="/images/logo_v2_white.png" alt="logo" className="admin-logo" />
        </a>
        </div>
        <div className="admin-sb-sidenav-menu">
          <div className="nav">
            <div className="admin-sb-sidenav-menu-heading">회원</div>
            <a
              className={`nav-link ${isCustOpen ? "active" : "collapsed"}`}
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                setIsCustOpen(!isCustOpen);
              }}
            >
              <div className="admin-sb-nav-link-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              회원관리
              <div className="admin-sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
            <div className={`collapse ${isCustOpen ? "show" : ""}`}>
              <nav className="admin-sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/admin/cust" onClick={handleLinkClick}>
                  일반
                </Link>
                <Link className="nav-link" to="/admin/store" onClick={handleLinkClick}>
                  가맹
                </Link>
              </nav>
            </div>

            <div className="admin-sb-sidenav-menu-heading">상품</div>
            <Link
              className={`nav-link ${
                location.pathname === "/admin/product" ? "active" : ""
              }`}
              to="/admin/product"
              onClick={handleLinkClick}
            >
              <div className="admin-sb-nav-link-icon">
                <i className="fas fa-box"></i>
              </div>
              상품관리
            </Link>

            <div className="admin-sb-sidenav-menu-heading">통계</div>
            <a
              className={`nav-link ${isStaticOpen ? "active" : "collapsed"}`}
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                setIsStaticOpen(!isStaticOpen);
              }}
            >
              <div className="admin-sb-nav-link-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              통계정보
              <div className="admin-sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
            <div className={`collapse ${isStaticOpen ? "show" : ""}`}>
              <nav className="admin-sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/admin/region" onClick={handleLinkClick}>
                  지역 통계
                </Link>
                {/* <Link className="nav-link" to="/admin/plan" onClick={handleLinkClick}>
                  구독 통계
                </Link>
                <Link className="nav-link" to="/admin/category" onClick={handleLinkClick}>
                  카테고리 통계
                </Link> */}
              </nav>
            </div>

            <div className="admin-sb-sidenav-menu-heading">리뷰</div>
            <Link className="nav-link" to="/admin/review" onClick={handleLinkClick}>
              <div className="admin-sb-nav-link-icon">
                <i className="fas fa-star"></i>
              </div>
              리뷰관리
            </Link>

            <div className="admin-sb-sidenav-menu-heading">직원</div>
            <Link
              className={`nav-link ${
                location.pathname === "/admin/emp" ? "active" : ""
              }`}
              to="/admin/emp"
              onClick={handleLinkClick}
            >
              <div className="admin-sb-nav-link-icon">
                <i className="fas fa-users"></i>
              </div>
              직원관리
            </Link>

            <div className="admin-sb-sidenav-menu-heading">알림/푸시</div>
            <a
              className={`nav-link ${isAlarmOpen ? "active" : "collapsed"}`}
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                setIsAlarmOpen(!isAlarmOpen);
              }}
            >
              <div className="admin-sb-nav-link-icon">
                <i className="fas fa-bell"></i>
              </div>
              알림/푸시정보
              <div className="admin-sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
            <div className={`collapse ${isAlarmOpen ? "show" : ""}`}>
              <nav className="admin-sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/admin/alarm" onClick={handleLinkClick}>
                  알림
                </Link>
                <Link className="nav-link" to="/admin/push" onClick={handleLinkClick}>
                  푸시
                </Link>
              </nav>
            </div>

            <div className="admin-sb-sidenav-menu-heading">고객센터</div>
            <a
              className={`nav-link ${
                isCustomerServiceOpen ? "active" : "collapsed"}`}
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                setIsCustomerServiceOpen(!isCustomerServiceOpen);
              }}
            >
              <div className="admin-sb-nav-link-icon">
                <i className="fas fa-headset"></i>
              </div>
              고객센터
              <div className="admin-sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
            <div className={`collapse ${isCustomerServiceOpen ? "show" : ""}`}>
              <nav className="admin-sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/admin/notice" onClick={handleLinkClick}>
                  공지사항
                </Link>
                <Link className="nav-link" to="/admin/question" onClick={handleLinkClick}>
                  문의
                </Link>
              </nav>
            </div>

            

            <div className="admin-sb-sidenav-menu-heading">시스템관리</div>
            <a
              className={`nav-link ${
                isSystemOpen ? "active" : "collapsed"}`}
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                setIsSystemOpen(!isSystemOpen);
              }}
            >
              <div className="admin-sb-nav-link-icon">
                <i className="fas fa-cogs"></i>
              </div>
              시스템관리
              <div className="admin-sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
            <div className={`collapse ${isSystemOpen ? "show" : ""}`}>
              <nav className="admin-sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/admin/accept" onClick={handleLinkClick}>
                  가입관리
                </Link>
                <Link className="nav-link" to="/admin/categorymanage" onClick={handleLinkClick}>
                  카테고리관리
                </Link>
                <Link className="nav-link" to="/admin/authmanage" onClick={handleLinkClick}>
                  권한관리
                </Link>
              </nav>
            </div>

            <div className="admin-sb-sidenav-menu-heading">정산</div>
            <Link
              className={`nav-link ${
                location.pathname === "/admin/payout" ? "active" : ""
              }`}
              to="/admin/payout"
              onClick={handleLinkClick}
            >
              <div className="admin-sb-nav-link-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              정산관리
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
