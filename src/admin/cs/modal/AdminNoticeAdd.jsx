import { useState } from "react";
import "./css/adminnoticeadd.css";
import { createNotice } from "../../../utils/adminNoticeService";

const AdminNoticeAdd = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const result = await createNotice({
      title,
      content,
      isPinned,
    });

    if (result.success) {
      alert(result.data);
      if (onAdd) onAdd();
      onClose();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="adminnoticeadd-backdrop">
      <div className="adminnoticeadd-wrap">
        <div className="adminnoticeadd-header">
          <h2 className="adminnoticeadd-title">공지사항 작성</h2>
          <button className="adminnoticeadd-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="adminnoticeadd-content">
          <div className="adminnoticeadd-form-group">
            <label className="adminnoticeadd-label">제목</label>
            <input
              type="text"
              className="adminnoticeadd-input"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="adminnoticeadd-form-group">
            <label className="adminnoticeadd-label">내용</label>
            <textarea
              className="adminnoticeadd-textarea"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="adminnoticeadd-form-group">
            <label className="adminnoticeadd-checkbox-label">
              <input
                type="checkbox"
                className="adminnoticeadd-checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span>고정 공지</span>
            </label>
          </div>
        </div>

        <div className="adminnoticeadd-footer">
          <button
            className="adminnoticeadd-btn adminnoticeadd-btn-submit"
            onClick={handleSubmit}
          >
            저장
          </button>
          <button
            className="adminnoticeadd-btn adminnoticeadd-btn-cancel"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeAdd;
