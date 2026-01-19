import { useState, useEffect } from "react";
import "./css/adminstoreinfo.css";
import StoreInfoModal from "./modal/StoreInfoModal";
import { getAllStores, getStoreDetail, searchStores } from "../../utils/adminStoreService";

const AdminStoreInfo = () => {
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
  
  // 정렬 상태
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  
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
    try {
      // 상세 정보 조회
      const result = await getStoreDetail(store.storeCode);
      if (result.success) {
        setSelectedStore(result.data);
        setIsDetailOpen(true);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("모달 오픈 중 오류:", error);
      alert("가맹점 정보 조회 실패");
    }
  };

  const handleCloseModal = () => {
    setIsDetailOpen(false);
    setSelectedStore(null);
  };

  // 정렬 처리 함수
  const handleSort = (column) => {
    if (sortColumn === column) {
      // 같은 컬럼이면 방향 토글
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 컬럼이면 오름차순으로 시작
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // 정렬된 리스트 반환
  const getSortedList = () => {
    if (!sortColumn) return storeList;

    const sorted = [...storeList].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // null/undefined 처리
      if (aVal == null) aVal = '';
      if (bVal == null) bVal = '';

      // 구독명 커스텀 정렬
      if (sortColumn === 'planNm') {
        const planOrder = ['Default', 'Free', 'Basic', 'Standard', 'Premium', 'Wide Area', 'Special'];
        const aIndex = planOrder.findIndex(p => p.toLowerCase() === String(aVal).toLowerCase());
        const bIndex = planOrder.findIndex(p => p.toLowerCase() === String(bVal).toLowerCase());
        
        const aOrderIndex = aIndex === -1 ? planOrder.length : aIndex;
        const bOrderIndex = bIndex === -1 ? planOrder.length : bIndex;
        
        if (sortDirection === 'asc') {
          return aOrderIndex - bOrderIndex;
        } else {
          return bOrderIndex - aOrderIndex;
        }
      }

      // 승인일 날짜 정렬
      if (sortColumn === 'approvedDateTime') {
        const aDate = aVal ? new Date(aVal) : new Date(0);
        const bDate = bVal ? new Date(bVal) : new Date(0);
        
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }

      // 숫자인 경우 숫자로 비교
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // 문자열로 변환 후 비교
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal, 'ko-KR');
      } else {
        return bVal.localeCompare(aVal, 'ko-KR');
      }
    });

    return sorted;
  };

  // const handleUpdate = () => {
  //   // 수정 후 목록 새로고침
  //   if (isSearchMode) {
  //     handleSearchInternal(currentPage);
  //   } else {
  //     loadStores(currentPage);
  //   }
  // };

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

            {/* <div className="adminstoreinfo-filter-group">
              <label htmlFor="business-type">업태</label>
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
            </div> */}
            
            {
              /*
              가맹점 타입 필터 (현재 사용 안함)
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
            */
            }
            
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
                <th 
                  className="adminstoreinfo-sortable"
                  onClick={() => handleSort('storeCode')}
                >
                  가맹코드
                  <span className="adminstoreinfo-sort-icon">
                    {sortColumn === 'storeCode' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </th>
                <th 
                  className="adminstoreinfo-sortable"
                  onClick={() => handleSort('storeNm')}
                >
                  가맹점명
                  <span className="adminstoreinfo-sort-icon">
                    {sortColumn === 'storeNm' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </th>
                <th 
                  className="adminstoreinfo-sortable"
                  onClick={() => handleSort('planNm')}
                >
                  구독명
                  <span className="adminstoreinfo-sort-icon">
                    {sortColumn === 'planNm' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </th>
                <th>구독가격</th>
                <th>점주명</th>
                <th>연락처</th>
                <th>업태</th>
                <th 
                  className="adminstoreinfo-sortable"
                  onClick={() => handleSort('approvedDateTime')}
                >
                  승인일
                  <span className="adminstoreinfo-sort-icon">
                    {sortColumn === 'approvedDateTime' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </th>
                <th>승인 상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                    로딩 중...
                  </td>
                </tr>
              ) : getSortedList().length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                    가맹점이 없습니다.
                  </td>
                </tr>
              ) : (
                getSortedList().map((store, index) => (
                  <tr key={store.storeCode}>
                    <td>{currentPage * pageSize + index + 1}</td>
                    <td>{store.storeCode}</td>
                    <td>{store.storeNm}</td>
                    <td>{store.planNm}</td>
                    <td>{store.planPrice}</td>
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
              className="adminstoreinfo-page-btn"
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
                className={`adminstoreinfo-page-btn ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  isSearchMode ? handleSearchInternal(index) : loadStores(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="adminstoreinfo-page-btn"
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
          storeCode={selectedStore.storeCode}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminStoreInfo;