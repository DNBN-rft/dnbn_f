import { useState } from "react";
import "./css/adminnotice.css";
import AdminNoticeDetail from "./modal/AdminNoticeDetail";
import AdminNoticeAdd from "./modal/AdminNoticeAdd";

const AdminNotice = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 예시 데이터 (수정자/수정일이 없는 경우 null)
  const notices = [
    {
      id: 1,
      title: "시스템 점검 안내",
      content: "시스템 점검을 위해 2024년 1월 15일 오전 2시부터 6시까지 서비스가 일시 중단됩니다. 이용에 불편을 드려 죄송합니다.",
      writer: "관리자",
      createDate: "2024-01-01",
      editor: "관리자",
      editDate: "2024-01-02",
      isPinned: true,
    },
    {
      id: 2,
      title: "서비스 이용 안내",
      content: "저희 서비스를 이용해 주셔서 감사합니다. 보다 나은 서비스를 위해 항상 노력하겠습니다.",
      writer: "관리자",
      createDate: "2024-01-03",
      editor: null,
      editDate: null,
      isPinned: false,
    },
    {
      id: 3,
      title: "개인정보 처리방침 변경 안내",
      content: "개인정보 처리방침이 2024년 1월 10일부터 변경됩니다. 자세한 내용은 공지사항을 확인해 주세요.",
      writer: "관리자",
      createDate: "2024-01-05",
      editor: null,
      editDate: null,
      isPinned: false,
    },
  ];

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
            <button 
              className="adminnotice-write-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              공지작성
            </button>
          </div>

          <table className="adminnotice-table">
            <thead>
              <tr>
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
              {notices.map((notice) => (
                <tr key={notice.id}>
                  <td>{notice.id}</td>
                  <td className="adminnotice-title">{notice.title}</td>
                  <td>{notice.writer}</td>
                  <td>{notice.createDate}</td>
                  <td>{notice.editor || "-"}</td>
                  <td>{notice.editDate || "-"}</td>
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
                        setSelectedNotice(notice);
                        setIsModalOpen(true);
                      }}
                    >
                      상세
                    </button>
                    <button className="adminnotice-btn adminnotice-btn-delete">
                      삭제
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
          notice={selectedNotice}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNotice(null);
          }}
        />
      )}

      {/* 공지작성 모달 */}
      {isAddModalOpen && (
        <AdminNoticeAdd
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminNotice;
