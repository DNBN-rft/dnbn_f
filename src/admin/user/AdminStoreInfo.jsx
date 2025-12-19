import { useState, useEffect } from "react";
import "./css/adminstoreinfo.css";
import StoreInfoModal from "./modal/StoreInfoModal";
import { getAllStores, viewStoreDetail, approveStore, searchStores } from "../../utils/adminStoreService";

const StoreInfo = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  
  // 검색 여부 플래그
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    approvalStatus: "",
    bizType: "",
    storeType: "all",
    searchType: "all",
    searchTerm: "",
  });

  // 가맹점 목록 조회
  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async (page = 0) => {
    setIsLoading(true);
    const result = await getAllStores(page, pageSize);

    if (result.success && result.data) {
      setStoreList(result.data.content || []);
      setCurrentPage(result.data.number || 0);
      setTotalPages(result.data.totalPages || 0);
      setTotalElements(result.data.totalElements || 0);
      setIsSearchMode(false);
    } else {
      console.error(result.error);
      setStoreList([]);
      setTotalPages(0);
      setTotalElements(0);
      if (result.error) {
        alert(result.error);
      }
    }
    setIsLoading(false);
  };

  // 검색 내부 함수
  const handleSearchInternal = async (page = 0) => {
    const searchParams = {
      ...(filters.approvalStatus && { approvalStatus: filters.approvalStatus }),
      ...(filters.bizType && filters.bizType !== "all" && { bizType: filters.bizType }),
      ...(filters.searchType && { searchType: filters.searchType }),
      ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
    };

    setIsLoading(true);
    const result = await searchStores(searchParams, page, pageSize);
    if (result.success && result.data) {
      setStoreList(result.data.content || []);
      setCurrentPage(result.data.number || 0);
      setTotalPages(result.data.totalPages || 0);
      setTotalElements(result.data.totalElements || 0);
      setIsSearchMode(true);
    } else {
      setStoreList([]);
      setTotalPages(0);
      setTotalElements(0);
      if (result.error) {
        alert(result.error);
      }
    }
    setIsLoading(false);
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setCurrentPage(0);
    handleSearchInternal(0);
  };

  // 필터 초기화
  const handleReset = () => {
    setFilters({
      approvalStatus: "",
      bizType: "",
      storeType: "all",
      searchType: "all",
      searchTerm: "",
    });
    setCurrentPage(0);
    loadStores(0);
  };

  const handleOpenModal = async (store) => {
    // 상세 정보 조회
    const result = await viewStoreDetail(store.storeCode);
    if (result.success) {
      setSelectedStore(result.data);
      setIsDetailOpen(true);
    } else {
      alert(result.error);
    }
  };

  const handleCloseModal = () => {
    setIsDetailOpen(false);
    setSelectedStore(null);
  };

  const handleUpdate = () => {
    // 수정 후 목록 새로고침
    if (isSearchMode) {
      handleSearchInternal(currentPage);
    } else {
      loadStores(currentPage);
    }
  };

  const handleApprovalChange = async (storeCode) => {
    if (!window.confirm("가맹점을 승인하시겠습니까?")) {
      return;
    }

    const result = await approveStore(storeCode);
    if (result.success) {
      alert("승인되었습니다.");
      if (isSearchMode) {
        handleSearchInternal(currentPage);
      } else {
        loadStores(currentPage);
      }
      handleCloseModal();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="adminstoreinfo-container">
      <div className="adminstoreinfo-wrap">
        <div className="adminstoreinfo-filter-wrap">
          <div className="adminstoreinfo-filter-row">
            <div className="adminstoreinfo-filter-group">
              <label htmlFor="store-status">승인 상태</label>
              <select
                name="store-status"
                id="store-status"
                className="adminstoreinfo-select"
                value={filters.approvalStatus}
                onChange={(e) => setFilters({...filters, approvalStatus: e.target.value})}
              >
                <option value="">전체</option>
                <option value="APPROVED">승인</option>
                <option value="PENDING">대기중</option>
                <option value="REJECTED">승인 거절</option>
              </select>
            </div>

            <div className="adminstoreinfo-filter-group">
              <label htmlFor="business-type">사업자 구분</label>
              <select
                name="business-type"
                id="business-type"
                className="adminstoreinfo-select"
                value={filters.bizType}
                onChange={(e) => setFilters({...filters, bizType: e.target.value})}
              >
                <option value="">전체</option>
                <option value="개인">개인</option>
                <option value="법인">법인</option>
              </select>
            </div>

            <div className="adminstoreinfo-filter-group">
              <label htmlFor="store-type">가맹점 타입</label>
              <select
                name="store-type"
                id="store-type"
                className="adminstoreinfo-select"
                value={filters.storeType || "all"}
                onChange={(e) => setFilters({...filters, storeType: e.target.value})}
              >
                <option value="all">전체</option>
                <option value="normal">가맹점</option>
                <option value="wholesale">도매점</option>
              </select>
            </div>
          </div>

          <div className="adminstoreinfo-filter-row storeinfo-search-row">
            <div className="adminstoreinfo-search-group">
              <select
                name="search-type"
                id="search-type"
                className="adminstoreinfo-select-type"
                value={filters.searchType}
                onChange={(e) => setFilters({...filters, searchType: e.target.value})}
              >
                <option value="all">전체</option>
                <option value="storeName">가맹점명</option>
                <option value="storeCode">가맹코드</option>
                <option value="ownerName">점주명</option>
                <option value="businessNumber">사업자번호</option>
              </select>
              <input
                type="text"
                className="adminstoreinfo-input"
                placeholder="검색어를 입력하세요"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              />
              <button className="adminstoreinfo-search-btn" onClick={handleSearch}>검색</button>
              <button className="adminstoreinfo-search-btn" onClick={handleReset}>초기화</button>
            </div>
          </div>
        </div>

        <div className="adminstoreinfo-table-wrap">
          <div className="adminstoreinfo-table-header">
            <div className="adminstoreinfo-table-info">
              총 <span className="adminstoreinfo-count">{totalElements}</span>건
            </div>
          </div>

          <table className="adminstoreinfo-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>가맹코드</th>
                <th>가맹점명</th>
                <th>점주명</th>
                <th>연락처</th>
                <th>사업자 구분</th>
                <th>승인일</th>
                <th>승인 상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                    로딩 중...
                  </td>
                </tr>
              ) : storeList.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                    가맹점이 없습니다.
                  </td>
                </tr>
              ) : (
                storeList.map((store, index) => (
                  <tr key={store.storeCode}>
                    <td>{currentPage * pageSize + index + 1}</td>
                    <td>{store.storeCode}</td>
                    <td>{store.storeNm}</td>
                    <td>{store.ownerNm}</td>
                    <td>{store.ownerTelNo}</td>
                    <td>{store.bizType}</td>
                    <td>{store.approvedDateTime ? new Date(store.approvedDateTime).toLocaleDateString() : "-"}</td>
                    <td
                      className={`storeinfo-status-${store.approvalStatus === "APPROVED"
                          ? "approved"
                          : store.approvalStatus === "REJECTED"
                            ? "rejected"
                            : "pending"
                        }`}
                    >
                      {store.approvalStatus === "APPROVED"
                        ? "승인"
                        : store.approvalStatus === "REJECTED"
                          ? "거절"
                          : "대기 중"}
                    </td>
                    <td>
                      <button
                        className="adminstoreinfo-btn adminstoreinfo-btn-detail"
                        onClick={() => handleOpenModal(store)}
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="adminstoreinfo-pagination">
            <button 
              className="adminstoreinfo-pagination-btn"
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  isSearchMode ? handleSearchInternal(newPage) : loadStores(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`adminstoreinfo-pagination-btn ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  isSearchMode ? handleSearchInternal(index) : loadStores(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="adminstoreinfo-pagination-btn"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  isSearchMode ? handleSearchInternal(newPage) : loadStores(newPage);
                }
              }}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {isDetailOpen && selectedStore && (
        <StoreInfoModal
          storeData={selectedStore}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
          onApprovalChange={handleApprovalChange}
        />
      )}
    </div>
  );
};

export default StoreInfo;
