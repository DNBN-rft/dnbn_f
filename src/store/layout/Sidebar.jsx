import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/layout.css";

const Sidebar = () => {
  const location = useLocation();
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const menuAuth = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.menuAuth || [];
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return [];
    }
  }, []);

  const hasPermission = (code) => {
    return menuAuth.includes(code);
  };
  return (
    <div id="layoutSidenav_nav">
      <nav
        className="sb-sidenav accordion sb-sidenav-dark"
        id="sidenavAccordion"
      >
        <div className="side-logo">
        <a className="navbar-brand" href="/store/plan">
          <img src="/images/logo_v2_white.png" alt="logo" className="logo" />
        </a>
        </div>
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">메인</div>
            <Link className="nav-link" to="/store/dashboard">
              <div className="sb-nav-link-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              대시보드
            </Link>

            {/* 마이페이지 */}
            {hasPermission("STORE_MYPAGE") && (
              <>
                <div className="sb-sidenav-menu-heading">내 정보</div>
                <Link className="nav-link" to="/store/mypage">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  마이페이지
                </Link>
              </>
            )}

            {/* 상품 관리 */}
            {hasPermission("STORE_PRODUCT") && (
              <>
                <div className="sb-sidenav-menu-heading">상품</div>
                <a
                  className={`nav-link ${isProductOpen ? "active" : "collapsed"}`}
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsProductOpen(!isProductOpen);
                  }}
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-box"></i>
                  </div>
                  상품
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div className={`collapse ${isProductOpen ? "show" : ""}`}>
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link className="nav-link" to="/store/product">
                      일반상품
                    </Link>
                    {hasPermission("STORE_SALE") && (
                      <Link className="nav-link" to="/store/sale">
                        할인
                      </Link>
                    )}
                    {hasPermission("STORE_NEGOTIATION") && (
                      <Link className="nav-link" to="/store/negotiation">
                        네고
                      </Link>
                    )}
                  </nav>
                </div>
              </>
            )}

            {/* 이력 */}
            {(hasPermission("STORE_SALE") || hasPermission("STORE_NEGOTIATION")) && (
              <>
                <div className="sb-sidenav-menu-heading">이력</div>
                <a
                  className={`nav-link ${isHistoryOpen ? "active" : "collapsed"}`}
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHistoryOpen(!isHistoryOpen);
                  }}
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-history"></i>
                  </div>
                  이력
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div className={`collapse ${isHistoryOpen ? "show" : ""}`}>
                  <nav className="sb-sidenav-menu-nested nav">

                    {hasPermission("STORE_SALE") && (
                      <Link className="nav-link" to="/store/sale/history">
                        할인
                      </Link>
                    )}
                    {hasPermission("STORE_NEGOTIATION") && (
                      <Link className="nav-link" to="/store/negotiation/history">
                        네고
                      </Link>
                    )}
                  </nav>
                </div>
              </>
            )}

            {/* 리뷰 관리 */}
            {hasPermission("STORE_REVIEW") && (
              <>
                <div className="sb-sidenav-menu-heading">리뷰</div>
                <Link className="nav-link" to="/store/review">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  리뷰관리
                </Link>
              </>
            )}

            {/* 매출/주문 관리 */}
            {(hasPermission("STORE_ORDER") || hasPermission("STORE_STATIC")) && (
              <>
                <div className="sb-sidenav-menu-heading">매출</div>
                <a
                  className={`nav-link ${isSalesOpen ? "active" : "collapsed"}`}
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSalesOpen(!isSalesOpen);
                  }}
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  매출
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div className={`collapse ${isSalesOpen ? "show" : ""}`}>
                  <nav className="sb-sidenav-menu-nested nav">
                    {hasPermission("STORE_ORDER") && (
                      <Link className="nav-link" to="/store/orderlist">
                        매출목록
                      </Link>
                    )}
                    {hasPermission("STORE_STATIC") && (
                      <Link className="nav-link" to="/store/orderstatic">
                        매출통계
                      </Link>
                    )}
                  </nav>
                </div>
              </>
            )}

            {/* 직원 관리 */}
            {hasPermission("STORE_MEMBER") && (
              <>
                <div className="sb-sidenav-menu-heading">직원</div>
                <Link
                  className={`nav-link ${
                    location.pathname === "/store/employeemanage" ? "active" : ""
                  }`}
                  to="/store/employeemanage"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  직원관리
                </Link>
              </>
            )}

            {/* 고객센터 */}
            {(hasPermission("STORE_NOTICE") || hasPermission("STORE_QUESTION")) && (
              <>
                <div className="sb-sidenav-menu-heading">고객센터</div>
                <a
                  className={`nav-link ${
                    isCustomerServiceOpen ? "active" : "collapsed"}`}
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsCustomerServiceOpen(!isCustomerServiceOpen);
                  }}
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-headset"></i>
                  </div>
                  고객센터
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div className={`collapse ${isCustomerServiceOpen ? "show" : ""}`}>
                  <nav className="sb-sidenav-menu-nested nav">
                    {hasPermission("STORE_NOTICE") && (
                      <Link className="nav-link" to="/store/notices">
                        공지사항
                      </Link>
                    )}
                    {hasPermission("STORE_QUESTION") && (
                      <Link className="nav-link" to="/store/faq">
                        문의
                      </Link>
                    )}
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
