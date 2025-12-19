import { useState } from "react";
import "./css/adminemppw.css";
import { changeEmployeePassword } from "../../../utils/adminEmployeeService";

const AdminEmpPw = ({ onClose, employeeName, employeeId, onSuccess }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");

    // 비밀번호 유효성 검사
    if (newPassword.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      await changeEmployeePassword({
        empId: employeeId,
        newPw: newPassword
      });

      alert(`${employeeName} 직원의 비밀번호가 성공적으로 변경되었습니다.`);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.message || "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminemppw-backdrop">
      <div className="adminemppw-wrap">
        <div className="adminemppw-header">
          <span className="adminemppw-title">직원 비밀번호 변경</span>
          <button className="adminemppw-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="adminemppw-contents">
          <form onSubmit={handleChangePassword}>
            <div className="adminemppw-info">
              <div className="adminemppw-info-row">
                <span className="adminemppw-info-label">직원명:</span>
                <span className="adminemppw-info-value">{employeeName}</span>
              </div>
              <div className="adminemppw-info-row">
                <span className="adminemppw-info-label">아이디:</span>
                <span className="adminemppw-info-value">{employeeId}</span>
              </div>
            </div>

            <div className="adminemppw-field">
              <label>새 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요 (최소 8자)"
                required
                autoFocus
              />
              {newPassword && newPassword.length < 8 && (
                <div className="adminemppw-field-error">비밀번호는 최소 8자 이상이어야 합니다.</div>
              )}
            </div>

            <div className="adminemppw-field">
              <label>비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>

            <div className="adminemppw-notice">
              * 비밀번호는 최소 8자 이상이어야 합니다.
            </div>

            {error && <div className="adminemppw-error">{error}</div>}

            <div className="adminemppw-buttons">
              <button 
                type="submit" 
                className="adminemppw-submit-btn"
                disabled={loading}
              >
                {loading ? "변경 중..." : "변경"}
              </button>
              <button 
                type="button" 
                className="adminemppw-cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEmpPw;