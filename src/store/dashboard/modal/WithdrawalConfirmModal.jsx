import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/withdrawalconfirmmodal.css";
import { apiDelete } from "../../../utils/apiClient";

const WithdrawalConfirmModal = ({ onClose, storeIdx }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 회원 탈퇴 처리
  const handleWithdrawal = async () => {
    setIsLoading(true);

    try {
      const response = await apiDelete(`/store/withdrawal/${storeIdx}`);

      if (!response.ok) {
        alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
        setIsLoading(false);
        return;
      }

      // 탈퇴 성공 시 메인 페이지로 이동
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("Error during withdrawal:", error);
      alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="withdrawal-confirm-modal-overlay" onClick={onClose}>
      <div className="withdrawal-confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="withdrawal-confirm-modal-header">
          <h2>회원 탈퇴</h2>
          <button className="withdrawal-confirm-modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="withdrawal-confirm-modal-body">
          <div className="withdrawal-confirm-modal-warning">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="withdrawal-confirm-modal-warning-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>

          <h3 className="withdrawal-confirm-modal-title">정말로 탈퇴하시겠습니까?</h3>
          
          <div className="withdrawal-confirm-modal-description">
            <p>회원 탈퇴 시 다음 사항을 유의해 주세요:</p>
            <ul>
              <li>모든 회원 정보가 삭제됩니다.</li>
              <li>진행 중인 주문 및 거래 내역이 모두 삭제됩니다.</li>
              <li>멤버십 정보 및 결제 이력이 삭제됩니다.</li>
              <li>탈퇴 후에는 복구가 불가능합니다.</li>
            </ul>
          </div>
        </div>

        <div className="withdrawal-confirm-modal-footer">
          <button
            type="button"
            className="withdrawal-confirm-modal-btn withdrawal-confirm-modal-withdrawal-btn"
            onClick={handleWithdrawal}
            disabled={isLoading}
          >
            {isLoading ? "처리 중..." : "탈퇴"}
          </button>
          <button
            type="button"
            className="withdrawal-confirm-modal-btn withdrawal-confirm-modal-cancel-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalConfirmModal;
