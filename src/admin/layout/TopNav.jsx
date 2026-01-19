import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './css/topnav.css';
import AdminAlarmModal from './modal/AdminAlarmModal';

const TopNav = ({ toggleSidebar, isSidebarOpen }) => {
  const { admin, adminLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 알람 데이터 (실제로는 서버에서 가져오거나 상태 관리)
  const [alarms] = useState([]);
  const hasAlarms = alarms.length > 0;
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await adminLogout();
      navigate('/admin/login');
    }
  };

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
        <li className="nav-item admin-topnav-alarm-item">
          <button 
            className="nav-link admin-topnav-alarm-btn"
            onClick={() => setIsAlarmModalOpen(!isAlarmModalOpen)}
          >
            <i className="fa-regular fa-alarm-clock fa-fw admin-topnav-i"></i>
            {hasAlarms && <span className="admin-topnav-alarm-badge"></span>}
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
            <li className='dropdown-info'>
              <span className="dropdown-user">{admin?.empNm || '관리자'}님</span>
              &nbsp;
              <span className='dropdown-text'>환영합니다!</span>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button 
                className="dropdown-item" 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default TopNav;