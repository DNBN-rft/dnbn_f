import { useState } from "react";
import "./css/adminaddpush.css";
import { apiPost } from "../../../utils/apiClient";

const AdminAddPush = ({ isOpen, onClose, onSuccess }) => {
  const [sendTime, setSendTime] = useState("immediate");
  const [receiverType, setReceiverType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendTimeChange = (e) => {
    setSendTime(e.target.value);
  };

  const handleSubmit = async () => {
    // 필수 항목 검증
    if (!receiverType.trim()) {
      alert("수신자를 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiPost("/admin/push", {
        receiverType: receiverType.toUpperCase(),
        title: title.trim(),
        content: content.trim(),
      });

      if (!response.ok) {
        throw new Error("푸시 등록에 실패했습니다.");
      }

      alert("푸시가 등록되었습니다.");
      
      // 초기화 및 닫기
      setReceiverType("");
      setTitle("");
      setContent("");
      setSendTime("immediate");
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("푸시 등록 실패:", error);
      alert(error.message || "푸시 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminaddpush-backdrop">
      <div className="adminaddpush-modal">
        <div className="adminaddpush-header">
          <h2 className="adminaddpush-title">푸시 등록</h2>
          <button className="adminaddpush-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="adminaddpush-content">
          <div className="adminaddpush-form-group">
            <label className="adminaddpush-label">
              수신자 <span className="adminaddpush-required">*</span>
            </label>
            <select
              className="adminaddpush-select"
              value={receiverType}
              onChange={(e) => setReceiverType(e.target.value)}
            >
              <option value="">선택하세요</option>
=              <option value="가맹점">가맹점</option>
              <option value="사용자">사용자</option>
            </select>
          </div>

          <div className="adminaddpush-form-group">
            <label className="adminaddpush-label">
              제목 <span className="adminaddpush-required">*</span>
            </label>
            <input
              type="text"
              className="adminaddpush-input"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="adminaddpush-form-group">
            <label className="adminaddpush-label">
              내용 <span className="adminaddpush-required">*</span>
            </label>
            <textarea
              className="adminaddpush-textarea"
              placeholder="내용을 입력하세요"
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          <div className="adminaddpush-form-group">
            <label className="adminaddpush-label">발송 시간</label>
            <div className="adminaddpush-radio-group">
              <label className="adminaddpush-radio-label">
                <input
                  type="radio"
                  name="sendTime"
                  value="immediate"
                  className="adminaddpush-radio"
                  checked={sendTime === "immediate"}
                  onChange={handleSendTimeChange}
                />
                <span>즉시 발송</span>
              </label>
              {/* <label className="adminaddpush-radio-label">
                <input
                  type="radio"
                  name="sendTime"
                  value="scheduled"
                  className="adminaddpush-radio"
                  checked={sendTime === "scheduled"}
                  onChange={handleSendTimeChange}
                />
                <span>예약 발송</span>
              </label> */}
            </div>
          </div>
{/* 
          <div className="adminaddpush-form-group">
            <label className="adminaddpush-label">예약 일시</label>
            <input
              type="datetime-local"
              className="adminaddpush-input"
              disabled={sendTime === "immediate"}
            />
          </div> */}
        </div>

        <div className="adminaddpush-footer">
          <button
            className="adminaddpush-btn adminaddpush-btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
          <button
            className="adminaddpush-btn adminaddpush-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddPush;
