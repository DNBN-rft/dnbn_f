import { useState, useEffect } from "react";
import "./css/adminreviewdetail.css";
import { getReviewDetail, updateHiddenExpiry } from "../../../utils/adminReviewService";

const AdminReviewDetail = ({ reviewIdx, onClose, onUpdate }) => {
  const [reviewData, setReviewData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditingExpiry, setIsEditingExpiry] = useState(false);
  const [newExpiryDate, setNewExpiryDate] = useState("");

  const fetchReviewDetail = async () => {
    const result = await getReviewDetail(reviewIdx);
    if (result.success) {
      setReviewData(result.data);
      if (result.data.hiddenExpireAt) {
        setNewExpiryDate(new Date(result.data.hiddenExpireAt).toISOString().split('T')[0]);
      }
    } else {
      console.error("리뷰 조회 실패:", result.error);
      alert(result.error);
      onClose();
    }
  };

  useEffect(() => {
    if (reviewIdx) {
      fetchReviewDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewIdx]);

  const handleUpdateExpiry = async () => {
    if (!newExpiryDate) {
      alert("만료 날짜를 선택해주세요.");
      return;
    }

    const result = await updateHiddenExpiry(reviewIdx, newExpiryDate);
    if (result.success) {
      alert(result.data);
      setIsEditingExpiry(false);
      fetchReviewDetail();
      if (onUpdate) {
        onUpdate();
      }
    } else {
      alert(result.error);
    }
  };

  if (!reviewData) return null;

  return (
    <div className="adminreviewdetail-backdrop" onClick={onClose}>
      <div className="adminreviewdetail-img">
        {reviewData.img?.files && reviewData.img.files.length > 0 ? (
          <img 
            src={reviewData.img.files[0].fileUrl}
            alt="리뷰 이미지"
            style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
            onClick={() => setSelectedImage(reviewData.img.files[0].fileUrl)}
          />
        ) : (
          <div>이미지 없음</div>
        )}
      </div>
      <div
        className="adminreviewdetail-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="adminreviewdetail-header">
          <h2 className="adminreviewdetail-title">리뷰 상세 정보</h2>
          <button className="adminreviewdetail-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="adminreviewdetail-content">
          {/* 가맹점 및 작성자 정보 섹션 */}
          <section className="adminreviewdetail-section">
            <h3 className="adminreviewdetail-section-title">기본 정보</h3>
            <div className="adminreviewdetail-grid">
              <div className="adminreviewdetail-field">
                <label className="adminreviewdetail-label">가맹점명</label>
                <span className="adminreviewdetail-value">{reviewData.storeNm}</span>
              </div>

              <div className="adminreviewdetail-field">
                <label className="adminreviewdetail-label">작성자</label>
                <span className="adminreviewdetail-value">{reviewData.custNm}</span>
              </div>

              <div className="adminreviewdetail-field">
                <label className="adminreviewdetail-label">상품명</label>
                <span className="adminreviewdetail-value">{reviewData.productNm}</span>
              </div>

              <div className="adminreviewdetail-field">
                <label className="adminreviewdetail-label">작성일</label>
                <span className="adminreviewdetail-value">
                  {new Date(reviewData.reviewRegDateTime).toLocaleString()}
                </span>
              </div>
            </div>
          </section>

          {/* 리뷰 내용 섹션 */}
          <section className="adminreviewdetail-section">
            <h3 className="adminreviewdetail-section-title">리뷰 내용</h3>
            <div className="adminreviewdetail-grid">
              <div className="adminreviewdetail-field">
                <label className="adminreviewdetail-label">평점</label>
                <span className="adminreviewdetail-value">{reviewData.reviewRate}점</span>
              </div>

              <div className="adminreviewdetail-field adminreviewdetail-field-full">
                <label className="adminreviewdetail-label">리뷰 내용</label>
                <span className="adminreviewdetail-value">{reviewData.reviewContent}</span>
              </div>

              {reviewData.reviewAnswered && (
                <div className="adminreviewdetail-field adminreviewdetail-field-full">
                  <label className="adminreviewdetail-label">답변</label>
                  <span className="adminreviewdetail-value">{reviewData.reviewAnswerContent}</span>
                </div>
              )}
            </div>
          </section>

          {/* 숨김 상태 섹션 */}
          <section className="adminreviewdetail-section">
            <div className="adminreviewdetail-section-header">
              <h3 className="adminreviewdetail-section-title">숨김 상태</h3>
              {reviewData.isHidden && !isEditingExpiry && (
                <button 
                  className="adminreviewdetail-btn adminreviewdetail-edit-btn"
                  onClick={() => setIsEditingExpiry(true)}
                >
                  만료일 수정
                </button>
              )}
            </div>
            <div className="adminreviewdetail-grid">
              <div className="adminreviewdetail-field">
                <label className="adminreviewdetail-label">숨김 상태</label>
                <span className={`adminreviewdetail-status ${reviewData.isHidden ? 'hidden' : 'normal'}`}>
                  {reviewData.isHidden ? "숨김" : "정상"}
                </span>
              </div>

              {reviewData.isHidden && (
                <div className="adminreviewdetail-field">
                  <label className="adminreviewdetail-label">숨김 만료일</label>
                  {isEditingExpiry ? (
                    <div className="adminreviewdetail-expiry-edit">
                      <input 
                        type="date"
                        value={newExpiryDate}
                        onChange={(e) => setNewExpiryDate(e.target.value)}
                        className="adminreviewdetail-input"
                      />
                      <button 
                        className="adminreviewdetail-btn adminreviewdetail-save-btn"
                        onClick={handleUpdateExpiry}
                      >
                        저장
                      </button>
                      <button 
                        className="adminreviewdetail-btn adminreviewdetail-cancel-btn"
                        onClick={() => {
                          setIsEditingExpiry(false);
                          setNewExpiryDate(new Date(reviewData.hiddenExpireAt).toISOString().split('T')[0]);
                        }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <span className="adminreviewdetail-value">
                      {new Date(reviewData.hiddenExpireAt).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="adminreviewdetail-footer">
          <button
            className="adminreviewdetail-btn adminreviewdetail-close-footer-btn"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>

      {selectedImage && (
        <div className="adminreviewdetail-lightbox" onClick={() => setSelectedImage(null)}>
          <div className="adminreviewdetail-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="확대 이미지" />
            <button className="adminreviewdetail-lightbox-close" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewDetail;
