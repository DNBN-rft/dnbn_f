import React, { useState, useEffect } from "react";
import "./css/adminquestiondetail.css";
import { getQuestionDetail, registerAnswer, modifyAnswer } from "../../../utils/adminQuestionService";

const AdminQuestionDetail = ({ question, onClose }) => {
  const [questionDetail, setQuestionDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [saving, setSaving] = useState(false);

  // 상세 정보 로드
  useEffect(() => {
    fetchQuestionDetail();
  }, [question.questionIdx]);

  const fetchQuestionDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuestionDetail(question.questionIdx);
      setQuestionDetail(data);
      setAnswerContent(data.answerContent || "");
    } catch (err) {
      setError(err.message);
      console.error("문의사항 상세 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const hasAnswer = questionDetail && questionDetail.answerContent && questionDetail.answerContent.trim() !== "";

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

  // 답변 저장 (등록 또는 수정)
  const handleSaveAnswer = async () => {
    if (!answerContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      if (hasAnswer) {
        // 답변 수정
        await modifyAnswer(question.questionIdx, answerContent);
        alert("답변이 수정되었습니다.");
      } else {
        // 답변 등록
        await registerAnswer(question.questionIdx, answerContent);
        alert("답변이 등록되었습니다.");
        console.log(hasAnswer)
      }
      setIsAnswering(false);
      onClose(true); // 성공 시 새로고침 플래그 전달
    } catch (err) {
      alert(err.message);
      console.error("답변 저장 실패:", err);
    } finally {
      setSaving(false);
    }
  };

  // 답변 취소
  const handleCancelAnswer = () => {
    setAnswerContent(questionDetail?.answerContent || "");
    setIsAnswering(false);
  };

  // 문의 유형 한글 변환
  const getQuestionTypeLabel = (type) => {
    const typeMap = {
      SERVICE: "서비스",
      PAYMENT: "결제",
      ETC: "기타"
    };
    return typeMap[type] || type;
  };

  // 사용자 구분 결정
  const getUserType = () => {
    if (!questionDetail) return "-";
    if (questionDetail.storeIdx) return "가맹점";
    if (questionDetail.custIdx) return "일반사용자";
    return "-";
  };

  if (loading) {
    return (
      <div className="adminquestiondetail-overlay">
        <div className="adminquestiondetail-modal" onClick={handleModalContentClick}>
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adminquestiondetail-overlay">
        <div className="adminquestiondetail-modal" onClick={handleModalContentClick}>
          <div>{error}</div>
          <div className="adminquestiondetail-footer">
            <button className="adminquestiondetail-close-btn" onClick={() => onClose(false)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questionDetail) {
    return null;
  }

  return (
    <div className="adminquestiondetail-overlay">
      <div className="adminquestiondetail-modal" onClick={handleModalContentClick}>
        <div className="adminquestiondetail-header">
          <div className="adminquestiondetail-header-title">{questionDetail.questionTitle}</div>
          <div className="adminquestiondetail-header-info">
            <div className="adminquestiondetail-date-time">{questionDetail.questionRegDate}</div>
            <div className="adminquestiondetail-author">{questionDetail.questionRegNm}</div>
          </div>
        </div>

        <div className="adminquestiondetail-section">
          <div className="adminquestiondetail-section-title">문의 정보</div>
          <div className="adminquestiondetail-info-grid">
            <div className="adminquestiondetail-info-item">
              <span className="adminquestiondetail-info-label">사용자 구분:</span>
              <span className="adminquestiondetail-info-value">{getUserType()}</span>
            </div>
            <div className="adminquestiondetail-info-item">
              <span className="adminquestiondetail-info-label">문의타입:</span>
              <span className="adminquestiondetail-info-value">{getQuestionTypeLabel(questionDetail.questionRequestType)}</span>
            </div>
            <div className="adminquestiondetail-info-item">
              <span className="adminquestiondetail-info-label">상태:</span>
              <span className={`adminquestiondetail-status ${questionDetail.isAnswered ? 'adminquestiondetail-status-complete' : 'adminquestiondetail-status-pending'}`}>
                {questionDetail.isAnswered ? '처리완료' : '처리대기'}
              </span>
            </div>
            {questionDetail.answerRegDate && (
              <div className="adminquestiondetail-info-item">
                <span className="adminquestiondetail-info-label">답변완료일:</span>
                <span className="adminquestiondetail-info-value">{questionDetail.answerRegDate}</span>
              </div>
            )}
          </div>
        </div>

        <div className="adminquestiondetail-section">
          <div className="adminquestiondetail-section-title">문의 내용</div>
          <div className="adminquestiondetail-content">
            <p>{questionDetail.questionContent}</p>
          </div>
        </div>

        {/* 답변 섹션 */}
        <div className="adminquestiondetail-section">
          <div className="adminquestiondetail-section-title">답변 내용</div>
          {isAnswering ? (
            <textarea
              className="adminquestiondetail-textarea"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="답변을 입력하세요..."
              disabled={saving}
            />
          ) : (
            <div className={`adminquestiondetail-content ${hasAnswer ? 'adminquestiondetail-answer' : 'adminquestiondetail-no-answer'}`}>
              <p>{hasAnswer ? questionDetail.answerContent : "답변이 아직 등록되지 않았습니다."}</p>
            </div>
          )}
        </div>

        {/* 답변자 및 수정자 정보 */}
        {questionDetail.answerRegNm && !isAnswering && (
          <div className="adminquestiondetail-section">
            <div className="adminquestiondetail-info-grid">
              <div className="adminquestiondetail-info-item">
                <span className="adminquestiondetail-info-label">답변자:</span>
                <span className="adminquestiondetail-info-value">{questionDetail.answerRegNm}</span>
              </div>
              {questionDetail.answerModNm && (
                <>
                  <div className="adminquestiondetail-info-item">
                    <span className="adminquestiondetail-info-label">수정자:</span>
                    <span className="adminquestiondetail-info-value">{questionDetail.answerModNm}</span>
                  </div>
                  <div className="adminquestiondetail-info-item">
                    <span className="adminquestiondetail-info-label">수정일:</span>
                    <span className="adminquestiondetail-info-value">{questionDetail.answerModDate}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="adminquestiondetail-footer">
          {isAnswering ? (
            <>
              <button 
                className="adminquestiondetail-save-btn" 
                onClick={handleSaveAnswer}
                disabled={saving}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
              <button 
                className="adminquestiondetail-cancel-btn" 
                onClick={handleCancelAnswer}
                disabled={saving}
              >
                취소
              </button>
            </>
          ) : (
            <>
              {hasAnswer ? (
                <button className="adminquestiondetail-edit-btn" onClick={handleEditClick}>
                  수정
                </button>
              ) : (
                <button className="adminquestiondetail-answer-btn" onClick={handleAnswerClick}>
                  답변
                </button>
              )}
              <button className="adminquestiondetail-close-btn" onClick={() => onClose(false)}>
                닫기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQuestionDetail;
