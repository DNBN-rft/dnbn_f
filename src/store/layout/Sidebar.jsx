import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/layout.css";

const Sidebar = () => {
  const location = useLocation();
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isNegoOpen, setIsNegoOpen] = useState(false);
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

            <div className="sb-sidenav-menu-heading">상품</div>
            <Link
              className={`nav-link ${
                location.pathname === "/store/product" ? "active" : ""
              }`}
              to="/store/product"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-box"></i>
              </div>
              상품등록/관리
            </Link>

            <div className="sb-sidenav-menu-heading">할인/네고</div>
            <a
              className={`nav-link ${isNegoOpen ? "active" : "collapsed"}`}
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                setIsNegoOpen(!isNegoOpen);
              }}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-percentage"></i>
              </div>
              할인/네고
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
            <div className={`collapse ${isNegoOpen ? "show" : ""}`}>
              <nav className="sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/store/sale">
                  할인목록
                </Link>
                <Link className="nav-link" to="/store/negotiation">
                  네고목록
                </Link>
              </nav>
            </div>

            <div className="sb-sidenav-menu-heading">리뷰</div>
            <Link className="nav-link" to="/store/review">
              <div className="sb-nav-link-icon">
                <i className="fas fa-star"></i>
              </div>
              리뷰관리
            </Link>

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
                <Link className="nav-link" to="/store/orderlist">
                  매출목록
                </Link>
                <Link className="nav-link" to="/store/orderstatic">
                  매출통계
                </Link>
              </nav>
            </div>

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
                <Link className="nav-link" to="/store/notices">
                  공지사항
                </Link>
                <Link className="nav-link" to="/store/faq">
                  문의
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;