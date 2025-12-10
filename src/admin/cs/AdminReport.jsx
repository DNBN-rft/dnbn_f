import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./css/adminreport.css";
import AdminReportDetail from "./modal/AdminReportDetail";

const AdminReport = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 샘플 데이터
  const reports = [
    {
      id: 1,
      reportType: "가맹점",
      author: "홍길동",
      title: "앱이 자꾸 꺼져요",
      content: "앱을 사용하다가 자꾸 꺼지는 현상이 발생합니다. 신고합니다.",
      createdAt: "2024-01-01",
      status: "처리대기",
      answeredAt: null,
      answer: ""
    },
    {
      id: 2,
      reportType: "상품",
      author: "홍길동",
      title: "앱이 자꾸 꺼져요",
      content: "앱을 사용하다가 자꾸 꺼지는 현상이 발생합니다. 신고합니다.",
      createdAt: "2024-01-01",
      status: "처리완료",
      answeredAt: "2024-01-02",
      answer: "안녕하세요. 해당 문제는 최신 버전 업데이트로 해결되었습니다."
    },
    {
      id: 3,
      reportType: "상품",
      author: "홍길동",
      title: "앱이 자꾸 꺼져요",
      content: "앱을 사용하다가 자꾸 꺼지는 현상이 발생합니다. 신고합니다.",
      createdAt: "2024-01-01",
      status: "반려",
      answeredAt: "2024-01-02",
      answer: "검토 결과 신고 내용이 부적절하여 반려되었습니다."
    }
  ];

  const handleDetailClick = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="adminreport-container">
      <div className="adminreport-wrap">
        {/* 탭 네비게이션 */}
        <div className="adminreport-tab-navigation">
          <button
            className="adminreport-tab-btn"
            onClick={() => navigate("/admin/question")}
          >
            고객문의
          </button>
          <button className="adminreport-tab-btn adminreport-tab-active">
            신고
          </button>
        </div>

        {/* 필터 영역 */}
        <div className="adminreport-filter-section">
          {/* 첫 번째 행: 기간 선택, 답변완료여부 */}
          <div className="adminreport-filter-row">
            <div className="adminreport-filter-group">
              <label className="adminreport-filter-label">기간 선택</label>
              <div className="adminreport-date-range">
                <input type="date" className="adminreport-filter-date" />
                <span className="adminreport-date-separator">~</span>
                <input type="date" className="adminreport-filter-date" />
              </div>
            </div>

            <div className="adminreport-checkbox-group">
              <label className="adminreport-checkbox-label">
                <input type="checkbox" className="adminreport-filter-checkbox" />
                <span>답변완료 여부</span>
              </label>
            </div>
          </div>

          {/* 두 번째 행: 신고 구분 */}
          <div className="adminreport-filter-row">
            <div className="adminreport-filter-group">
              <label className="adminreport-filter-label">신고 대상</label>
              <select name="reporttype" id="reporttype" className="adminreport-filter-select">
                <option value="reportall">전체</option>
                <option value="product">상품</option>
                <option value="store">가맹점</option>
              </select>
            </div>
          </div>

          {/* 구분선 */}
          <div className="adminreport-filter-divider"></div>

          {/* 세 번째 행: 검색조건, 검색input, 검색버튼 */}
          <div className="adminreport-filter-row">
            <div className="adminreport-filter-group">
              <label className="adminreport-filter-label">검색조건</label>
              <select name="filter" id="filter" className="adminreport-filter-select">
                <option value="filterall">전체</option>
                <option value="filterwriter">작성자</option>
                <option value="filtertitle">제목</option>
                <option value="filterstatus">상태</option>
              </select>
            </div>

            <div className="adminreport-search-group">
              <input
                type="text"
                className="adminreport-filter-input"
                placeholder="검색어를 입력하세요"
              />
              <button className="adminreport-filter-search-btn">검색</button>
            </div>
          </div>
        </div>

        {/* 테이블 제목 */}
        <div className="adminreport-table-header">
          <div className="adminreport-table-info">
            총 <span className="adminreport-count-bold">2</span>건
          </div>
        </div>

        {/* 테이블 영역 */}
        <div className="adminreport-table-wrap">
          <table className="adminreport-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>신고 대상</th>
                <th>작성자</th>
                <th>제목</th>
                <th>작성일</th>
                <th>상태</th>
                <th>처리완료일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.reportType}</td>
                  <td>{report.author}</td>
                  <td className="adminreport-table-title-cell">{report.title}</td>
                  <td>{report.createdAt}</td>
                  <td>
                    <span className={`adminreport-status ${report.status === '처리완료' ? 'adminreport-status-complete' : 'adminreport-status-pending'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>{report.answeredAt || '-'}</td>
                  <td>
                    <button 
                      className="adminreport-detail-btn"
                      onClick={() => handleDetailClick(report)}
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

      {/* 신고 상세 모달 */}
      {isModalOpen && selectedReport && (
        <AdminReportDetail 
          report={selectedReport}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminReport;
