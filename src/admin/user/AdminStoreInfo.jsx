import { useState, useEffect } from "react";
import "./css/adminstoreinfo.css";
import StoreInfoModal from "./modal/StoreInfoModal";
import { getAllStores, getStoreDetail, approveStore } from "../../utils/adminStoreService";

const StoreInfo = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchType, setSearchType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 가맹점 목록 조회
  useEffect(() => {
    fetchStoreList();
  }, []);

  const fetchStoreList = async () => {
    setIsLoading(true);
    const result = await getAllStores();
    if (result.success) {
      setStoreList(result.data);
    } else {
      console.error(result.error);
      alert(result.error);
    }
    setIsLoading(false);
  };

  const handleOpenModal = async (store) => {
    // 상세 정보 조회
    const result = await getStoreDetail(store.storeCode);
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
    fetchStoreList();
  };

  const handleApprovalChange = async (storeCode) => {
    if (!window.confirm("가맹점을 승인하시겠습니까?")) {
      return;
    }

    const result = await approveStore(storeCode);
    if (result.success) {
      alert("승인되었습니다.");
      fetchStoreList();
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
              >
                <option value="all">전체</option>
                <option value="approved">승인</option>
                <option value="pending">대기중</option>
                <option value="rejected">승인 거절</option>
              </select>
            </div>

            <div className="adminstoreinfo-filter-group">
              <label htmlFor="business-type">사업자 구분</label>
              <select
                name="business-type"
                id="business-type"
                className="adminstoreinfo-select"
              >
                <option value="all">전체</option>
                <option value="personal">개인</option>
                <option value="corporate">법인</option>
              </select>
            </div>

            <div className="adminstoreinfo-filter-group">
              <label htmlFor="store-type">가맹점 타입</label>
              <select
                name="store-type"
                id="store-type"
                className="adminstoreinfo-select"
              >
                <option value="all">전체</option>
                <option value="normal">일반상품</option>
                <option value="adult">성인상품</option>
              </select>
            </div>
          </div>

          <div className="adminstoreinfo-filter-row storeinfo-search-row">
            <div className="adminstoreinfo-search-group">
              <select
                name="search-type"
                id="search-type"
                className="adminstoreinfo-select-type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="storeName">가맹점명</option>
                <option value="userId">아이디</option>
                <option value="ownerName">점주명</option>
                <option value="businessNumber">사업자번호</option>
              </select>
              <input
                type="text"
                className="adminstoreinfo-input"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="adminstoreinfo-search-btn">검색</button>
            </div>
          </div>
        </div>

        <div className="adminstoreinfo-table-wrap">
          <div className="adminstoreinfo-table-header">
            <div className="adminstoreinfo-table-info">
              총 <span className="adminstoreinfo-count">{storeList.length}</span>건
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
                    <td>{index + 1}</td>
                    <td>{store.storeCode}</td>
                    <td>{store.storeNm}</td>
                    <td>{store.ownerNm}</td>
                    <td>{store.ownerTelNo}</td>
                    <td>{store.bizType}</td>
                    <td>{store.approvedDateTime ? new Date(store.approvedDateTime).toLocaleDateString() : "-"}</td>
                    <td
                      className={`storeinfo-status-${
                        store.isApproved ? "approved" : "pending"
                      }`}
                    >
                      {store.isApproved ? "승인" : "대기중"}
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

          <div className="adminstoreinfo-pagination">
            <button className="adminstoreinfo-pagination-btn">이전</button>
            <div className="adminstoreinfo-pagination-numbers">
              <button className="adminstoreinfo-page-number storeinfo-page-active">
                1
              </button>
              <button className="adminstoreinfo-page-number">2</button>
              <button className="adminstoreinfo-page-number">3</button>
            </div>
            <button className="adminstoreinfo-pagination-btn">다음</button>
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
