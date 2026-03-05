import { useState } from "react";
import "./css/passwordchangemodal.css";
import { apiPost, apiPut } from "../../../utils/apiClient";
import { getPasswordCheckMessage, restrictPassword } from "../../../utils/registerValidation";

const PasswordChangeModal = ({ onClose, storeIdx }) => {
  const [step, setStep] = useState(1); // 1: 현재 비밀번호 확인, 2: 새 비밀번호 입력
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [error, setError] = useState("");

  const handleNewPasswordChange = (value) => {
    const restrictedValue = restrictPassword(value);
    setNewPassword(restrictedValue);

    const { status } = getPasswordCheckMessage(restrictedValue);
    if (status === "success") {
      setPasswordCheckMessage("");
    } else if (restrictedValue) {
      setPasswordCheckMessage("양식이 올바르지 않습니다.");
    } else {
      setPasswordCheckMessage("");
    }

    if (confirmPassword) {
      setPasswordConfirmMessage(
        restrictedValue === confirmPassword ? "" : "비밀번호가 일치하지 않습니다."
      );
    }
  };

  const handleConfirmPasswordChange = (value) => {
    const restrictedValue = restrictPassword(value);
    setConfirmPassword(restrictedValue);

    if (restrictedValue) {
      setPasswordConfirmMessage(
        newPassword === restrictedValue ? "" : "비밀번호가 일치하지 않습니다."
      );
    } else {
      setPasswordConfirmMessage("");
    }
  };

  // 현재 비밀번호 확인
  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // PasswordRequest DTO로 비밀번호 확인 API 호출
      const response = await apiPost(`/store/password`, { password: currentPassword });

      if (!response.ok) {
        setError("현재 비밀번호가 일치하지 않습니다.");
        return;
      }

      // 비밀번호가 일치하면 다음 단계로
      setStep(2);
      setError("");
    } catch (error) {
      console.error("Error verifying password:", error);
      setError("비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  // 새 비밀번호로 변경
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");

    const { status } = getPasswordCheckMessage(newPassword);
    if (status !== "success") {
      setError("비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.");
      return;
    }

    try {
      const response = await apiPut(`/store/password-change`, { password: newPassword });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      alert("비밀번호가 성공적으로 변경되었습니다.");
      onClose();
    } catch (error) {
      console.error("Error changing password:", error);
      setError("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="pwd-change-backdrop">
      <div className="pwd-change-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="pwd-change-header">
          비밀번호 변경
        </div>

        <div className="pwd-change-contents">
          {step === 1 ? (
            // Step 1: 현재 비밀번호 확인
            <form onSubmit={handleVerifyPassword}>
              <div className="pwd-change-step-title">
                현재 비밀번호를 입력해주세요
              </div>

              <div className="pwd-change-field">
                <label>현재 비밀번호</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  required
                  autoFocus
                />
              </div>

              <div className="pwd-change-error-slot">
                {error && <div className="pwd-change-error">{error}</div>}
              </div>

              <div className="pwd-change-buttons">
                <button type="submit" className="pwd-change-submit-btn">
                  확인
                </button>
                <button 
                  type="button" 
                  className="pwd-change-cancel-btn"
                  onClick={onClose}
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            // Step 2: 새 비밀번호 입력
            <form onSubmit={handleChangePassword}>
              <div className="pwd-change-step-title">
                새 비밀번호를 입력해주세요
              </div>

              <div className="pwd-change-field">
                <label>새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => handleNewPasswordChange(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  required
                  autoFocus
                />
              </div>

              <div className="pwd-change-error-slot">
                {passwordCheckMessage && <div className="pwd-change-error">{passwordCheckMessage}</div>}
              </div>

              <div className="pwd-change-field">
                <label>새 비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  required
                />
              </div>

              <div className="pwd-change-error-slot">
                {passwordConfirmMessage && <div className="pwd-change-error">{passwordConfirmMessage}</div>}
              </div>

              <div className="pwd-change-info">
                * 영문 · 숫자 · 특수문자 포함 8~16자
              </div>

              <div className="pwd-change-error-slot">
                {error && <div className="pwd-change-error">{error}</div>}
              </div>

              <div className="pwd-change-buttons">
                <button type="submit" className="pwd-change-submit-btn">
                  변경
                </button>
                <button 
                  type="button" 
                  className="pwd-change-cancel-btn"
                  onClick={onClose}
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
