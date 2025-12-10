import { useState } from "react";
import "./css/passwordchangemodal.css";

const PasswordChangeModal = ({ onClose, storeIdx }) => {
  const [step, setStep] = useState(1); // 1: 현재 비밀번호 확인, 2: 새 비밀번호 입력
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // 현재 비밀번호 확인
  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // TODO: 실제 API 엔드포인트로 교체 필요
      const response = await fetch(`http://localhost:8080/api/store/verify-password`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeIdx: storeIdx,
          password: currentPassword,
        }),
      });

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

    // 비밀번호 유효성 검사
    if (newPassword.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
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
      // TODO: 실제 API 엔드포인트로 교체 필요
      const response = await fetch(`http://localhost:8080/api/store/change-password`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeIdx: storeIdx,
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

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
    <div className="pwd-change-backdrop" onClick={onClose}>
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

              {error && <div className="pwd-change-error">{error}</div>}

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
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요 (최소 8자)"
                  required
                  autoFocus
                />
              </div>

              <div className="pwd-change-field">
                <label>새 비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  required
                />
              </div>

              <div className="pwd-change-info">
                * 비밀번호는 최소 8자 이상이어야 합니다.
              </div>

              {error && <div className="pwd-change-error">{error}</div>}

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
