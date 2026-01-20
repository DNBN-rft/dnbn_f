import { useState, useEffect } from "react";
import "./css/adminpayoutcompleted.css";
import { useNavigate } from "react-router-dom";

const AdminPayoutCompleted = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [payouts, setPayouts] = useState([]);
  // const [selectedPayouts, setSelectedPayouts] = useState([]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 오늘 날짜 구하기
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 필터 상태
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: getTodayDate(),
  });

  // 정산 완료 목록 조회
  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: API 호출로 교체
      // const result = await getCompletedPayouts(page, pageSize);
      // if (result.success) {
      //   setPayouts(result.data.content);
      //   setCurrentPage(result.data.number);
      //   setTotalPages(result.data.totalPages);
      //   setTotalElements(result.data.totalElements);
      // } else {
      //   setError(result.error);
      //   setPayouts([]);
      // }
      
      // 임시 데이터
      setPayouts([]);
      setCurrentPage(0);
      setTotalPages(0);
      setTotalElements(0);
    } catch (err) {
      setError(err.message);
      console.error("정산 목록 조회 실패: ", err);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색
  const handleSearch = () => {
    setCurrentPage(0);
    loadPayouts(0);
  };

  // 필터 초기화
  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: getTodayDate(),
    });
    setCurrentPage(0);
    loadPayouts(0);
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    // TODO: 엑셀 다운로드 API 호출
    alert("엑셀 다운로드 기능은 준비 중입니다.");
  };

  return (
    <div className="adminpayout-completed-container">
      <div className="adminpayout-completed-wrap">
        {/* 탭 네비게이션 */}
        <div className="adminpayout-completed-tab-navigation">
          <button
            className="adminpayout-completed-tab-btn"
            onClick={() => {
              navigate("/admin/payout");
            }}
          >
            정산 대기
          </button>
          <button className="adminpayout-completed-tab-btn adminpayout-completed-tab-active">
            정산 완료
          </button>
        </div>

        {/* 필터 영역 */}
        <div className="adminpayout-completed-filter-wrap">
          <div className="adminpayout-completed-filter-row">
            <div className="adminpayout-completed-filter-group">
              <label>조회기간</label>
              <input
                type="date"
                className="adminpayout-completed-date-input"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
              ~
              <input
                type="date"
                className="adminpayout-completed-date-input"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>
            <div className="adminpayout-completed-search-group">
              <button
                className="adminpayout-completed-search-btn"
                onClick={handleSearch}
              >
                검색
              </button>
              <button
                className="adminpayout-completed-reset-btn"
                onClick={handleReset}
              >
                초기화
              </button>
            </div>
          </div>
        </div>

        {/* 테이블 영역 */}
        <div className="adminpayout-completed-table-wrap">
          <div className="adminpayout-completed-table-header">
            <div className="adminpayout-completed-table-info">
              총 <b>{totalElements}</b>건
            </div>
            <button
              className="adminpayout-completed-btn-excel"
              onClick={handleExcelDownload}
            >
              엑셀 다운로드
            </button>
          </div>

          {loading ? (
            <div className="adminpayout-completed-loading">로딩 중</div>
          ) : error ? (
            <div className="adminpayout-completed-error">{error}</div>
          ) : (
            <table className="adminpayout-completed-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>가맹점명</th>
                  <th>정산 금액</th>
                  <th>수수료</th>
                  <th>실 정산액</th>
                  <th>정산 완료일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      등록된 정산 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  payouts.map((payout, index) => (
                    <tr key={payout.payoutIdx}>
                      <td>{currentPage * pageSize + index + 1}</td>
                      <td>{payout.storeNm}</td>
                      <td>{payout.amount?.toLocaleString()}원</td>
                      <td>{payout.fee?.toLocaleString()}원</td>
                      <td>{payout.netAmount?.toLocaleString()}원</td>
                      <td>
                        {new Date(payout.completedDate).toLocaleDateString()}
                      </td>
                      <td className="adminpayout-completed-status-completed">완료</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 페이지네이션 */}
          <div className="adminpayout-completed-pagination">
            <button
              className="adminpayout-completed-page-btn"
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadPayouts(newPage);
                }
              }}
              disabled={currentPage === 0 || totalPages === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`adminpayout-completed-page-btn ${
                  currentPage === index ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentPage(index);
                  loadPayouts(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="adminpayout-completed-page-btn"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadPayouts(newPage);
                }
              }}
              disabled={totalPages === 0 || currentPage >= totalPages - 1}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayoutCompleted;
