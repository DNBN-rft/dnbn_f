import { useState } from "react";
import "./css/adminaddpush.css";

const AdminAddPush = ({ isOpen, onClose }) => {
  const [sendTime, setSendTime] = useState("immediate");

  if (!isOpen) return null;

  const handleSendTimeChange = (e) => {
    setSendTime(e.target.value);
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
            <select className="adminaddpush-select">
              <option value="">선택하세요</option>
              <option value="all">전체</option>
              <option value="merchant">가맹점</option>
              <option value="customer">고객</option>
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
              <label className="adminaddpush-radio-label">
                <input
                  type="radio"
                  name="sendTime"
                  value="scheduled"
                  className="adminaddpush-radio"
                  checked={sendTime === "scheduled"}
                  onChange={handleSendTimeChange}
                />
                <span>예약 발송</span>
              </label>
            </div>
          </div>

          <div className="adminaddpush-form-group">
            <label className="adminaddpush-label">예약 일시</label>
            <input
              type="datetime-local"
              className="adminaddpush-input"
              disabled={sendTime === "immediate"}
            />
          </div>
        </div>

        <div className="adminaddpush-footer">
          <button className="adminaddpush-btn adminaddpush-btn-submit">
            등록
          </button>
          <button
            className="adminaddpush-btn adminaddpush-btn-cancel"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddPush;
