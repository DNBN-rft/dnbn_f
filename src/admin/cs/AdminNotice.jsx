import { useState, useEffect } from "react";
import "./css/adminnotice.css";
import AdminNoticeDetail from "./modal/AdminNoticeDetail";
import AdminNoticeAdd from "./modal/AdminNoticeAdd";
import { getNotices, deleteNotices } from "../../utils/adminNoticeService";

const AdminNotice = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [selectedNotices, setSelectedNotices] = useState([]);

  // 공지사항 목록 조회
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const result = await getNotices();
    if (result.success) {
      setNotices(result.data);
    } else {
      alert(result.error || "공지사항 목록 조회 실패");
    }
  };

  // 체크박스 선택
  const handleCheckboxChange = (noticeIdx) => {
    setSelectedNotices(prev => {
      if (prev.includes(noticeIdx)) {
        return prev.filter(idx => idx !== noticeIdx);
      } else {
        return [...prev, noticeIdx];
      }
    });
  };

  // 삭제 모드 토글
  const toggleDeleteMode = () => {
    setShowCheckbox(!showCheckbox);
    setSelectedNotices([]);
  };

  // 공지사항 삭제
  const handleDelete = async () => {
    if (selectedNotices.length === 0) {
      alert("삭제할 공지사항을 선택해주세요.");
      return;
    }

    if (!window.confirm(`선택한 ${selectedNotices.length}개의 공지사항을 삭제하시겠습니까?`)) {
      return;
    }

    const result = await deleteNotices(selectedNotices);
    if (result.success) {
      alert(result.data);
      setSelectedNotices([]);
      setShowCheckbox(false);
      fetchNotices();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="adminnotice-container">
      <div className="adminnotice-wrap">
        <div className="adminnotice-filter-wrap">
          <div className="adminnotice-filter-row">
            <div className="adminnotice-filter-group">
              <label htmlFor="notice-date-start">기간</label>
              <input
                type="date"
                id="notice-date-start"
                className="adminnotice-date-input"
              />
              <span className="adminnotice-date-separator">~</span>
              <input type="date" className="adminnotice-date-input" />
            </div>

            <div className="adminnotice-filter-group">
              <label className="adminnotice-checkbox-label">
                <input
                  type="checkbox"
                  className="adminnotice-checkbox"
                />
                <span>고정공지 포함</span>
              </label>
            </div>
          </div>

          <div className="adminnotice-filter-row adminnotice-search-row">
            <div className="adminnotice-search-group">
              <select
                name="notice-option"
                id="notice-option"
                className="adminnotice-select-type"
              >
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="writer">작성자</option>
                <option value="editor">수정자</option>
              </select>
              <input
                type="text"
                className="adminnotice-input"
                placeholder="검색어를 입력하세요"
              />
              <button className="adminnotice-search-btn">검색</button>
            </div>
          </div>
        </div>

        <div className="adminnotice-table-wrap">
          <div className="adminnotice-table-header">
            <div className="adminnotice-table-info">
              총 <span className="adminnotice-count-bold">{notices.length}</span>건
            </div>
            <div className="adminnotice-table-actions">
              {showCheckbox && (
                <button 
                  className="adminnotice-delete-confirm-btn"
                  onClick={handleDelete}
                >
                  삭제 확인
                </button>
              )}
              <button 
                className={`adminnotice-delete-btn ${showCheckbox ? 'active' : ''}`}
                onClick={toggleDeleteMode}
              >
                {showCheckbox ? '취소' : '공지 삭제'}
              </button>
              <button 
                className="adminnotice-write-btn"
                onClick={() => setIsAddModalOpen(true)}
              >
                공지작성
              </button>
            </div>
          </div>

          <table className="adminnotice-table">
            <thead>
              <tr>
                {showCheckbox && <th>선택</th>}
                <th>No.</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>수정자</th>
                <th>수정일</th>
                <th>고정여부</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, index) => (
                <tr key={notice.noticeIdx}>
                  {showCheckbox && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedNotices.includes(notice.noticeIdx)}
                        onChange={() => handleCheckboxChange(notice.noticeIdx)}
                      />
                    </td>
                  )}
                  <td>{index + 1}</td>
                  <td className="adminnotice-title">{notice.title}</td>
                  <td>{notice.regNm}</td>
                  <td>{notice.regDate}</td>
                  <td>{notice.modNm || "-"}</td>
                  <td>{notice.modDate || "-"}</td>
                  <td>
                    {notice.isPinned ? (
                      <span className="adminnotice-status-pinned">고정</span>
                    ) : (
                      <span className="adminnotice-status-normal">일반</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="adminnotice-btn adminnotice-btn-detail"
                      onClick={() => {
                        setSelectedNotice(notice.noticeIdx);
                        setIsModalOpen(true);
                      }}
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="adminnotice-pagination">
            <button className="adminnotice-pagination-btn">이전</button>
            <div className="adminnotice-pagination-numbers">
              <button className="adminnotice-page-number adminnotice-page-active">
                1
              </button>
              <button className="adminnotice-page-number">2</button>
              <button className="adminnotice-page-number">3</button>
            </div>
            <button className="adminnotice-pagination-btn">다음</button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && selectedNotice && (
        <AdminNoticeDetail
          noticeIdx={selectedNotice}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNotice(null);
          }}
          onUpdate={fetchNotices}
        />
      )}

      {/* 공지작성 모달 */}
      {isAddModalOpen && (
        <AdminNoticeAdd
          onClose={() => setIsAddModalOpen(false)}
          onAdd={fetchNotices}
        />
      )}
    </div>
  );
};

export default AdminNotice;
