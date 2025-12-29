import { useState } from "react";
import "./css/adminnoticedetail.css";

const AdminNoticeDetail = ({ notice, onClose }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedNotice, setEditedNotice] = useState({
    title: notice.title,
    content: notice.content,
    isPinned: notice.isPinned,
  });

  const handleSave = () => {
    // 저장 로직 추가 예정
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedNotice({
      title: notice.title,
      content: notice.content,
      isPinned: notice.isPinned,
    });
    setIsEditMode(false);
  };

  return (
    <div className="adminnoticedetail-backdrop" onClick={onClose}>
      <div
        className="adminnoticedetail-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="adminnoticedetail-header">
          <h2 className="adminnoticedetail-title">공지사항 상세</h2>
          <button className="adminnoticedetail-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="adminnoticedetail-content">
          {/* 제목 & 고정여부 */}
          <div className="adminnoticedetail-row">
            <label className="adminnoticedetail-label">제목</label>
            {isEditMode ? (
              <>
                <input
                  type="text"
                  className="adminnoticedetail-input"
                  value={editedNotice.title}
                  onChange={(e) =>
                    setEditedNotice({ ...editedNotice, title: e.target.value })
                  }
                />
                <label className="adminnoticedetail-checkbox-label">
                  <input
                    type="checkbox"
                    className="adminnoticedetail-checkbox"
                    checked={editedNotice.isPinned}
                    onChange={(e) =>
                      setEditedNotice({
                        ...editedNotice,
                        isPinned: e.target.checked,
                      })
                    }
                  />
                  <span>고정</span>
                </label>
              </>
            ) : (
              <div className="adminnoticedetail-value adminnoticedetail-value-with-badge">
                <span className="adminnoticedetail-title-text">{notice.title}</span>
                {notice.isPinned ? (
                  <span className="adminnoticedetail-status-pinned">고정</span>
                ) : (
                  <span className="adminnoticedetail-status-normal">일반</span>
                )}
              </div>
            )}
          </div>

          {/* 내용 */}
          <div className="adminnoticedetail-row adminnoticedetail-row-full">
            <label className="adminnoticedetail-label">내용</label>
            {isEditMode ? (
              <textarea
                className="adminnoticedetail-textarea"
                value={editedNotice.content}
                onChange={(e) =>
                  setEditedNotice({ ...editedNotice, content: e.target.value })
                }
                rows={12}
              />
            ) : (
              <div className="adminnoticedetail-value adminnoticedetail-content-text">
                {notice.content}
              </div>
            )}
          </div>

          {/* 작성자 & 작성일 */}
          <div className="adminnoticedetail-row">
            <label className="adminnoticedetail-label">작성자/작성일</label>
            <div className="adminnoticedetail-value">
              {notice.writer} / {notice.createDate}
            </div>
          </div>

          {/* 수정자 & 수정일 */}
          <div className="adminnoticedetail-row">
            <label className="adminnoticedetail-label">수정자/수정일</label>
            <div className="adminnoticedetail-value">
              {notice.editor || "-"} / {notice.editDate || "-"}
            </div>
          </div>
        </div>

        <div className="adminnoticedetail-footer">
          {isEditMode ? (
            <>
              <button
                className="adminnoticedetail-btn adminnoticedetail-btn-save"
                onClick={handleSave}
              >
                저장
              </button>
              <button
                className="adminnoticedetail-btn adminnoticedetail-btn-cancel"
                onClick={handleCancel}
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                className="adminnoticedetail-btn adminnoticedetail-btn-edit"
                onClick={() => setIsEditMode(true)}
              >
                수정
              </button>
              <button
                className="adminnoticedetail-btn adminnoticedetail-btn-close"
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

export default AdminNoticeDetail;