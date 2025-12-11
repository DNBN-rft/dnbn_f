import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import StoreAlarmModal from './modal/StoreAlarmModal';
import './css/topnav.css';

const TopNav = () => {
  const [alarms, setAlarms] = useState([]);
  const hasAlarms = alarms.length > 0;
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
        <li className="nav-item" style={{ position: 'relative' }}>
          <button 
            className="nav-link" 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsAlarmModalOpen(!isAlarmModalOpen)}
          >
            <i className={`${hasAlarms ? 'fa-solid' : 'fa-regular'} fa-alarm-clock fa-fw topnav-i`}></i>
          </button>
          {isAlarmModalOpen && <StoreAlarmModal onClose={() => setIsAlarmModalOpen(false)} />}
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
            <i className="fas fa-user fa-fw topnav-i"></i>
          </a>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li className='dropdown-info'>
              <span className="dropdown-user">{user?.memberNm || '사용자'}님</span>
              &nbsp;
              <span className='dropdown-text'>환영합니다!</span>
            </li>
            <li><a className="dropdown-item" href="/store/mypage">내정보</a></li>
            <li><a className="dropdown-item" href="/store/dashboard">멤버쉽</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button 
                className="dropdown-item" 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
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