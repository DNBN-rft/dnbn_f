import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import StoreAlarmModal from './modal/StoreAlarmModal';
import { useAlarmList } from '../../hooks/useAlarm';
import './css/topnav.css';

const TopNav = () => {
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: alarmData = [] } = useAlarmList(user?.memberId);
  const hasUnreadAlarms = alarmData.some(alarm => alarm.readDateTime === null);

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await logout();
      navigate('/store/login');
    }
  };

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark topnav-custom">
      <div className="ms-auto"></div>
      {/* Navbar*/}
      <ul className="navbar-nav ms-md-0 me-3 me-lg-4">
        <li className="nav-item topnav-alarm-item">
          <button 
            className="nav-link topnav-alarm-btn" 
            onClick={() => setIsAlarmModalOpen(!isAlarmModalOpen)}
          >
            <i className="fa-regular fa-alarm-clock fa-fw topnav-i"></i>
            {hasUnreadAlarms && <span className="topnav-alarm-badge"></span>}
          </button>
          {isAlarmModalOpen && <StoreAlarmModal onClose={() => setIsAlarmModalOpen(false)} />}
        </li>
        <li className="nav-item dropdown">
          <a 
            className="nav-link dropdown-toggle topnav-dropdown-toggle" 
            id="navbarDropdown" 
            href="/" 
            role="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw topnav-i"></i>
          </a>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li className='dropdown-info'>
              <span className="dropdown-user">{user?.memberNm || '사용자'}님</span>
              &nbsp;
              <span className='dropdown-text'>환영합니다!</span>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item topnav-dropdown-item" href="/store/mypage">내정보</a></li>
            <li><a className="dropdown-item topnav-dropdown-item" href="/store/plan">요금제</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button 
                className="dropdown-item topnav-dropdown-item topnav-logout-btn" 
                onClick={handleLogout}
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