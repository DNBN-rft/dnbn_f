import { useState, useEffect } from "react";
import { getFaqDetail, updateFaq } from "../../../utils/adminFaqService";
import { formatDateTime } from "../../../utils/commonService";
import "./css/adminfaqdetail.css";

const AdminFaqDetail = ({ faqIdx, onClose, onUpdate }) => {
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedFaq, setEditedFaq] = useState({
    faqTitle: "",
    faqContent: "",
    faqType: "",
    userType: "",
  });

  // userType에 따른 faqType 옵션 매핑
  const faqTypeOptions = {
    사용자: [
      { value: "회원/계정", label: "회원/계정" },
      { value: "주문/결제", label: "주문/결제" },
      { value: "취소/환불", label: "취소/환불" },
      { value: "기타", label: "기타" },
    ],
    가맹점: [
      { value: "회원/계정", label: "회원/계정" },
      { value: "상품/주문", label: "상품/주문" },
      { value: "정산/결제", label: "정산/결제" },
      { value: "시스템/운영", label: "시스템/운영" },
      { value: "기타", label: "기타" },
    ],
  };

  // enum 값을 한국어 라벨로 변환
  const getFaqTypeLabel = (value, userType) => {
    return value;
  };

  // FAQ 상세 정보 조회
  useEffect(() => {
    const fetchFaqDetail = async () => {
      setLoading(true);
      const result = await getFaqDetail(faqIdx);
      if (result.success) {
        setFaq(result.data);
        setEditedFaq({
          faqTitle: result.data.faqTitle,
          faqContent: result.data.faqContent,
          faqType: result.data.faqType,
          userType: result.data.userType,
        });
      } else {
        alert(result.error || "FAQ를 불러오는데 실패했습니다.");
      }
      setLoading(false);
    };

    fetchFaqDetail();
  }, [faqIdx]);

  const handleSave = async () => {
    if (!editedFaq.faqTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!editedFaq.faqContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const result = await updateFaq(faqIdx, editedFaq);
    if (result.success) {
      alert("FAQ가 수정되었습니다.");
      setIsEditMode(false);
      if (onUpdate) {
        onUpdate();
      }
      // 상세 정보 다시 조회
      const updatedResult = await getFaqDetail(faqIdx);
      if (updatedResult.success) {
        setFaq(updatedResult.data);
      }
    } else {
      alert(result.error || "FAQ 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    if (faq) {
      setEditedFaq({
        faqTitle: faq.faqTitle,
        faqContent: faq.faqContent,
        faqType: faq.faqType,
        userType: faq.userType,
      });
    }
    setIsEditMode(false);
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="adminfaqdetail-backdrop" onClick={onClose}>
        <div
          className="adminfaqdetail-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="adminfaqdetail-header">
            <h2 className="adminfaqdetail-title">FAQ 상세</h2>
            <button className="adminfaqdetail-close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="adminfaqdetail-content">
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!faq) {
    return (
      <div className="adminfaqdetail-backdrop" onClick={onClose}>
        <div
          className="adminfaqdetail-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="adminfaqdetail-header">
            <h2 className="adminfaqdetail-title">FAQ 상세</h2>
            <button className="adminfaqdetail-close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="adminfaqdetail-content">
            <p>FAQ 정보를 불러올 수 없습니다.</p>
          </div>
          <div className="adminfaqdetail-footer">
            <button
              className="adminfaqdetail-btn adminfaqdetail-btn-close"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adminfaqdetail-backdrop" onClick={onClose}>
      <div
        className="adminfaqdetail-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="adminfaqdetail-header">
          <h2 className="adminfaqdetail-title">FAQ 상세</h2>
          <button className="adminfaqdetail-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="adminfaqdetail-content">
          {/* 제목 */}
          <div className="adminfaqdetail-row">
            <label className="adminfaqdetail-label">제목</label>
            {isEditMode ? (
              <input
                type="text"
                className="adminfaqdetail-input"
                value={editedFaq.faqTitle}
                onChange={(e) =>
                  setEditedFaq({ ...editedFaq, faqTitle: e.target.value })
                }
              />
            ) : (
              <div className="adminfaqdetail-value">{faq.faqTitle}</div>
            )}
          </div>

          {/* 분류 */}
          <div className="adminfaqdetail-row">
            <label className="adminfaqdetail-label">분류</label>
            {isEditMode ? (
              <select
                className="adminfaqdetail-select"
                value={editedFaq.faqType}
                onChange={(e) =>
                  setEditedFaq({ ...editedFaq, faqType: e.target.value })
                }
              >
                {faqTypeOptions[editedFaq.userType] && faqTypeOptions[editedFaq.userType].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                {editedFaq.faqType && !faqTypeOptions[editedFaq.userType]?.some(opt => opt.value === editedFaq.faqType) && (
                  <option value={editedFaq.faqType}>
                    {getFaqTypeLabel(editedFaq.faqType, faq.userType)}
                  </option>
                )}
              </select>
            ) : (
              <div className="adminfaqdetail-value">{getFaqTypeLabel(faq.faqType, faq.userType)}</div>
            )}
          </div>

          {/* 대상 */}
          <div className="adminfaqdetail-row">
            <label className="adminfaqdetail-label">대상</label>
            {isEditMode ? (
              <select
                className="adminfaqdetail-select"
                value={editedFaq.userType}
                onChange={(e) =>
                  setEditedFaq({ ...editedFaq, userType: e.target.value })
                }
              >
                <option value="사용자">사용자</option>
                <option value="가맹점">가맹점</option>
              </select>
            ) : (
              <div className="adminfaqdetail-value">
                {faq.userType}
              </div>
            )}
          </div>

          {/* 작성자*/}
          <div className={`adminfaqdetail-row`}>
            <label className="adminfaqdetail-label">작성자</label>
            <div className={`adminfaqdetail-value ${isEditMode ? 'disabled' : ''}`} >
              {faq.regNm}
            </div>
          </div>


          {/* 작성일 */}
          <div className={`adminfaqdetail-row`}>
            <label className="adminfaqdetail-label">작성일</label>
            <div className={`adminfaqdetail-value ${isEditMode ? 'disabled' : ''}`} >
              {formatDateTime(faq.regDateTime)}
            </div>
          </div>

          {/* 수정자 */}
          {faq.modNm && (
          <div className={`adminfaqdetail-row`}>
              <label className="adminfaqdetail-label">수정자</label>
              <div className={`adminfaqdetail-value ${isEditMode ? 'disabled' : ''}`}>
                {faq.modNm}
              </div>
            </div>
          )}

          {/* 수정일 */}
          {faq.modDateTime && (
          <div className={`adminfaqdetail-row`}>
              <label className="adminfaqdetail-label">수정일</label>
              <div className={`adminfaqdetail-value ${isEditMode ? 'disabled' : ''}`} >
                {formatDateTime(faq.modDateTime)}
              </div>
            </div>
          )}

          {/* 내용 */}
          <div className="adminfaqdetail-row adminfaqdetail-content-row">
            <label className="adminfaqdetail-label">내용</label>
            {isEditMode ? (
              <textarea
                className="adminfaqdetail-textarea"
                value={editedFaq.faqContent}
                onChange={(e) =>
                  setEditedFaq({ ...editedFaq, faqContent: e.target.value })
                }
              />
            ) : (
              <div className="adminfaqdetail-value adminfaqdetail-content-value">
                {faq.faqContent}
              </div>
            )}
          </div>
        </div>

        <div className="adminfaqdetail-footer">
          {isEditMode ? (
            <>
              <button
                className="adminfaqdetail-btn adminfaqdetail-btn-save"
                onClick={handleSave}
              >
                저장
              </button>
              <button
                className="adminfaqdetail-btn adminfaqdetail-btn-cancel"
                onClick={handleCancel}
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                className="adminfaqdetail-btn adminfaqdetail-btn-edit"
                onClick={() => setIsEditMode(true)}
              >
                수정
              </button>
              <button
                className="adminfaqdetail-btn adminfaqdetail-btn-close"
                onClick={onClose}
              >
                닫기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFaqDetail;
