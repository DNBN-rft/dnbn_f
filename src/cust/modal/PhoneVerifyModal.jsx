import { useState, useEffect } from "react";
import "../css/phoneverifymodal.css";
import { apiPost } from "../../utils/apiClient";

const TIMER_SECONDS = 300;

const PhoneVerifyModal = ({ custCode, onClose, onVerified }) => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSendCode = async () => {
    if (!phone.trim()) {
      setErrorMessage("핸드폰 번호를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await apiPost("/cust/web/send", { custCode, phone });
      if (response.ok) {
        setIsSent(true);
        setTimer(TIMER_SECONDS);
      } else {
        setErrorMessage("인증번호 발송에 실패했습니다.");
      }
    } catch (error) {
      setErrorMessage("서버 요청 중 오류가 발생했습니다.");
    }
    setIsLoading(false);
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setErrorMessage("인증번호를 입력해주세요.");
      return;
    }
    if (timer <= 0) {
      setErrorMessage("인증 시간이 만료되었습니다. 다시 요청해주세요.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await apiPost("/cust/web/verify", { phone, code });
      if (response.ok) {
        setShowConfirm(true);
      } else {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.message || "인증에 실패했습니다. 인증번호를 확인해주세요.");
      }
    } catch (error) {
      setErrorMessage("서버 요청 중 오류가 발생했습니다.");
    }
    setIsLoading(false);
  };

  const handleConfirmWithdrawal = async () => {
    if (!reason) {
      setErrorMessage("탈퇴 사유를 선택해주세요.");
      return;
    }
    if (reason === "기타" && !customReason.trim()) {
      setErrorMessage("탈퇴 사유를 직접 입력해주세요.");
      return;
    }
    const finalReason = reason === "기타" ? customReason.trim() : reason;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await apiPost("/cust/web/withdraw", { custCode, reason: finalReason });
      if (response.ok) {
        alert("회원탈퇴가 완료되었습니다.");
        onVerified();
      } else {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.message || "탈퇴 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setErrorMessage("서버 요청 중 오류가 발생했습니다.");
    }
    setIsLoading(false);
  };

  return (
    <div className="phoneverifymodal-overlay" onClick={onClose}>
      <div
        className="phoneverifymodal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="phoneverifymodal-header">
          <p className="phoneverifymodal-title">
            {showConfirm ? "회원탈퇴 최종 확인" : "휴대폰 번호 인증"}
          </p>
          <button className="phoneverifymodal-close-btn" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        {showConfirm ? (
          <>
            <div className="phoneverifymodal-confirm-notice">
              <div className="phoneverifymodal-confirm-notice-row">
                <i className="ri-error-warning-line"></i>
                <span>회원탈퇴 시 아래 사항을 반드시 확인해주세요.</span>
              </div>
              <ul className="phoneverifymodal-confirm-list">
                <li>탈퇴 후 <strong>7일 이내</strong>에 고객센터를 통해 탈퇴를 철회할 수 있습니다.</li>
                <li>7일 경과 후에는 계정 및 모든 데이터가 영구 삭제됩니다.</li>
                <li>진행 중인 주문·정산이 있는 경우 탈퇴가 제한될 수 있습니다.</li>
                <li>탈퇴 후 동일 아이디로 재가입은 불가합니다.</li>
              </ul>
            </div>
            <p className="phoneverifymodal-label phoneverifymodal-reason-label">탈퇴 사유</p>
            <select
              className="phoneverifymodal-reason-select"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setErrorMessage(""); }}
              disabled={isLoading}
            >
              <option value="">탈퇴 사유를 선택해주세요</option>
              <option value="서비스 불만족">서비스 불만족</option>
              <option value="사용 빈도 저하">사용 빈도 저하</option>
              <option value="개인 사정">개인 사정</option>
              <option value="다른 계정으로 전환">다른 계정으로 전환</option>
              <option value="개인정보 보호">개인정보 보호</option>
              <option value="기타">기타</option>
            </select>
            {reason === "기타" && (
              <input
                type="text"
                className="phoneverifymodal-input phoneverifymodal-custom-reason"
                placeholder="탈퇴 사유를 직접 입력해주세요"
                value={customReason}
                onChange={(e) => { setCustomReason(e.target.value); setErrorMessage(""); }}
                disabled={isLoading}
              />
            )}
            <div className="phoneverifymodal-error">{errorMessage}</div>
            <div className="phoneverifymodal-confirm-actions">
              <button
                className="phoneverifymodal-confirm-btn"
                onClick={handleConfirmWithdrawal}
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "탈퇴 확인"}
              </button>
              <button
                className="phoneverifymodal-cancel-btn"
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="phoneverifymodal-info">
              가입 시 등록한 휴대폰 번호로 인증을 진행해주세요.
            </p>

            <p className="phoneverifymodal-label">휴대폰 번호</p>
            <div className="phoneverifymodal-input-row">
              <input
                type="tel"
                className="phoneverifymodal-input"
                placeholder="숫자만 입력 (예: 01012345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
              <button
                className="phoneverifymodal-send-btn"
                onClick={handleSendCode}
                disabled={isLoading}
              >
                {isSent ? "재발송" : "인증번호 발송"}
              </button>
            </div>

            <p className="phoneverifymodal-label">인증번호</p>
            <div className="phoneverifymodal-input-row">
              <input
                type="text"
                className="phoneverifymodal-input"
                placeholder="인증번호 6자리"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={!isSent || isLoading}
              />
            </div>

            <div className="phoneverifymodal-timer">
              {isSent && timer > 0 && (
                <><i className="ri-time-line"></i> 남은 시간: {formatTimer(timer)}</>
              )}
              {isSent && timer === 0 && "인증 시간이 만료되었습니다."}
            </div>

            <div className="phoneverifymodal-error">{errorMessage}</div>

            <button
              className="phoneverifymodal-verify-btn"
              onClick={handleVerify}
              disabled={!isSent || isLoading}
            >
              {isLoading ? "처리 중..." : "회원탈퇴 확인"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneVerifyModal;
