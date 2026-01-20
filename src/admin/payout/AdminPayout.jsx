import { useState, useEffect } from "react";
import "./css/adminpayout.css";
import { useNavigate } from "react-router-dom";

const AdminPayout = () => {
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

  // 정산 대기 목록 조회
  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: API 호출로 교체
      // const result = await getPendingPayouts(page, pageSize);
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
    <div className="adminpayout-container">
      <div className="adminpayout-wrap">
        {/* 탭 네비게이션 */}
        <div className="adminpayout-tab-navigation">
          <button className="adminpayout-tab-btn adminpayout-tab-active">
            정산 대기
          </button>
          <button
            className="adminpayout-tab-btn"
            onClick={() => {
              navigate("/admin/payout/completed");
            }}
          >
            정산 완료
          </button>
        </div>

        {/* 필터 영역 */}
        <div className="adminpayout-filter-wrap">
          <div className="adminpayout-filter-row">
            <div className="adminpayout-filter-group">
              <label>조회기간</label>
              <input
                type="date"
                className="adminpayout-date-input"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
              ~
              <input
                type="date"
                className="adminpayout-date-input"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>
            <div className="adminpayout-search-group">
              <button
                className="adminpayout-search-btn"
                onClick={handleSearch}
              >
                검색
              </button>
              <button
                className="adminpayout-reset-btn"
                onClick={handleReset}
              >
                초기화
              </button>
            </div>
          </div>
        </div>

        {/* 테이블 영역 */}
        <div className="adminpayout-table-wrap">
          <div className="adminpayout-table-header">
            <div className="adminpayout-table-info">
              총 <b>{totalElements}</b>건
            </div>
            <button
              className="adminpayout-btn-excel"
              onClick={handleExcelDownload}
            >
              엑셀 다운로드
            </button>
          </div>

          {loading ? (
            <div className="adminpayout-loading">로딩 중</div>
          ) : error ? (
            <div className="adminpayout-error">{error}</div>
          ) : (
            <table className="adminpayout-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>가맹점명</th>
                  <th>정산 금액</th>
                  <th>수수료</th>
                  <th>실 정산액</th>
                  <th>정산 예정일</th>
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
                        {new Date(payout.scheduledDate).toLocaleDateString()}
                      </td>
                      <td className="adminpayout-status-pending">대기</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 페이지네이션 */}
          <div className="adminpayout-pagination">
            <button
              className="adminpayout-page-btn"
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
                className={`adminpayout-page-btn ${
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
              className="adminpayout-page-btn"
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

export default AdminPayout;