import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./css/adminreport.css";
import AdminReportDetail from "./modal/AdminReportDetail";
import { getReportList, searchReports } from "../../utils/adminReportService";
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
const AdminReport = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 검색 여부 플래그
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 필터 상태
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [reportType, setReportType] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 신고 목록 불러오기
  const loadReports = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReportList(page, pageSize);
      if (data) {
        setReports(data.content || []);
        setCurrentPage(data.number || 0);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setIsSearchMode(false);
      } else {
        setReports([]);
      }
    } catch (err) {
      setError("신고 목록을 불러오는데 실패했습니다.");
      setReports([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadReports();
  }, []);

  // 검색 내부 함수
  const handleSearchInternal = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = {
        startDate: startDate || null,
        endDate: endDate || null,
        isAnswered: isAnswered ? true : null,
        reportType: reportType || null,
        searchType: searchType || null,
        searchTerm: searchTerm || null,
      };
      const data = await searchReports(searchParams, page, pageSize);
      if (data) {
        setReports(data.content || []);
        setCurrentPage(data.number || 0);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setIsSearchMode(true);
      } else {
        setReports([]);
      }
    } catch (err) {
      setError("검색에 실패했습니다.");
      setReports([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setCurrentPage(0);
    handleSearchInternal(0);
  };

  // 필터 초기화
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setIsAnswered(false);
    setReportType("");
    setSearchType("");
    setSearchTerm("");
    setCurrentPage(0);
    loadReports(0);
  };
  const handleDetailClick = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    // 모달이 닫힐 때 목록 새로고침
    if (isSearchMode) {
      handleSearchInternal(currentPage);
    } else {
      loadReports(currentPage);
    }
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
                <input
                  type="date"
                  className="adminreport-filter-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="adminreport-date-separator">~</span>
                <input
                  type="date"
                  className="adminreport-filter-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="adminreport-checkbox-group">
              <label className="adminreport-checkbox-label">
                <input
                  type="checkbox"
                  className="adminreport-filter-checkbox"
                  checked={isAnswered}
                  onChange={(e) => setIsAnswered(e.target.checked)}
                />
                <span>답변완료 여부</span>
              </label>
            </div>
          </div>
          {/* 두 번째 행: 신고 구분 */}
          <div className="adminreport-filter-row">
            <div className="adminreport-filter-group">
              <label className="adminreport-filter-label">신고 대상</label>
              <select
                name="reporttype"
                id="reporttype"
                className="adminreport-filter-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="">전체</option>
                <option value="PRODUCT">상품</option>
                <option value="STORE">가맹점</option>
              </select>
            </div>
          </div>
          {/* 구분선 */}
          <div className="adminreport-filter-divider"></div>
          {/* 세 번째 행: 검색조건, 검색input, 검색버튼 */}
          <div className="adminreport-filter-row">
            <div className="adminreport-filter-group">
              <label className="adminreport-filter-label">검색조건</label>
              <select
                name="filter"
                id="filter"
                className="adminreport-filter-select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="">전체</option>
                <option value="REPORT_CONTENT">내용</option>
              </select>
            </div>
            <div className="adminreport-search-group">
              <input
                type="text"
                className="adminreport-filter-input"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="adminreport-filter-search-btn"
                onClick={handleSearch}
              >
                검색
              </button>
              <button
                className="adminreport-filter-search-btn"
                onClick={handleReset}
              >
                초기화
              </button>
            </div>
          </div>
        </div>
        {/* 테이블 제목 */}
        <div className="adminreport-table-header">
          <div className="adminreport-table-info">
            총 <span className="adminreport-count-bold">{totalElements}</span>건
          </div>
        </div>
        {/* 로딩 또는 에러 상태 */}
        {loading && <div>로딩 중...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
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
              {reports && reports.length > 0 ? (
                reports.map((report, index) => (
                  <tr key={report.reportIdx}>
                    <td>{currentPage * pageSize + index + 1}</td>
                    <td>{report.reportType === 'PRODUCT' ? '상품' : '가맹점'}</td>
                    <td>{report.reportRegNm}</td>
                    <td className="adminreport-table-title-cell">{getReportReasonText(report.reportReason)}</td>
                    <td>{report.reportRegDate}</td>
                    <td>
                      <span className={`adminreport-status ${report.reportStatus === 'COMPLETED' ? 'adminreport-status-complete' : 'adminreport-status-pending'}`}>
                        {report.reportStatus === 'COMPLETED' ? '처리완료' : report.reportStatus === 'REJECTED' ? '반려' : '처리대기'}
                      </span>
                    </td>
                    <td>{report.answerDate || '-'}</td>
                    <td>
                      <button
                        className="adminreport-detail-btn"
                        onClick={() => handleDetailClick(report)}
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    조회된 신고 내용이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="adminreport-pagination">
          <button 
            className="adminreport-page-btn"
            onClick={() => {
              if (currentPage > 0) {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                isSearchMode ? handleSearchInternal(newPage) : loadReports(newPage);
              }
            }}
            disabled={currentPage === 0 || totalPages === 0}
          >
            이전
          </button>
          {totalPages > 0 ? (
            [...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`adminreport-page-btn ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  isSearchMode ? handleSearchInternal(index) : loadReports(index);
                }}
              >
                {index + 1}
              </button>
            ))
          ) : (
            <button className="adminreport-page-btn active">
              1
            </button>
          )}
          <button 
            className="adminreport-page-btn"
            onClick={() => {
              if (currentPage < totalPages - 1) {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                isSearchMode ? handleSearchInternal(newPage) : loadReports(newPage);
              }
            }}
            disabled={currentPage === totalPages - 1 || totalPages === 0}
          >
            다음
          </button>
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