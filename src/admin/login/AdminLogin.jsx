import "../login/css/adminlogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../utils/adminAuthService";

const AdminLogin = () => {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "empId") {
      setEmpId(value);
    } else if (name === "password") {
      setPassword(value);
    }
    // 입력 시 에러 메시지 제거
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 입력 검증
    if (!empId.trim()) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    const result = await adminLogin(empId, password);

    if (result.success) {
      
      // 관리자 대시보드로 이동
      navigate("/admin");
    } else {
      setErrorMessage(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="adminlogin-container">
      <div className="adminlogin-wrap">
        <div className="adminlogin-logo">
          <a href="/admin">
            <img src="/images/logo_v2_white.png" alt="Logo" className="adminlogin-img" />
          </a>
        </div>
        <p className="adminlogin-title">관리자 로그인</p>
        <p className="adminlogin-info">동네방네에 오신걸 환영합니다!</p>

        <div className="adminloginfm">
          <form onSubmit={handleLogin}>
            <div className="adminlogin-form">
              <div className="adminlogin-input-group">
                <div className="adminlogin-id-img">
                  <i className="ri-user-line"></i>
                </div>
                <input
                  type="text"
                  className="adminlogin-input"
                  name="empId"
                  placeholder="아이디"
                  value={empId}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div className="adminlogin-input-group">
                <div className="adminlogin-pw-img">
                  <i className="ri-lock-line"></i>
                </div>
                <input
                  type="password"
                  className="adminlogin-input"
                  name="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            {errorMessage && (
              <div style={{ color: "#ff0000", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>
                {errorMessage}
              </div>
            )}
            <div className="adminlogin-btn">
              <button 
                type="submit" 
                className="btn goadminlogin"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
