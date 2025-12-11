import React, { useState } from "react";
import "./css/adminquestiondetail.css";

const AdminQuestionDetail = ({ question, onClose }) => {
  const hasAnswer = question.answer && question.answer.trim() !== "";
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState(question.answer || "");

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

  // 답변 저장
  const handleSaveAnswer = () => {
    // TODO: API 호출하여 답변 저장
    console.log("답변 저장:", answerText);
    setIsAnswering(false);
    onClose();
  };

  // 답변 취소
  const handleCancelAnswer = () => {
    setAnswerText(question.answer || "");
    setIsAnswering(false);
  };

  return (
    <div className="adminquestiondetail-overlay">
      <div className="adminquestiondetail-modal" onClick={handleModalContentClick}>
        <div className="adminquestiondetail-header">
          <div className="adminquestiondetail-header-title">{question.title}</div>
          <div className="adminquestiondetail-header-info">
            <div className="adminquestiondetail-date-time">{question.createdAt}</div>
            <div className="adminquestiondetail-author">{question.author}</div>
          </div>
        </div>

        <div className="adminquestiondetail-section">
          <div className="adminquestiondetail-section-title">문의 정보</div>
          <div className="adminquestiondetail-info-grid">
            <div className="adminquestiondetail-info-item">
              <span className="adminquestiondetail-info-label">사용자 구분:</span>
              <span className="adminquestiondetail-info-value">{question.userType}</span>
            </div>
            <div className="adminquestiondetail-info-item">
              <span className="adminquestiondetail-info-label">문의타입:</span>
              <span className="adminquestiondetail-info-value">{question.questionType}</span>
            </div>
            <div className="adminquestiondetail-info-item">
              <span className="adminquestiondetail-info-label">상태:</span>
              <span className={`adminquestiondetail-status ${question.status === '처리완료' ? 'adminquestiondetail-status-complete' : 'adminquestiondetail-status-pending'}`}>
                {question.status}
              </span>
            </div>
            {question.answeredAt && (
              <div className="adminquestiondetail-info-item">
                <span className="adminquestiondetail-info-label">답변완료일:</span>
                <span className="adminquestiondetail-info-value">{question.answeredAt}</span>
              </div>
            )}
          </div>
        </div>

        <div className="adminquestiondetail-section">
          <div className="adminquestiondetail-section-title">문의 내용</div>
          <div className="adminquestiondetail-content">
            <p>{question.content}</p>
          </div>
        </div>

        {/* 답변 섹션 */}
        <div className="adminquestiondetail-section">
          <div className="adminquestiondetail-section-title">답변 내용</div>
          {isAnswering ? (
            <textarea
              className="adminquestiondetail-textarea"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="답변을 입력하세요..."
            />
          ) : (
            <div className={`adminquestiondetail-content ${hasAnswer ? 'adminquestiondetail-answer' : 'adminquestiondetail-no-answer'}`}>
              <p>{hasAnswer ? question.answer : "답변이 아직 등록되지 않았습니다."}</p>
            </div>
          )}
        </div>

        <div className="adminquestiondetail-footer">
          {isAnswering ? (
            <>
              <button className="adminquestiondetail-save-btn" onClick={handleSaveAnswer}>
                저장
              </button>
              <button className="adminquestiondetail-cancel-btn" onClick={handleCancelAnswer}>
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
              <button className="adminquestiondetail-close-btn" onClick={onClose}>
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
