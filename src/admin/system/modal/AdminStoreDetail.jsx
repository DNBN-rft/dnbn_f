import "./css/adminstoredetail.css";

const AdminStoreDetail = ({ store, onClose }) => {
  return (
    <div className="adminstoredetail-backdrop">
      <div
        className="adminstoredetail-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="adminstoredetail-header">
          <h2 className="adminstoredetail-title">가맹점 상세정보</h2>
          <button className="adminstoredetail-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="adminstoredetail-content">
          {/* 가맹이름 & 가맹타입 */}
          <div className="adminstoredetail-row">
            <label className="adminstoredetail-label">가맹이름</label>
            <div className="adminstoredetail-value">{store.franchiseName}</div>
            <label className="adminstoredetail-label adminstoredetail-label-inline">
              가맹타입
            </label>
            <div className="adminstoredetail-value adminstoredetail-value-inline adminstoredetail-value-type">
              <span
                className={
                  store.franchiseType === "일반상품"
                    ? "adminstoredetail-type-normal"
                    : "adminstoredetail-type-adult"
                }
              >
                {store.franchiseType}
              </span>
            </div>
          </div>

          {/* 주소 */}
          <div className="adminstoredetail-row">
            <label className="adminstoredetail-label">주소</label>
            <div className="adminstoredetail-value">{store.address}</div>
          </div>

          {/* 상호명 & 상호등록일 */}
          <div className="adminstoredetail-row">
            <label className="adminstoredetail-label">상호명</label>
            <div className="adminstoredetail-value">{store.storeName}</div>
            <label className="adminstoredetail-label adminstoredetail-label-inline">
              상호등록일
            </label>
            <div className="adminstoredetail-value adminstoredetail-value-inline">
              {store.registrationDate}
            </div>
          </div>

          {/* 사업자 구분 & 사업자 번호 */}
          <div className="adminstoredetail-row">
            <label className="adminstoredetail-label">사업자 구분</label>
            <div className="adminstoredetail-value">{store.businessType}</div>
            <label className="adminstoredetail-label adminstoredetail-label-inline">
              사업자 번호
            </label>
            <div className="adminstoredetail-value adminstoredetail-value-inline">
              {store.businessNumber}
            </div>
          </div>

          {/* 대표자명 & 연락처 */}
          <div className="adminstoredetail-row">
            <label className="adminstoredetail-label">대표자명</label>
            <div className="adminstoredetail-value">{store.representativeName}</div>
            <label className="adminstoredetail-label adminstoredetail-label-inline">
              연락처
            </label>
            <div className="adminstoredetail-value adminstoredetail-value-inline">
              {store.contact}
            </div>
          </div>
        </div>

        <div className="adminstoredetail-footer">
          <button
            className="adminstoredetail-btn adminstoredetail-btn-approve"
            onClick={() => {
              // 승인 로직 추가 예정
              console.log("승인:", store);
              onClose();
            }}
          >
            승인
          </button>
          <button
            className="adminstoredetail-btn adminstoredetail-btn-reject"
            onClick={() => {
              // 거부 로직 추가 예정
              console.log("거부:", store);
              onClose();
            }}
          >
            거부
          </button>
          <button
            className="adminstoredetail-btn adminstoredetail-btn-close"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStoreDetail;