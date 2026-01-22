import { useState, useEffect } from "react";
import { apiGet } from "../../../utils/apiClient";
import { formatDateTime } from "../../../utils/commonService";

const BuyerRequestHistoryList = () => {
  const [searchField, setSearchField] = useState("productNm");
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const loadRequests = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet(`/store/nego-req-log/list?page=${page}&size=${pageSize}`);
      const data = await response.json();
      
      if (response.ok) {
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setRequests(data.content);
      } else {
        setError("네고 요청 이력 조회에 실패했습니다.");
      }
    } catch (err) {
      console.error("API 요청 실패:", err);
      setError("네고 요청 이력 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleReset = () => {
    setSearchField("productNm");
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(0);
  };

  const handleSearch = () => {
    setCurrentPage(0);
  };

  return (
    <div>
      <div className="negotiationHistory-filter">
        <div className="negotiationHistory-date-range">
          <div className="negotiationHistory-date-range-inner">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="negotiationHistory-date-sep">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="negotiationHistory-search">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="productNm">상품명</option>
              <option value="custNm">구매자명</option>
              <option value="productCode">상품코드</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="negotiationHistory-search-input"
            />
            <div className="negotiationHistory-search-btn">
              <button className="negotiationHistory-btn" onClick={handleSearch}>검색</button>
              <button className="negotiationHistory-btn" onClick={handleReset}>초기화</button>
            </div>
          </div>
        </div>
      </div>

      <div className="negotiationHistory-table-wrap">
        <table className="negotiationHistory-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>상품코드</th>
              <th>상품명</th>
              <th>구매자명</th>
              <th>구매자 연락처</th>
              <th>요청가격</th>
              <th>요청일시</th>
              <th>처리일시</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>로딩 중...</td></tr>
            ) : error ? (
              <tr><td colSpan="9" style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error}</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>구매자 요청 이력이 없습니다.</td></tr>
            ) : (
              requests.map((request, index) => (
                <tr key={request.requestId || index}>
                  <td>{index + 1}</td>
                  <td>{request.productCode}</td>
                  <td>
                    <div>
                      <div>{request.categoryNm}</div>
                      <div>{request.productNm}</div>
                    </div>
                  </td>
                  <td>{request.custNm}</td>
                  <td>{request.custPhone}</td>
                  <td>{request.requestPrice?.toLocaleString()}원</td>
                  <td>{formatDateTime(request.requestDateTime)}</td>
                  <td>{request.responseDateTime ? formatDateTime(request.responseDateTime) : '-'}</td>
                  <td>{request.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="negotiationHistory-footer">
          <div className="negotiationHistory-count">
            전체 {totalElements}개 요청 이력
          </div>
          <div className="negotiationHistory-pagination">
            <button 
              className="negotiationHistory-page" 
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadRequests(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(Math.max(1, totalPages))].map((_, index) => (
              <button
                key={index}
                className={`negotiationHistory-page ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  loadRequests(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="negotiationHistory-page"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadRequests(newPage);
                }
              }}
              disabled={currentPage >= totalPages - 1 || totalPages <= 1}
            >
              다음
            </button>
          </div>
          <div className="negotiationHistory-footer-spacer"></div>
        </div>
      </div>
    </div>
  );
};

export default BuyerRequestHistoryList;
