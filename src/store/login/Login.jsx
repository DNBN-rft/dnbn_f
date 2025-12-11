import "../login/css/login.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { login } from "../../utils/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
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
    if (!username.trim()) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    const result = await login(username, password);

    if (result.success) {
      console.log("로그인 성공:", result.data);
      
      // AuthContext에 사용자 정보 저장
      setAuthState({
        memberNm: result.data.memberNm,
        storeCode: result.data.storeCode,
        planNm: result.data.planNm
      });

      // 대시보드로 이동
      navigate("/store/dashboard");
    } else {
      setErrorMessage(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-wrap">
        <div className="login-logo">
          <a href="/store/dashboard">
            <img src="/images/logo_v2.png" alt="Logo" className="login-img" />
          </a>
        </div>
        <p className="login-title">통합로그인</p>
        <p className="login-info">동네방네에 오신걸 환영합니다!</p>

        <div className="loginfm">
          <form onSubmit={handleLogin}>
            <div className="login-form">
              <div className="login-input-group">
                <div className="login-id-img">
                  <i className="ri-user-line"></i>
                </div>
                <input
                  type="text"
                  className="login-input"
                  name="username"
                  placeholder="아이디"
                  value={username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div className="login-input-group">
                <div className="login-pw-img">
                  <i className="ri-lock-line"></i>
                </div>
                <input
                  type="password"
                  className="login-input"
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
            <div className="login-btn">
              <button 
                type="submit" 
                className="btn goLogin"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </div>
            <div className="login-signin">
              <a href="/store/register" className="signin-link">
                회원이 아니신가요?&nbsp;
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
