import { useState, useEffect } from "react";
import { getNoticeDetail, updateNotice } from "../../../utils/adminNoticeService";
import { formatDateTime } from "../../../utils/commonService";
import "./css/adminnoticedetail.css";

const AdminNoticeDetail = ({ noticeIdx, onClose, onUpdate }) => {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedNotice, setEditedNotice] = useState({
    title: "",
    content: "",
    isPinned: false,
  });

  // 공지사항 상세 정보 조회
  useEffect(() => {
    const fetchNoticeDetail = async () => {
      setLoading(true);
      const result = await getNoticeDetail(noticeIdx);
      if (result.success) {
        setNotice(result.data);
        console.log("공지사항 상세 정보:", result.data); // 상세 정보 로그
        setEditedNotice({
          title: result.data.title,
          content: result.data.content,
          isPinned: result.data.isPinned,
          noticeType: result.data.noticeType,
        });
      } else {
        alert(result.error || "공지사항을 불러오는데 실패했습니다.");
      }
      setLoading(false);
    };

    fetchNoticeDetail();
  }, [noticeIdx]);

  const handleSave = async () => {
    const result = await updateNotice(noticeIdx, editedNotice);
    if (result.success) {
      alert("공지사항이 수정되었습니다.");
      setIsEditMode(false);
      // 수정 후 목록 새로고침
      if (onUpdate) {
        onUpdate();
      }
      // 상세 정보 다시 조회
      const updatedResult = await getNoticeDetail(noticeIdx);
      if (updatedResult.success) {
        setNotice(updatedResult.data);
      }
    } else {
      alert(result.error || "공지사항 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    if (notice) {
      setEditedNotice({
        title: notice.title,
        content: notice.content,
        isPinned: notice.isPinned,
        noticeType: notice.noticeType,
      });
    }
    setIsEditMode(false);
  };

  // 로딩 중
  if (loading) {
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
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!notice) {
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
            <p>공지사항 정보를 불러올 수 없습니다.</p>
          </div>
          <div className="adminnoticedetail-footer">
            <button
              className="adminnoticedetail-btn adminnoticedetail-btn-close"
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

          {/* 공지 구분 */}
          <div className="adminnoticedetail-row">
            <label className="adminnoticedetail-label">공지 구분</label>
            {isEditMode ? (
              <select
                className="adminnoticedetail-select"
                value={editedNotice.noticeType || "공통"}
                onChange={(e) =>
                  setEditedNotice({ ...editedNotice, noticeType: e.target.value })
                }
              >
                <option value="공통">공통</option>
                <option value="사용자">사용자</option>
                <option value="가맹점">가맹점</option>
              </select>
            ) : (
              <div className="adminnoticedetail-value">
                {notice.noticeType || "공통"}
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
            <label className="adminnoticedetail-label">작성자/작성일시</label>
            <div className="adminnoticedetail-value">
              {notice.regNm} / {formatDateTime(notice.regDate)}
            </div>
          </div>

          {/* 수정자 & 수정일 */}
          <div className="adminnoticedetail-row">
            <label className="adminnoticedetail-label">수정자/수정일시</label>
            <div className="adminnoticedetail-value">
              {notice.modNm || "-"} / {formatDateTime(notice.modDate)}
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