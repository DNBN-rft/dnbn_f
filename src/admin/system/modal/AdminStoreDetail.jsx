import "./css/adminstoredetail.css";
import { approveStore, rejectStore, getPendingStoreDetail } from "../../../utils/adminStoreService";
import { useState, useEffect } from "react";

const AdminStoreDetail = ({ store, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [storeDetail, setStoreDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);

  // 상세 정보 조회
  useEffect(() => {
    const fetchStoreDetail = async () => {
      setDetailLoading(true);
      try {
        const result = await getPendingStoreDetail(store.storeCode);
        if (result.success) {
          setStoreDetail(result.data);
        } else {
          alert(result.error);
          onClose();
        }
      } catch (error) {
        alert("상세 정보를 불러오는 중 오류가 발생했습니다.");
        onClose();
      } finally {
        setDetailLoading(false);
      }
    };

    if (store.storeCode) {
      fetchStoreDetail();
    }
  }, [store.storeCode, onClose]);

  // 승인 처리
  const handleApprove = async () => {
    if (!window.confirm("해당 가맹점을 승인하시겠습니까?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await approveStore(store.storeCode);
      if (result.success) {
        alert(result.data || "성공적으로 승인하였습니다.");
        onClose();
        if (onRefresh) onRefresh(); // 목록 새로고침
      } else {
        alert(result.error || "승인 처리에 실패했습니다.");
      }
    } catch (error) {
      alert("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 거절 처리
  const handleReject = async () => {
    if (!window.confirm("해당 가맹점을 거절하시겠습니까?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await rejectStore(store.storeCode);
      if (result.success) {
        alert(result.data || "성공적으로 거절되었습니다.");
        onClose();
        if (onRefresh) onRefresh(); // 목록 새로고침
      } else {
        alert(result.error || "거절 처리에 실패했습니다.");
      }
    } catch (error) {
      alert("거절 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
          {detailLoading ? (
            <div className="adminstoredetail-loading">로딩 중...</div>
          ) : storeDetail ? (
            <>
              {/* 상호명 & 가맹타입 */}
              <div className="adminstoredetail-row">
                <label className="adminstoredetail-label">상호명</label>
                <div className="adminstoredetail-value">{storeDetail.storeNm || "-"}</div>
              </div>

              {/* 주소 */}
              <div className="adminstoredetail-row">
                <label className="adminstoredetail-label">주소</label>
                <div className="adminstoredetail-value">
                  {storeDetail.storeAddr || ""} {storeDetail.storeDetailAddr || ""}
                </div>
              </div>

              {/* 업체명 & 사업자등록일 */}
              <div className="adminstoredetail-row">
                <label className="adminstoredetail-label">업체명</label>
                <div className="adminstoredetail-value">{storeDetail.bizNm || "-"}</div>
                <label className="adminstoredetail-label adminstoredetail-label-inline">
                  사업자등록일
                </label>
                <div className="adminstoredetail-value adminstoredetail-value-inline">
                  {storeDetail.bizRegDate || "-"}
                </div>
              </div>

              {/* 사업자 구분 & 사업자 번호 */}
              <div className="adminstoredetail-row">
                <label className="adminstoredetail-label">사업자 구분</label>
                <div className="adminstoredetail-value">{storeDetail.bizType || "-"}</div>
                <label className="adminstoredetail-label adminstoredetail-label-inline">
                  사업자 번호
                </label>
                <div className="adminstoredetail-value adminstoredetail-value-inline">
                  {storeDetail.bizNo || "-"}
                </div>
              </div>

              {/* 대표자명 & 연락처 */}
              <div className="adminstoredetail-row">
                <label className="adminstoredetail-label">대표자명</label>
                <div className="adminstoredetail-value">{storeDetail.ownerNm || "-"}</div>
                <label className="adminstoredetail-label adminstoredetail-label-inline">
                  연락처
                </label>
                <div className="adminstoredetail-value adminstoredetail-value-inline">
                  {storeDetail.ownerTelNo || "-"}
                </div>
              </div>
            </>
          ) : (
            <div className="adminstoredetail-error">상세 정보를 불러올 수 없습니다.</div>
          )}
        </div>

        <div className="adminstoredetail-footer">
          <button
            className="adminstoredetail-btn adminstoredetail-btn-approve"
            onClick={handleApprove}
            disabled={loading}
          >
            {loading ? "처리 중..." : "승인"}
          </button>
          <button
            className="adminstoredetail-btn adminstoredetail-btn-reject"
            onClick={handleReject}
            disabled={loading}
          >
            {loading ? "처리 중..." : "거부"}
          </button>
          <button
            className="adminstoredetail-btn adminstoredetail-btn-close"
            onClick={onClose}
            disabled={loading}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStoreDetail;