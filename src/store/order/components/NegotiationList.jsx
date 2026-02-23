import { useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "../../../utils/apiClient";
import { formatDateTime } from "../../../utils/commonService";
import NegotiationFilter from "./NegotiationFilter";

const NegotiationList = () => {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sliderMax, setSliderMax] = useState(100000);
  const [priceRange, setPriceRange] = useState("100000");
  const [isManualInput, setIsManualInput] = useState(false);

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
        console.log("네고 목록 데이터:", data);
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

  const searchNegotiations = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      // 상태 필터: ALL -> null, 그 외에는 그대로 전송 (ONGOING, UPCOMING)
      const negoStatus = statusFilter === "ALL" ? null : statusFilter;

      const searchRequest = {
        minPriceRange: minPrice,
        maxPriceRange: maxPrice,
        startDateTime: startDate ? `${startDate}T00:00:00` : null,
        endDateTime: endDate ? `${endDate}T23:59:59` : null,
        negoStatus: negoStatus,
        productNm: searchText || null
      };

      const response = await apiPost(
        `/store/nego/search?page=${page}&size=${pageSize}`,
        searchRequest
      );
      const data = await response.json();
      
      if (response.ok) {
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setNegotiations(data.content);
        console.log("네고 검색 결과:", data);
      } else {
        setError("네고 검색에 실패했습니다.");
      }
    } catch (err) {
      console.error("검색 API 요청 실패:", err);
      setError("네고 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNegotiations();
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
    loadNegotiations(0);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    searchNegotiations(0);
  };
  
  // 네고 취소 핸들러
  const negoCancelHandler = (negoIdx) => {
      const confirmed = window.confirm("정말 네고 등록 취소를 하시겠습니까?");
      if (confirmed) {
        handleCancelNego(negoIdx);
      }
  };
  
  const handleCancelNego = async (negoIdx) => {
    try {
      const response = await apiDelete(`/store/app/nego/cancel/${negoIdx}`);

      if (response.ok) {
        alert("네고 취소에 성공했습니다.");
        // 현재 페이지 유지하면서 새로고침 - 검색 조건이 있으면 검색, 없으면 일반 목록 로드
        const hasSearchCondition = searchText || startDate || endDate || statusFilter !== "ALL" || minPrice > 0 || maxPrice < 100000;
        if (hasSearchCondition) {
          searchNegotiations(currentPage);
        } else {
          loadNegotiations(currentPage);
        }
      } else {
        alert("네고 취소에 실패했습니다.");
      }
    } catch (error) {
      console.error("네고 취소 API 호출 에러:", error);
      alert("네고 취소 중 오류가 발생했습니다.");
    }
  }

  return (
    <div>
      <NegotiationFilter
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
      />

      <div className="negotiation-table-wrap">
        <table className="negotiation-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>상품명</th>
              <th>상품가격</th>
              <th>시작일시</th>
              <th>종료일시</th>
              <th>상태</th>
              <th>관리</th>
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
                  <td className="negotiation-product-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {nego.productImage ? (
                        <img 
                          src={nego.productImage} 
                          alt={nego.productNm}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#e0e0e0', borderRadius: '4px', flexShrink: 0 }} />
                      )}
                      <div>
                        <div className="negotiation-category">{nego.categoryNm}</div>
                        <div className="negotiation-name">{nego.productNm}</div>
                      </div>
                    </div>
                  </td>
                  <td>{nego.productPrice?.toLocaleString()}원</td>
                  <td>{formatDateTime(nego.startDateTime)}</td>
                  <td>{formatDateTime(nego.endDateTime)}</td>
                  <td>
                    <span className={`negotiation-status ${nego.negoStatus === '진행 중' ? 'ongoing' : 'upcoming'}`}>
                      {nego.negoStatus === '진행 중' ? '진행' : '대기'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="negotiation-btn outline danger"
                      onClick={() => negoCancelHandler(nego.negoIdx)}
                    >취소</button>
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
            {[...Array(Math.max(1, totalPages))].map((_, index) => (
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
              disabled={totalPages <= 1 || currentPage >= totalPages - 1}
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
