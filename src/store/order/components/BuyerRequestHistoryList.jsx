import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../../utils/apiClient";
import { formatDateTime } from "../../../utils/commonService";
import BuyerRequestFilter from "./BuyerRequestFilter";
import "../css/buyerRequestHistory.css";

const BuyerRequestHistoryList = () => {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sliderMax, setSliderMax] = useState(100000);
  const [priceRange, setPriceRange] = useState("100000");
  const [isManualInput, setIsManualInput] = useState(false);

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

  const searchRequests = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const negoReqStatus = statusFilter === "ALL" ? null : statusFilter;

      const searchRequest = {
        minPriceRange: minPrice,
        maxPriceRange: maxPrice,
        startDateTime: startDate ? `${startDate}T00:00:00` : null,
        endDateTime: endDate ? `${endDate}T23:59:59` : null,
        negoReqStatus: negoReqStatus,
        productNm: searchText || null
      };

      const response = await apiPost(
        `/store/nego-req-log/search?page=${page}&size=${pageSize}`,
        searchRequest
      );
      const data = await response.json();
      
      if (response.ok) {
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setRequests(data.content);
        console.log("요청 이력 검색 결과:", data);
      } else {
        setError("요청 이력 검색에 실패했습니다.");
      }
    } catch (err) {
      console.error("검색 API 요청 실패:", err);
      setError("요청 이력 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleReset = () => {
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("ALL");
    setMinPrice(0);
    setMaxPrice(100000);
    setSliderMax(100000);
    setPriceRange("100000");
    setIsManualInput(false);
    setCurrentPage(0);
    loadRequests(0);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    searchRequests(0);
  };

  return (
    <div>
      <BuyerRequestFilter
        searchText={searchText}
        setSearchText={setSearchText}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sliderMax={sliderMax}
        setSliderMax={setSliderMax}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        isManualInput={isManualInput}
        setIsManualInput={setIsManualInput}
        handleSearch={handleSearch}
        handleReset={handleReset}
        isHistory={true}
      />

      <div className="buyerRequestHistory-table-wrap">
        <table className="buyerRequestHistory-table">
          <thead>
            <tr>
              <th>번호</th>
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
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>로딩 중...</td></tr>
            ) : error ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error}</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>구매자 요청 이력이 없습니다.</td></tr>
            ) : (
              requests.map((request, index) => (
                <tr key={request.requestId || index}>
                  <td>{index + 1}</td>
                  <td>
                    <div>
                      <span>{request.categoryNm}</span>
                      <span>{request.productNm}</span>
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

        <div className="buyerRequestHistory-footer">
          <div className="buyerRequestHistory-count">
            전체 {totalElements}개 요청 이력
          </div>
          <div className="buyerRequestHistory-pagination">
            <button 
              className="buyerRequestHistory-page" 
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
                className={`buyerRequestHistory-page ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  loadRequests(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="buyerRequestHistory-page"
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
          <div className="buyerRequestHistory-footer-spacer"></div>
        </div>
      </div>
    </div>
  );
};

export default BuyerRequestHistoryList;
