import { useState } from 'react';
import './css/topnav.css';
import AdminAlarmModal from './modal/AdminAlarmModal';

const TopNav = ({ toggleSidebar, isSidebarOpen }) => {
  // 알람 데이터 (실제로는 서버에서 가져오거나 상태 관리)
  const [alarms, setAlarms] = useState([]);
  const hasAlarms = alarms.length > 0;
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  return (
    <nav className="admin-sb-topnav navbar navbar-expand navbar-dark admin-topnav-custom">
      <div className="admin-topnav-left-section">
        <a className="navbar-brand admin-topnav-logo" href="/admin">
          <img src="/images/logo_v2_white.png" alt="logo" />
        </a>
        <button 
          className="admin-hamburger-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      <div className="ms-auto"></div>
      {/* Navbar*/}
      <ul className="navbar-nav ms-md-0 me-3 me-lg-4">
        <li className="nav-item" style={{ position: 'relative' }}>
          <button 
            className="nav-link" 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsAlarmModalOpen(!isAlarmModalOpen)}
          >
            <i className={`${hasAlarms ? 'fa-solid' : 'fa-regular'} fa-alarm-clock fa-fw admin-topnav-i`}></i>
          </button>
          {isAlarmModalOpen && <AdminAlarmModal onClose={() => setIsAlarmModalOpen(false)} />}
        </li>
        <li className="nav-item dropdown">
          <a 
            className="nav-link dropdown-toggle" 
            id="navbarDropdown" 
            href="/" 
            role="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw admin-topnav-i"></i>
          </a>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li className='dropdown-info'><span className="dropdown-user"></span>&nbsp;<span className='dropdown-text'>환영합니다!</span></li>
            <li><a className="dropdown-item" href="/mypage">내정보</a></li>
            <li><a className="dropdown-item" href="/dashboard">멤버쉽</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="/admin/login">로그인</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default TopNav;