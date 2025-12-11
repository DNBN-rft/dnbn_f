import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./css/adminquestion.css";
import AdminQuestionDetail from "./modal/AdminQuestionDetail";

const AdminQuestion = () => {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 샘플 데이터
  const questions = [
    {
      id: 1,
      userType: "일반사용자",
      questionType: "서비스",
      author: "홍길동",
      title: "앱이 자꾸 꺼져요",
      content: "앱을 사용하다가 자꾸 꺼지는 현상이 발생합니다. 어떻게 해결할 수 있나요?",
      createdAt: "2024-01-01",
      status: "처리대기",
      answeredAt: null,
      answer: ""
    },
    {
      id: 2,
      userType: "일반사용자",
      questionType: "서비스",
      author: "홍길동",
      title: "앱이 자꾸 꺼져요",
      content: "앱을 사용하다가 자꾸 꺼지는 현상이 발생합니다. 문의 드립니다.",
      createdAt: "2024-01-01",
      status: "처리완료",
      answeredAt: "2024-01-02",
      answer: "안녕하세요. 해당 문제는 최신 버전 업데이트로 해결되었습니다. 앱스토어에서 최신 버전으로 업데이트 부탁드립니다."
    }
  ];

  const handleDetailClick = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
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
                <option value="service">서비스</option>
                <option value="pay">결제</option>
                <option value="etc">기타</option>
              </select>
            </div>
          </div>

          {/* 구분선 */}
          <div className="adminquestion-filter-divider"></div>

          {/* 세 번째 행: 검색조건, 검색input, 검색버튼 */}
          <div className="adminquestion-filter-row">
            <div className="adminquestion-filter-group">
              <label className="adminquestion-filter-label">검색조건</label>
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
            총 <span className="adminquestion-count-bold">3</span>건
          </div>
        </div>

        {/* 테이블 영역 */}
        <div className="adminquestion-table-wrap">
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
              {questions.map((question, index) => (
                <tr key={question.id}>
                  <td>{question.id}</td>
                  <td>{question.userType}</td>
                  <td>{question.questionType}</td>
                  <td>{question.author}</td>
                  <td className="adminquestion-table-title-cell">{question.title}</td>
                  <td>{question.createdAt}</td>
                  <td>
                    <span className={`adminquestion-status ${question.status === '처리완료' ? 'adminquestion-status-complete' : 'adminquestion-status-pending'}`}>
                      {question.status}
                    </span>
                  </td>
                  <td>{question.answeredAt || '-'}</td>
                  <td>
                    <button 
                      className="adminquestion-detail-btn"
                      onClick={() => handleDetailClick(question)}
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 문의 상세 모달 */}
      {isModalOpen && selectedQuestion && (
        <AdminQuestionDetail 
          question={selectedQuestion}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminQuestion;
