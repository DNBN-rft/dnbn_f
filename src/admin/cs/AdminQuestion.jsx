import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./css/adminquestion.css";
import AdminQuestionDetail from "./modal/AdminQuestionDetail";
import { getQuestionList } from "../../utils/adminQuestionService";
const AdminQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 문의사항 목록 조회
  useEffect(() => {
    fetchQuestions();
  }, []);
  useEffect(() => {
    if (location.state?.openModal && location.state?.questionIdx) {
      setSelectedQuestionIdx(location.state.questionIdx);
      setIsModalOpen(true);
    }
  }, [location]);
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuestionList();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
      console.error("문의사항 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };
  // 문의 유형 한글 변환
  const getQuestionTypeLabel = (type) => {
    const typeMap = {
      QR: "QR 관련",
      PAYMENT: "결제 관련",
      REFUND: "환불/교환 관련",
      MOD_REQUEST: "개인정보 수정 요청",
      ETC: "기타"
    };
    return typeMap[type] || type;
  };
  // 사용자 구분 결정
  const getUserType = (question) => {
    if (question.storeIdx) return "가맹점";
    if (question.custIdx) return "일반사용자";
    return "-";
  };
  const handleDetailClick = (questionIdx) => {
    setSelectedQuestionIdx(questionIdx);
    setIsModalOpen(true);
  };
  const handleCloseModal = (shouldRefresh = false) => {
    setIsModalOpen(false);
    setSelectedQuestionIdx(null);
    if (shouldRefresh) {
      fetchQuestions(); // 답변 등록/수정 후 목록 새로고침
    }
  };
  return (
    <div className="adminquestion-container">
      <div className="adminquestion-wrap">
        {/* 탭 네비게이션 */}
        <div className="adminquestion-tab-navigation">
          <button className="adminquestion-tab-btn adminquestion-tab-active">
            고객문의
          </button>
          <button
            className="adminquestion-tab-btn"
            onClick={() => navigate("/admin/report")}
          >
            신고
          </button>
        </div>
        {/* 필터 영역 */}
        <div className="adminquestion-filter-section">
          {/* 첫 번째 행: 기간 선택, 답변완료여부, 수정 여부 */}
          <div className="adminquestion-filter-row">
            <div className="adminquestion-filter-group">
              <label className="adminquestion-filter-label">기간 선택</label>
              <div className="adminquestion-date-range">
                <input type="date" className="adminquestion-filter-date" />
                <span className="adminquestion-date-separator">~</span>
                <input type="date" className="adminquestion-filter-date" />
              </div>
            </div>
            <div className="adminquestion-checkbox-group">
              <label className="adminquestion-checkbox-label">
                <input type="checkbox" className="adminquestion-filter-checkbox" />
                <span>답변완료 여부</span>
              </label>
              <label className="adminquestion-checkbox-label">
                <input type="checkbox" className="adminquestion-filter-checkbox" />
                <span>수정 여부</span>
              </label>
            </div>
          </div>
          {/* 두 번째 행: 사용자 구분, 문의타입 */}
          <div className="adminquestion-filter-row">
            <div className="adminquestion-filter-group">
              <label className="adminquestion-filter-label">사용자 구분</label>
              <select name="usertype" id="usertype" className="adminquestion-filter-select">
                <option value="userall">전체</option>
                <option value="cust">일반사용자</option>
                <option value="store">가맹점</option>
              </select>
            </div>
            <div className="adminquestion-filter-group">
              <label className="adminquestion-filter-label">문의타입</label>
              <select name="option" id="option" className="adminquestion-filter-select">
                <option value="all">전체</option>
                <option value="QR">QR 관련</option>
                <option value="PAYMENT">결제 관련</option>
                <option value="REFUND">환불/교환 관련</option>
                <option value="MOD_REQUEST">개인정보 수정 요청</option>
                <option value="ETC">기타</option>
              </select>
            </div>
          </div>
          {/* 구분선 */}
          <div className="adminquestion-filter-divider"></div>
          {/* 세 번째 행: 검색조건, 검색input, 검색버튼 */}
          <div className="adminquestion-filter-row">
            <div className="adminquestion-filter-group">
              <select name="filter" id="filter" className="adminquestion-filter-select">
                <option value="filterall">전체</option>
                <option value="filterwriter">작성자</option>
                <option value="filtertitle">제목</option>
              </select>
            </div>
            <div className="adminquestion-search-group">
              <input
                type="text"
                className="adminquestion-filter-input"
                placeholder="검색어를 입력하세요"
              />
              <button className="adminquestion-filter-search-btn">검색</button>
            </div>
          </div>
        </div>
        {/* 테이블 제목 */}
        <div className="adminquestion-table-header">
          <div className="adminquestion-table-info">
            총 <span className="adminquestion-count-bold">{questions.length}</span>건
          </div>
        </div>
        {/* 테이블 영역 */}
        <div className="adminquestion-table-wrap">
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <table className="adminquestion-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>사용자 구분</th>
                  <th>문의타입</th>
                  <th>작성자</th>
                  <th>제목</th>
                  <th>작성일</th>
                  <th>상태</th>
                  <th>답변완료일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {questions.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      문의사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  questions.map((question, index) => (
                    <tr key={question.questionIdx}>
                      <td>{question.questionIdx}</td>
                      <td>{getUserType(question)}</td>
                      <td>{getQuestionTypeLabel(question.questionRequestType)}</td>
                      <td>{question.questionRegNm}</td>
                      <td className="adminquestion-table-title-cell">{question.questionTitle}</td>
                      <td>{question.questionRegDateTime}</td>
                      <td>
                        <span className={`adminquestion-status ${question.isAnswered ? 'adminquestion-status-complete' : 'adminquestion-status-pending'}`}>
                          {question.isAnswered ? '처리완료' : '처리대기'}
                        </span>
                      </td>
                      <td>{question.answerRegDateTime || '-'}</td>
                      <td>
                        <button
                          className="adminquestion-detail-btn"
                          onClick={() => handleDetailClick(question.questionIdx)}
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* 문의 상세 모달 */}
      {isModalOpen && selectedQuestionIdx && (
        <AdminQuestionDetail
          questionIdx={selectedQuestionIdx}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
export default AdminQuestion;