import React, { useState, useEffect } from "react";
import "./css/adminreportdetail.css";
import { getReportDetail, registerAnswer, modAnswer } from "../../../utils/adminReportService";
// ReportReason 한국어 매핑
const reportReasonMap = {
  ADVERTISING_PRODUCT: "광고성 상점",
  INCORRECT_INFO: "상품 정보가 부정확",
  PROHIBITED_ITEM: "거래 금지 품목",
  FRAUD_SUSPECTED_PRODUCT: "사기 의심",
  PROFESSIONAL_SELLER_PRODUCT: "전문 업자",
  OFFENSIVE_CONTENT: "콘텐츠 내용이 불쾌",
  ADVERTISING_STORE: "광고성 컨텐츠",
  FRAUD_SUSPECTED_STORE: "사기 의심",
  PROFESSIONAL_SELLER_STORE: "전문 업자",
  ABUSIVE_LANGUAGE: "욕설/비속어 사용",
  ADVERTISING_REVIEW: "광고성 리뷰",
  FALSE_REVIEW: "허위 리뷰",
  ABUSIVE_REVIEW: "욕설/비방",
  IRRELEVANT_CONTENT: "상품과 무관한 내용",
  SPAM_REVIEW: "도배/스팸",
};
const getReportReasonText = (reason) => {
  return reportReasonMap[reason] || reason;
};
// ReportAnswerTitle 한국어 매핑
const reportAnswerTitleMap = {
  REPORT_REJECTED: "신고 반려",
  WARNING_ISSUED: "경고 조치",
  PRODUCT_REMOVED: "상품 삭제 조치",
  STORE_SUSPENDED: "가맹점 이용 정지 조치",
  ETC: "기타",
};
const getReportAnswerTitleText = (title) => {
  return reportAnswerTitleMap[title] || title;
};
const AdminReportDetail = ({ report, onClose }) => {
  const [reportData, setReportData] = useState(null);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerTitle, setAnswerTitle] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [showRejectCancelConfirm, setShowRejectCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // 신고 상세 정보 로드
  useEffect(() => {
    const loadReportDetail = async () => {
      try {
        const data = await getReportDetail(report.reportIdx);
        setReportData(data);
        if (data.answerContent) {
          setHasAnswer(true);
          setAnswerTitle(data.answerTitle || "");
          setAnswerContent(data.answerContent || "");
        }
        setLoading(false);
        // 모달 내용이 로드되면 맨 위로 스크롤
        window.scrollTo(0, 0);
      } catch (err) {
        setError("신고 상세 정보를 불러오는데 실패했습니다.");
        setLoading(false);
        console.error(err);
      }
    };
    if (report?.reportIdx) {
      loadReportDetail();
    }
  }, [report]);
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
  const handleConfirmRejectCancel = async () => {
    // 백엔드에서 반려 취소 기능이 필요한 경우 여기에 API 호출 추가
    setShowRejectCancelConfirm(false);
    onClose();
  };
  // 반려 취소 확인창 닫기
  const handleCancelRejectCancel = () => {
    setShowRejectCancelConfirm(false);
  };
  // 답변 저장
  const handleSaveAnswer = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const answerData = {
        answerTitle: answerTitle || "RESOLVED",
        answerContent: answerContent,
      };
      if (hasAnswer) {
        // 수정 API 호출
        await modAnswer(report.reportIdx, answerData);
      } else {
        // 등록 API 호출
        await registerAnswer(report.reportIdx, answerData);
      }
      setIsAnswering(false);
      onClose();
    } catch (err) {
      setError("답변 저장에 실패했습니다.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  // 답변 취소
  const handleCancelAnswer = () => {
    setAnswerTitle(reportData?.answerTitle || "");
    setAnswerContent(reportData?.answerContent || "");
    setIsAnswering(false);
  };
  return (
    <div className="adminreportdetail-overlay">
      <div className="adminreportdetail-modal" onClick={handleModalContentClick}>
        {loading ? (
          <div>로딩 중...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : reportData ? (
          <>
            <div className="adminreportdetail-header">
              <div className="adminreportdetail-header-title">{getReportReasonText(reportData.reportReason)}</div>
              <div className="adminreportdetail-header-info">
                <div className="adminreportdetail-date-time">{reportData.reportRegDate}</div>
                <div className="adminreportdetail-author">{reportData.reportRegNm}</div>
              </div>
            </div>
            <div className="adminreportdetail-section">
              <div className="adminreportdetail-section-title">신고 정보</div>
              <div className="adminreportdetail-info-grid">
                <div className="adminreportdetail-info-item">
                  <span className="adminreportdetail-info-label">신고 대상:</span>
                  <span className="adminreportdetail-info-value">
                    {reportData.reportType === 'PRODUCT' ? '상품' : '가맹점'}
                  </span>
                </div>
                <div className="adminreportdetail-info-item">
                  <span className="adminreportdetail-info-label">상태:</span>
                  <span className={`adminreportdetail-status ${reportData.reportStatus === 'COMPLETED' ? 'adminreportdetail-status-complete' : 'adminreportdetail-status-pending'}`}>
                    {reportData.reportStatus === 'COMPLETED' ? '처리완료' : reportData.reportStatus === 'REJECTED' ? '반려' : '처리대기'}
                  </span>
                </div>
                {reportData.reportAnswerDate && (
                  <div className="adminreportdetail-info-item">
                    <span className="adminreportdetail-info-label">처리완료일:</span>
                    <span className="adminreportdetail-info-value">{reportData.reportAnswerDate}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="adminreportdetail-section">
              <div className="adminreportdetail-section-title">신고 내용</div>
              <div className="adminreportdetail-content">
                <p>{reportData.reportContent}</p>
              </div>
            </div>
            {/* 답변 섹션 */}
            <div className="adminreportdetail-section">
              <div className="adminreportdetail-section-title">처리 내용</div>
              {isAnswering ? (
                <>
                  <div className="adminreportdetail-answer-title-group">
                    <label className="adminreportdetail-answer-title-label">
                      처리 제목 선택
                    </label>
                    <select
                      className="adminreportdetail-answer-title-select"
                      value={answerTitle}
                      onChange={(e) => setAnswerTitle(e.target.value)}
                    >
                      <option value="">선택하세요</option>
                      <option value="REPORT_REJECTED">신고 반려</option>
                      <option value="WARNING_ISSUED">경고 조치</option>
                      <option value="PRODUCT_REMOVED">상품 삭제 조치</option>
                      <option value="STORE_SUSPENDED">가맹점 이용 정지 조치</option>
                      <option value="ETC">기타</option>
                    </select>
                  </div>
                  <textarea
                    className="adminreportdetail-textarea"
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="처리 내용을 입력하세요..."
                  />
                </>
              ) : (
                <div className={`adminreportdetail-content ${hasAnswer ? 'adminreportdetail-answer' : 'adminreportdetail-no-answer'}`}>
                  {hasAnswer && reportData?.answerTitle && (
                    <div className="adminreportdetail-answer-title-display">
                      처리 제목: {getReportAnswerTitleText(reportData.answerTitle)}
                    </div>
                  )}
                  <p>{hasAnswer ? reportData.answerContent : "처리 내용이 아직 등록되지 않았습니다."}</p>
                </div>
              )}
              {error && <div className="adminreportdetail-error-message">{error}</div>}
            </div>
            <div className="adminreportdetail-footer">
              {isAnswering ? (
                <>
                  <button
                    className="adminreportdetail-save-btn"
                    onClick={handleSaveAnswer}
                    disabled={submitting}
                  >
                    {submitting ? "저장 중..." : "저장"}
                  </button>
                  <button
                    className="adminreportdetail-cancel-btn"
                    onClick={handleCancelAnswer}
                    disabled={submitting}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  {hasAnswer ? (
                    reportData.reportStatus === 'REJECTED' ? (
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
          </>
        ) : (
          <div>신고 정보를 찾을 수 없습니다.</div>
        )}
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