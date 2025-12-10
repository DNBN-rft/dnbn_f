import React, { useState } from "react";
import "./css/adminreportdetail.css";

const AdminReportDetail = ({ report, onClose }) => {
  const hasAnswer = report.answer && report.answer.trim() !== "";
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState(report.answer || "");
  const [showRejectCancelConfirm, setShowRejectCancelConfirm] = useState(false);

  // 모달 배경 클릭 시 닫히지 않도록 이벤트 전파 중지
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // 답변 버튼 클릭
  const handleAnswerClick = () => {
    setIsAnswering(true);
  };

  // 수정 버튼 클릭
  const handleEditClick = () => {
    setIsAnswering(true);
  };

  // 반려 취소 버튼 클릭
  const handleRejectCancelClick = () => {
    setShowRejectCancelConfirm(true);
  };

  // 반려 취소 확인
  const handleConfirmRejectCancel = () => {
    // TODO: API 호출하여 상태를 '처리대기'로 변경
    console.log("반려 취소 - 상태를 처리대기로 변경");
    report.status = "처리대기";
    setShowRejectCancelConfirm(false);
    onClose();
  };

  // 반려 취소 확인창 닫기
  const handleCancelRejectCancel = () => {
    setShowRejectCancelConfirm(false);
  };

  // 답변 저장
  const handleSaveAnswer = () => {
    // TODO: API 호출하여 답변 저장
    console.log("답변 저장:", answerText);
    setIsAnswering(false);
    onClose();
  };

  // 답변 취소
  const handleCancelAnswer = () => {
    setAnswerText(report.answer || "");
    setIsAnswering(false);
  };

  return (
    <div className="adminreportdetail-overlay">
      <div className="adminreportdetail-modal" onClick={handleModalContentClick}>
        <div className="adminreportdetail-header">
          <div className="adminreportdetail-header-title">{report.title}</div>
          <div className="adminreportdetail-header-info">
            <div className="adminreportdetail-date-time">{report.createdAt}</div>
            <div className="adminreportdetail-author">{report.author}</div>
          </div>
        </div>

        <div className="adminreportdetail-section">
          <div className="adminreportdetail-section-title">신고 정보</div>
          <div className="adminreportdetail-info-grid">
            <div className="adminreportdetail-info-item">
              <span className="adminreportdetail-info-label">신고 대상:</span>
              <span className="adminreportdetail-info-value">{report.reportType}</span>
            </div>
            <div className="adminreportdetail-info-item">
              <span className="adminreportdetail-info-label">상태:</span>
              <span className={`adminreportdetail-status ${report.status === '처리완료' ? 'adminreportdetail-status-complete' : 'adminreportdetail-status-pending'}`}>
                {report.status}
              </span>
            </div>
            {report.answeredAt && (
              <div className="adminreportdetail-info-item">
                <span className="adminreportdetail-info-label">처리완료일:</span>
                <span className="adminreportdetail-info-value">{report.answeredAt}</span>
              </div>
            )}
          </div>
        </div>

        <div className="adminreportdetail-section">
          <div className="adminreportdetail-section-title">신고 내용</div>
          <div className="adminreportdetail-content">
            <p>{report.content}</p>
          </div>
        </div>

        {/* 답변 섹션 */}
        <div className="adminreportdetail-section">
          <div className="adminreportdetail-section-title">처리 내용</div>
          {isAnswering ? (
            <textarea
              className="adminreportdetail-textarea"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="처리 내용을 입력하세요..."
            />
          ) : (
            <div className={`adminreportdetail-content ${hasAnswer ? 'adminreportdetail-answer' : 'adminreportdetail-no-answer'}`}>
              <p>{hasAnswer ? report.answer : "처리 내용이 아직 등록되지 않았습니다."}</p>
            </div>
          )}
        </div>

        <div className="adminreportdetail-footer">
          {isAnswering ? (
            <>
              <button className="adminreportdetail-save-btn" onClick={handleSaveAnswer}>
                저장
              </button>
              <button className="adminreportdetail-cancel-btn" onClick={handleCancelAnswer}>
                취소
              </button>
            </>
          ) : (
            <>
              {hasAnswer ? (
                report.status === '반려' ? (
                  <button className="adminreportdetail-reject-cancel-btn" onClick={handleRejectCancelClick}>
                    반려 취소
                  </button>
                ) : (
                  <button className="adminreportdetail-edit-btn" onClick={handleEditClick}>
                    수정
                  </button>
                )
              ) : (
                <button className="adminreportdetail-answer-btn" onClick={handleAnswerClick}>
                  답변
                </button>
              )}
              <button className="adminreportdetail-close-btn" onClick={onClose}>
                닫기
              </button>
            </>
          )}
        </div>
      </div>

      {/* 반려 취소 확인 모달 */}
      {showRejectCancelConfirm && (
        <div className="adminreportdetail-confirm-overlay" onClick={handleCancelRejectCancel}>
          <div className="adminreportdetail-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adminreportdetail-confirm-title">반려 취소 확인</div>
            <div className="adminreportdetail-confirm-message">
              반려를 취소하고 상태를 처리대기로 변경하시겠습니까?
            </div>
            <div className="adminreportdetail-confirm-buttons">
              <button className="adminreportdetail-confirm-ok-btn" onClick={handleConfirmRejectCancel}>
                확인
              </button>
              <button className="adminreportdetail-confirm-cancel-btn" onClick={handleCancelRejectCancel}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportDetail;