import { useState } from "react";
import "./css/withdrawalpasswordmodal.css";

const WithdrawalPasswordModal = ({ onClose, onPasswordVerified, storeIdx }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 확인
  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/store/verify-password`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeIdx: storeIdx,
          password: password,
        }),
      });

      if (!response.ok) {
        alert("비밀번호가 올바르지 않습니다.");
        setError("비밀번호가 올바르지 않습니다.");
        setIsLoading(false);
        return;
      }

      // 비밀번호가 일치하면 다음 모달로 이동
      onPasswordVerified();
    } catch (error) {
      console.error("Error verifying password:", error);
      alert("비밀번호 확인 중 오류가 발생했습니다.");
      setError("비밀번호 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="withdrawal-password-modal-overlay" onClick={onClose}>
      <div className="withdrawal-password-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="withdrawal-password-modal-header">
          <h2>비밀번호 확인</h2>
          <button className="withdrawal-password-modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleVerifyPassword}>
          <div className="withdrawal-password-modal-body">
            <p className="withdrawal-password-modal-description">
              회원 탈퇴를 진행하기 위해 비밀번호를 입력해주세요.
            </p>

            <div className="withdrawal-password-modal-input-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                disabled={isLoading}
              />
              {error && <span className="withdrawal-password-modal-error">{error}</span>}
            </div>
          </div>

          <div className="withdrawal-password-modal-footer">
            <button
              type="submit"
              className="withdrawal-password-modal-btn withdrawal-password-modal-confirm-btn"
              disabled={isLoading || !password}
            >
              {isLoading ? "확인 중..." : "확인"}
            </button>
            <button
              type="button"
              className="withdrawal-password-modal-btn withdrawal-password-modal-cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalPasswordModal;
