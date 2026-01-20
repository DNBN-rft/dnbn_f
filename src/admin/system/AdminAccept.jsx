import { useState, useEffect } from "react";
import "./css/adminaccept.css";
import AdminStoreDetail from "./modal/AdminStoreDetail";
import { getReadyStores, searchAccept } from "../../utils/adminStoreService";

const AdminAccept = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 검색 여부 플래그
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 오늘 날짜 구하기
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 필터 관리
  const [filters, setFilters] = useState({
    bizType: "",
    startDate: "",
    endDate: getTodayDate(),
    searchType: "all",
    searchKeyword: "",
  });

  // 승인 대기 가맹점 목록 조회
  const loadStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getReadyStores();
      if (result.success) {
        setStores(result.data?.content || []);
        setCurrentPage(result.data.number);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
        setIsSearchMode(false);
      } else {
        setError(result.error);
        setStores([]);
      }
    } catch (err) {
      setError("가맹점 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 목록 조회
  useEffect(() => {
    loadStores();
  }, []);

  const handleDetailClick = (store) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStore(null);
  };

  // 승인/거절 후 목록 새로고침
  const handleRefresh = () => {
    loadStores();
  };

  // 검색 내부 함수
  const handleSearchInternal = async (page = 0) => {
    // 검색 파라미터 매칭
    const searchParams = {
      bizType: filters.bizType,
      startDate: filters.startDate,
      endDate: filters.endDate,
      searchTerm: filters.searchKeyword,
      searchType: filters.searchType,
    };

    setLoading(true);
    setError(null);

    try {
      const result = await searchAccept(searchParams, page, pageSize);
      if (result.success) {
        setStores(result.data.content);
        setCurrentPage(result.data.number);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
        setIsSearchMode(true);
      } else {
        setError(result.error);
        alert(result.error);
      }
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    // 페이지를 0으로 다시 초기화
    setCurrentPage(0);
    // 검색 기능 구현 함수
    handleSearchInternal(0);
  };

  return (
    <div className="adminaccept-container">
      <div className="adminaccept-wrap">
        <div className="adminaccept-filter-wrap">
          <div className="adminaccept-filter-row">
            <div className="adminaccept-filter-group">
              <label htmlFor="biz-type">사업자구분</label>
              <select
                name="biz-type"
                id="biz-type"
                className="adminaccept-select"
                value={filters.bizType}
                onChange={(e) =>
                  setFilters({ ...filters, bizType: e.target.value })
                }
              >
                <option value="">전체</option>
                <option value="개인">개인사업자</option>
                <option value="법인">법인사업자</option>
              </select>
            </div>

            <div className="adminaccept-filter-group">
              <label htmlFor="accept-period">기간</label>
              <div className="adminaccept-date-group">
                <input
                  type="date"
                  id="adminaccept-start-date"
                  className="adminaccept-date-input"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
                <span className="adminaccept-date-separator">~</span>
                <input
                  type="date"
                  id="adminaccept-end-date"
                  className="adminaccept-date-input"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="adminaccept-filter-row adminaccept-search-row">
            <div className="adminaccept-search-group">
              <select
                name="type"
                id="type"
                className="adminaccept-select-type"
                value={filters.searchType}
                onChange={(e) =>
                  setFilters({ ...filters, searchType: e.target.value })
                }
              >
                <option value="all">전체</option>
                <option value="bizNm">상호명</option>
                <option value="bizNo">사업자번호</option>
                <option value="ownerNm">대표자명</option>
              </select>
              <input
                type="text"
                className="adminaccept-input"
                placeholder="검색어를 입력하세요"
                value={filters.searchKeyword}
                onChange={(e) =>
                  setFilters({ ...filters, searchKeyword: e.target.value })
                }
              />
              <button className="adminaccept-search-btn" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </div>

        <div className="adminaccept-table-wrap">
          <div className="adminaccept-table-header">
            <div className="adminaccept-table-info">
              총 <span className="adminaccept-count">{totalElements}</span>건
            </div>
          </div>

          {loading && <div className="adminaccept-loading">로딩 중...</div>}

          {error && <div className="adminaccept-error">{error}</div>}

          <table className="adminaccept-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>사업자구분</th>
                <th>상호명</th>
                <th>사업자번호</th>
                <th>대표자명</th>
                <th>연락처</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && stores.length === 0 && (
                <tr>
                  <td colSpan="8" className="adminaccept-empty">
                    승인 대기 중인 가맹점이 없습니다.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                stores.map((store, index) => (
                  <tr key={store.storeCode || index}>
                    <td>{index + 1}</td>
                    <td>{store.bizType || "-"}</td>
                    <td>{store.storeNm || "-"}</td>
                    <td>{store.bizNo || "-"}</td>
                    <td>{store.ownerNm || "-"}</td>
                    <td>{store.ownerTelNo || "-"}</td>
                    <td>
                      {store.requestedDateTime
                        ? new Date(store.requestedDateTime).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="adminaccept-btn adminaccept-btn-detail"
                        onClick={() => handleDetailClick(store)}
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="adminaccept-pagination">
          <button className="adminaccept-page-btn"
            onClick={() => {
              if (currentPage > 0) {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                isSearchMode ? handleSearchInternal(newPage) : loadStores(newPage);
              }
            }}
            disabled={currentPage === 0}>
            이전
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`adminaccept-page-btn ${currentPage === index ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage(index);
                isSearchMode ? handleSearchInternal(index) : loadStores(index);
              }}
            >
              {index + 1}
              </button>
            ))}
          <button
            className="adminaccept-page-btn"
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

      {showModal && selectedStore && (
        <AdminStoreDetail
          store={selectedStore}
          onClose={handleCloseModal}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default AdminAccept;
