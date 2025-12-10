import { useState } from "react";
import { apiCall } from "../../../utils/apiClient";
import "./css/reasoninputmodal.css";

const ReasonInputModal = ({ type, onClose, onSubmit, orderDetailIdx, existingReason }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const cancelReasons = [
    "주문이 실수로 생성됨",
    "쿠폰을 적용하는 것을 잊었음",
    "상품이 제시간에 도착하지 않음",
    "결제 방법을 변경해야 함",
    "다른 곳에서 더 저렴하게 판매하는 것을 발견함",
    "상품 가격이 너무 높음",
    "배송 주소를 변경해야 함",
    "배송 유형 변경 필요"
  ];

  const refundReasons = [
    "주문이 실수로 생성됨",
    "쿠폰을 적용하는 것을 잊었음",
    "상품이 제시간에 도착하지 않음",
    "결제 방법을 변경해야 함",
    "다른 곳에서 더 저렴하게 판매하는 것을 발견함",
    "상품 가격이 너무 높음",
    "배송 주소를 변경해야 함",
    "배송 유형 변경 필요"
  ];

  const reasons = type === "cancel" ? cancelReasons : refundReasons;

  const handleSubmit = async () => {
    if (selectedReason === "") {
      alert("사유를 선택해주세요.");
      return;
    }
    if (selectedReason === "기타" && customReason.trim() === "") {
      alert("기타 사유를 입력해주세요.");
      return;
    }
    
    const finalReason = selectedReason === "기타" ? customReason : selectedReason;
    
    try {
      const response = await apiCall("/order/reason", {
        method: "PUT",
        body: JSON.stringify({
          orderDetailIdx: orderDetailIdx,
          reason: finalReason
        })
      });

      if (response.ok) {
        onSubmit(finalReason);
        alert("사유가 성공적으로 등록되었습니다.");
      } else {
        const errorData = await response.text();
        alert(errorData || "처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      alert("서버와의 연결에 실패했습니다.");
    }

  };  const handleWrapClick = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <div className="reason-modal-wrap" onClick={handleWrapClick}>
      <div className="reason-modal" onClick={(e) => e.stopPropagation()}>
        <button className="reason-modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="reason-modal-header">
          {type === "cancel" ? "취소 사유 선택" : "환불 사유 선택"}
        </div>

        <div className="reason-modal-content">
          <div className="reason-options">
            {reasons.map((reason, index) => (
              <label key={index} className="reason-option">
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => {
                    setSelectedReason(e.target.value);
                    setCustomReason("");
                  }}
                />
                <span>{reason}</span>
              </label>
            ))}
            <label className="reason-option">
              <input
                type="radio"
                name="reason"
                value="기타"
                checked={selectedReason === "기타"}
                onChange={(e) => setSelectedReason(e.target.value)}
              />
              <span>기타</span>
            </label>
          </div>

          {selectedReason === "기타" && (
            <div className="custom-reason-input">
              <textarea
                className="reason-textarea"
                placeholder="기타 사유를 입력해주세요"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                maxLength={500}
              />
              <div className="reason-char-count">
                {customReason.length} / 500
              </div>
            </div>
          )}
        </div>

        <div className="reason-modal-btn-group">
          <button className="reason-submit-btn" onClick={handleSubmit}>
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonInputModal;
