import { useState } from "react";
import "./css/adminfaqadd.css";
import { createFaq } from "../../../utils/adminFaqService";

const AdminFaqAdd = ({ onClose, onAdd }) => {
  const [faqTitle, setFaqTitle] = useState("");
  const [faqContent, setFaqContent] = useState("");
  const [userType, setUserType] = useState("사용자");
  const [faqType, setFaqType] = useState("회원/계정");

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

  // userType 변경 시 faqType 초기화
  const handleUserTypeChange = (e) => {
    const newUserType = e.target.value;
    setUserType(newUserType);
    // 새로운 사용자 타입의 첫 번째 옵션으로 초기화
    setFaqType(faqTypeOptions[newUserType][0].value);
  };

  const handleSubmit = async () => {
    if (!faqTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!faqContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const result = await createFaq({
      faqTitle,
      faqContent,
      faqType,
      userType,
    });

    if (result.success) {
      alert("FAQ가 작성되었습니다.");
      if (onAdd) onAdd();
      onClose();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="adminfaqadd-backdrop">
      <div className="adminfaqadd-wrap">
        <div className="adminfaqadd-header">
          <h2 className="adminfaqadd-title">FAQ 작성</h2>
          <button className="adminfaqadd-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="adminfaqadd-content">
          <div className="adminfaqadd-form-group">
            <label className="adminfaqadd-label">제목</label>
            <input
              type="text"
              className="adminfaqadd-input"
              placeholder="제목을 입력하세요"
              value={faqTitle}
              onChange={(e) => setFaqTitle(e.target.value)}
            />
          </div>

          <div className="adminfaqadd-form-group">
            <label className="adminfaqadd-label">대상</label>
            <select
              className="adminfaqadd-select"
              value={userType}
              onChange={handleUserTypeChange}
            >
              <option value="사용자">사용자</option>
              <option value="가맹점">가맹점</option>
            </select>
          </div>

          <div className="adminfaqadd-form-group">
            <label className="adminfaqadd-label">분류</label>
            <select
              className="adminfaqadd-select"
              value={faqType}
              onChange={(e) => setFaqType(e.target.value)}
            >
              {faqTypeOptions[userType].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="adminfaqadd-form-group">
            <label className="adminfaqadd-label">내용</label>
            <textarea
              className="adminfaqadd-textarea"
              placeholder="내용을 입력하세요"
              value={faqContent}
              onChange={(e) => setFaqContent(e.target.value)}
            />
          </div>
        </div>

        <div className="adminfaqadd-footer">
          <button
            className="adminfaqadd-btn adminfaqadd-btn-submit"
            onClick={handleSubmit}
          >
            저장
          </button>
          <button
            className="adminfaqadd-btn adminfaqadd-btn-cancel"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFaqAdd;
