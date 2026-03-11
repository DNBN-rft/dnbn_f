import "./css/custwithdrawal.css";
import { useState } from "react";
import { apiPost } from "../utils/apiClient";
import PhoneVerifyModal from "./modal/PhoneVerifyModal";

const CustWithdrawal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [custCode, setCustCode] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleCapsLockCheck = (e) => {
    const capsLockOn = e.getModifierState("CapsLock");
    setIsCapsLockOn(capsLockOn);
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiPost("/cust/web/check", { id: username, password });
      if (response.ok) {
        const data = await response.json();
        setCustCode(data.custCode);
        setShowModal(true);
      } else {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.message || "아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      setErrorMessage("서버 요청 중 오류가 발생했습니다.");
    }

    setIsLoading(false);
  };

  return (
    <>
    <div className="custwithdrawal-container">
      <div className="custwithdrawal-wrap">
        <div className="custwithdrawal-logo">
          <a href="/">
            <img src="/images/logo_v2.png" alt="Logo" className="custwithdrawal-img" />
          </a>
        </div>
        <p className="custwithdrawal-title">회원탈퇴</p>
        <p className="custwithdrawal-info">탈퇴하실 아이디와 비밀번호를 입력해주세요.</p>

        <div className="custwithdrawal-fm">
          <form onSubmit={handleWithdrawal}>
            <div className="custwithdrawal-form">
              <div className="custwithdrawal-input-group">
                <div className="custwithdrawal-id-img">
                  <i className="ri-user-line"></i>
                </div>
                <input
                  type="text"
                  className="custwithdrawal-input"
                  name="username"
                  placeholder="아이디"
                  value={username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div className="custwithdrawal-input-group">
                <div className="custwithdrawal-pw-img">
                  <i className="ri-lock-line"></i>
                </div>
                <input
                  type="password"
                  className="custwithdrawal-input"
                  name="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={handleInputChange}
                  onKeyDown={handleCapsLockCheck}
                  onKeyUp={handleCapsLockCheck}
                  disabled={isLoading}
                />
              </div>
              <div className="custwithdrawal-capslock">
                {isCapsLockOn && (
                  <><i className="ri-error-warning-line"></i> Caps Lock이 켜져있습니다.</>
                )}
              </div>
            </div>
            {errorMessage && (
              <div className="custwithdrawal-error">
                {errorMessage}
              </div>
            )}
            <div className="custwithdrawal-btn">
              <button
                type="submit"
                className="custwithdrawal-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "회원탈퇴"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    {showModal && (
      <PhoneVerifyModal
        custCode={custCode}
        onClose={() => setShowModal(false)}
        onVerified={() => {
          setShowModal(false);
          // TODO: 탈퇴 완료 후 처리 (예: 완료 안내 페이지 이동)
        }}
      />
    )}
    </>
  );
};

export default CustWithdrawal;