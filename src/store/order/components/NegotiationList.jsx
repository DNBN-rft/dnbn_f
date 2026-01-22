import { useState, useEffect } from "react";
import { apiGet } from "../../../utils/apiClient";
import { formatDateTime } from "../../../utils/commonService";

const NegotiationList = () => {
  const [searchField, setSearchField] = useState("productNm");
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const loadNegotiations = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet(`/store/nego/list?page=${page}&size=${pageSize}`);
      const data = await response.json();
      
      if (response.ok) {
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setNegotiations(data.content);
      } else {
        setError("네고 조회에 실패했습니다.");
      }
    } catch (err) {
      console.error("API 요청 실패:", err);
      setError("네고 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNegotiations();
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
      <div className="negotiation-filter">
        <div className="negotiation-date-range">
          <div className="negotiation-date-range-inner">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="negotiation-date-sep">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="negotiation-search">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="productNm">상품명</option>
              <option value="saleNum">판매번호</option>
              <option value="productCode">상품코드</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="negotiation-search-input"
            />
            <div className="negotiation-search-btn">
              <button className="negotiation-btn" onClick={handleSearch}>검색</button>
              <button className="negotiation-btn" onClick={handleReset}>초기화</button>
            </div>
          </div>
        </div>
      </div>

      <div className="negotiation-table-wrap">
        <table className="negotiation-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>상품코드</th>
              <th>상품명</th>
              <th>상품가격</th>
              <th>시작일시</th>
              <th>종료일시</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>로딩 중...</td></tr>
            ) : error ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error}</td></tr>
            ) : negotiations.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>네고 요청이 없습니다.</td></tr>
            ) : (
              negotiations.map((nego, index) => (
                <tr key={nego.negoId || index}>
                  <td>{index + 1}</td>
                  <td>{nego.productCode}</td>
                  <td>
                    <div>
                      <div>{nego.categoryNm}</div>
                      <div>{nego.productNm}</div>
                    </div>
                  </td>
                  <td>{nego.productPrice?.toLocaleString()}원</td>
                  <td>{formatDateTime(nego.startDateTime)}</td>
                  <td>{formatDateTime(nego.endDateTime)}</td>
                  <td>
                    <button className="negotiation-btn outline danger">취소</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="negotiation-footer">
          <div className="negotiation-count">
            전체 {totalElements}개 네고
          </div>
          <div className="negotiation-pagination">
            <button 
              className="negotiation-page" 
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadNegotiations(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`negotiation-page ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  loadNegotiations(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="negotiation-page"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadNegotiations(newPage);
                }
              }}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
          <div className="negotiation-footer-spacer"></div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationList;
