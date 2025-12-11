import { useState } from "react";
import "./css/adminaccept.css";
import AdminStoreDetail from "./modal/AdminStoreDetail";

const AdminAccept = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDetailClick = (store) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStore(null);
  };

  // 샘플 데이터
  const sampleStore = {
    no: 1,
    businessType: "개인사업자",
    storeName: "동네가게",
    businessNumber: "123-45-67890",
    representativeName: "홍길동",
    contact: "010-1234-5678",
    registrationDate: "2024-06-01",
    franchiseName: "동네비빔밥",
    address: "서울특별시 강남구 테헤란로 123",
    franchiseType: "일반상품",
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
              총 <span className="adminaccept-count">1</span>건
            </div>
          </div>

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
              <tr>
                <td>{sampleStore.no}</td>
                <td>{sampleStore.businessType}</td>
                <td>{sampleStore.storeName}</td>
                <td>{sampleStore.businessNumber}</td>
                <td>{sampleStore.representativeName}</td>
                <td>{sampleStore.contact}</td>
                <td>{sampleStore.registrationDate}</td>
                <td>
                  <button
                    className="adminaccept-btn adminaccept-btn-detail"
                    onClick={() => handleDetailClick(sampleStore)}
                  >
                    상세
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="adminaccept-pagination">
          <button className="adminaccept-pagination-btn">이전</button>
          <div className="adminaccept-pagination-numbers">
            <button className="adminaccept-page-number adminaccept-page-active">
              1
            </button>
          </div>
          <button className="adminaccept-pagination-btn">다음</button>
        </div>
      </div>

      {showModal && selectedStore && (
        <AdminStoreDetail store={selectedStore} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AdminAccept;
