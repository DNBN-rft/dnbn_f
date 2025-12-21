import { useState, useEffect } from "react";
import "./css/adminaccept.css";
import AdminStoreDetail from "./modal/AdminStoreDetail";
import { getReadyStores } from "../../utils/adminStoreService";

const AdminAccept = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 승인 대기 가맹점 목록 조회
  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getReadyStores();
      if (result.success) {
        setStores(result.data?.content || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("가맹점 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 목록 조회
  useEffect(() => {
    fetchStores();
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
    fetchStores();
  };

  return (
    <div className="adminaccept-container">
      <div className="adminaccept-wrap">
        <div className="adminaccept-filter-wrap">
          <div className="adminaccept-filter-row">
            <div className="adminaccept-filter-group">
              <label htmlFor="accept-type">사업자구분</label>
              <select
                name="accept-type"
                id="accept-type"
                className="adminaccept-select"
              >
                <option value="all">전체</option>
                <option value="personal">개인사업자</option>
                <option value="corporate">법인사업자</option>
              </select>
            </div>

            <div className="adminaccept-filter-group">
              <label htmlFor="accept-period">기간</label>
              <div className="adminaccept-date-group">
                <input type="date" className="adminaccept-date-input" />
                <span className="adminaccept-date-separator">~</span>
                <input type="date" className="adminaccept-date-input" />
              </div>
            </div>
          </div>

          <div className="adminaccept-filter-row adminaccept-search-row">
            <div className="adminaccept-search-group">
              <select name="option" id="option" className="adminaccept-select-type">
                <option value="all">전체</option>
                <option value="storeName">상호명</option>
                <option value="businessNumber">사업자번호</option>
                <option value="representativeName">대표자명</option>
              </select>
              <input
                type="text"
                className="adminaccept-input"
                placeholder="검색어를 입력하세요"
              />
              <button className="adminaccept-search-btn">검색</button>
            </div>
          </div>
        </div>

        <div className="adminaccept-table-wrap">
          <div className="adminaccept-table-header">
            <div className="adminaccept-table-info">
              총 <span className="adminaccept-count">{stores.length}</span>건
            </div>
          </div>

          {loading && (
            <div className="adminaccept-loading">로딩 중...</div>
          )}

          {error && (
            <div className="adminaccept-error">{error}</div>
          )}

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
              {!loading && !error && stores.map((store, index) => (
                <tr key={store.storeCode || index}>
                  <td>{index + 1}</td>
                  <td>{store.bizType || "-"}</td>
                  <td>{store.storeNm || "-"}</td>
                  <td>{store.bizNo || "-"}</td>
                  <td>{store.ownerNm || "-"}</td>
                  <td>{store.ownerTelNo || "-"}</td>
                  <td>{store.requestedDateTime ? new Date(store.requestedDateTime).toLocaleDateString() : "-"}</td>
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
          <button className="adminaccept-page-btn" disabled>이전</button>
          <button className="adminaccept-page-btn active">1</button>
          <button className="adminaccept-page-btn" disabled>다음</button>
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
