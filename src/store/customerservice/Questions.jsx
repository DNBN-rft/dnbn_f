import { useState, useEffect, useContext } from "react";
import QuestionRegisterModal from "./modal/QuestionRegisterModal";
import QuestionDetailModal from "./modal/QuestionDetailModal";
import { apiGet } from "../../utils/apiClient";
import { AuthContext } from "../../context/AuthContext";
import "./css/questions.css";

const Questions = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (user?.storeCode) {
      loadQuestions(0);
    }
  }, [user]);

  const loadQuestions = async (page = 0) => {
    setLoading(true);
    try {
      const response = await apiGet(`/question/${user.storeCode}?page=${page}&size=${pageSize}`);
      const data = await response.json();
      
      if (response.ok) {
        setQuestions(data.content || []);
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return "-";
    return dateTime.replace("T", " ").substring(0, 16);
  };

  const handleRowClick = (id) => {
    setSelectedId(id);
    setIsDetailModalOpen(true);
  };

  const handleRegisterSuccess = () => {
    loadQuestions();
    setIsRegisterModalOpen(false);
  };

  const handleDetailClose = () => {
    loadQuestions();
    setIsDetailModalOpen(false);
  };

  return (
    <div className="questions-container">
      <div className="questions-wrap">
        <div className="questions-header">
          <div className="questions-header-title">1:1 문의 내역</div>
          <div className="questions-header-subtitle">
            고객님의 문의 내역을 확인하실 수 있습니다
          </div>
          <div className="questions-header-btnbox">
            <button
              className="questions-header-btn"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              문의하기
            </button>
          </div>
        </div>

        <div className="questions-contentbox">
          {loading ? (
            <div className="questions-loading">로딩 중...</div>
          ) : questions.length === 0 ? (
            <div className="questions-empty">문의 내역이 없습니다</div>
          ) : (
            <div className="questions-list">
              {questions.map((q, idx) => (
                <div
                  key={q.questionId}
                  className="questions-item"
                  onClick={() => handleRowClick(q.questionId)}
                >
                  <div className="questions-item-header">
                    <div className="questions-item-info">
                      <span className="questions-item-no">No. {currentPage * pageSize + idx + 1}</span>
                      <span
                        className={`questions-item-status ${
                          q.isAnswered
                            ? "questions-item-status-answered"
                            : "questions-item-status-waiting"
                        }`}
                      >
                        {q.isAnswered ? "답변완료" : "대기중"}
                      </span>
                    </div>
                    <span className="questions-item-date">
                      {formatDate(q.questionRegDateTime)}
                    </span>
                  </div>
                  <div className="questions-item-title">{q.questionTitle}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && questions.length > 0 && (
          <div className="questions-footer">
            <div className="questions-pagination">
              <button 
                className="questions-page"
                onClick={() => loadQuestions(currentPage - 1)}
                disabled={currentPage === 0}
              >
                이전
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`questions-page ${currentPage === index ? 'questions-page-active' : ''}`}
                  onClick={() => loadQuestions(index)}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                className="questions-page"
                onClick={() => loadQuestions(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      {isRegisterModalOpen && (
        <QuestionRegisterModal
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={handleRegisterSuccess}
        />
      )}

      {isDetailModalOpen && (
        <QuestionDetailModal id={selectedId} onClose={handleDetailClose} />
      )}
    </div>
  );
};

export default Questions;
