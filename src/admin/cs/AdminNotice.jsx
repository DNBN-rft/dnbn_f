import { useState, useEffect } from "react";
import "./css/adminnotice.css";
import AdminNoticeDetail from "./modal/AdminNoticeDetail";
import AdminNoticeAdd from "./modal/AdminNoticeAdd";
import { getNotices, deleteNotices, searchNotices } from "../../utils/adminNoticeService";

const AdminNotice = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [selectedNotices, setSelectedNotices] = useState([]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 검색 여부 플래그
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 필터 상태
  const [filters, setFilters] = useState({
    isPinned: null,
    startDate: "",
    endDate: "",
    searchType: "all",
    searchKeyword: "",
  });

  // 공지사항 목록 조회
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async (page = 0) => {
    try {
      const result = await getNotices(page, pageSize);
      if (result.success && result.data) {
        setNotices(result.data.content || []);
        setCurrentPage(result.data.number || 0);
        setTotalPages(result.data.totalPages || 0);
        setTotalElements(result.data.totalElements || 0);
        setIsSearchMode(false);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error("공지사항 목록 조회 오류:", error);
      setNotices([]);
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
      if (isSearchMode) {
        handleSearchInternal(currentPage);
      } else {
        fetchNotices(currentPage);
      }
    } else {
      alert(result.error);
    }
  };

  // 검색 내부 함수
  const handleSearchInternal = async (page = 0) => {
    try {
      const searchParams = {
        isPinned: filters.isPinned,
        startDate: filters.startDate,
        endDate: filters.endDate,
        searchTerm: filters.searchKeyword,
        searchType: filters.searchType,
      };

      const result = await searchNotices(searchParams, page, pageSize);
      if (result.success && result.data) {
        setNotices(result.data.content || []);
        setCurrentPage(result.data.number || 0);
        setTotalPages(result.data.totalPages || 0);
        setTotalElements(result.data.totalElements || 0);
        setIsSearchMode(true);
      } else {
        setNotices([]);
        alert(result.error || "공지사항 검색 실패");
      }
    } catch (error) {
      console.error("공지사항 검색 오류:", error);
      setNotices([]);
      alert("공지사항 검색 중 오류가 발생했습니다.");
    }
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setCurrentPage(0);
    handleSearchInternal(0);
  };

  // 필터 초기화
  const handleReset = () => {
    setFilters({
      isPinned: null,
      startDate: "",
      endDate: "",
      searchType: "all",
      searchKeyword: "",
    });
    setCurrentPage(0);
    fetchNotices(0);
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
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
              <span className="adminnotice-date-separator">~</span>
              <input 
                type="date" 
                className="adminnotice-date-input"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            <div className="adminnotice-filter-group">
              <label className="adminnotice-checkbox-label">
                <input
                  type="checkbox"
                  className="adminnotice-checkbox"
                  checked={filters.isPinned === true}
                  onChange={(e) => setFilters({ ...filters, isPinned: e.target.checked ? true : null })}
                />
                <span>고정공지만 보기</span>
              </label>
            </div>
          </div>

          <div className="adminnotice-filter-row adminnotice-search-row">
            <div className="adminnotice-search-group">
              <select
                name="notice-option"
                id="notice-option"
                className="adminnotice-select-type"
                value={filters.searchType}
                onChange={(e) => setFilters({ ...filters, searchType: e.target.value })}
              >
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="regnm">작성자</option>
                <option value="modnm">수정자</option>
              </select>
              <input
                type="text"
                className="adminnotice-input"
                placeholder="검색어를 입력하세요"
                value={filters.searchKeyword}
                onChange={(e) => setFilters({ ...filters, searchKeyword: e.target.value })}
              />
              <button className="adminnotice-search-btn" onClick={handleSearch}>검색</button>
              <button className="adminnotice-search-btn" onClick={handleReset}>초기화</button>
            </div>
          </div>
        </div>

        <div className="adminnotice-table-wrap">
          <div className="adminnotice-table-header">
            <div className="adminnotice-table-info">
              총 <span className="adminnotice-count-bold">{totalElements}</span>건
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
              {notices && notices.length > 0 ? (
                notices.map((notice, index) => (
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
                    <td>{currentPage * pageSize + index + 1}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={showCheckbox ? "9" : "8"} style={{ textAlign: "center" }}>
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="adminnotice-pagination">
            <button 
              className="adminnotice-pagination-btn"
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  isSearchMode ? handleSearchInternal(newPage) : fetchNotices(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            <div className="adminnotice-pagination-numbers">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`adminnotice-page-number ${currentPage === index ? 'adminnotice-page-active' : ''}`}
                  onClick={() => {
                    setCurrentPage(index);
                    isSearchMode ? handleSearchInternal(index) : fetchNotices(index);
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button 
              className="adminnotice-pagination-btn"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  isSearchMode ? handleSearchInternal(newPage) : fetchNotices(newPage);
                }
              }}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
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
          onUpdate={() => {
            if (isSearchMode) {
              handleSearchInternal(currentPage);
            } else {
              fetchNotices(currentPage);
            }
          }}
        />
      )}

      {/* 공지작성 모달 */}
      {isAddModalOpen && (
        <AdminNoticeAdd
          onClose={() => setIsAddModalOpen(false)}
          onAdd={() => {
            if (isSearchMode) {
              handleSearchInternal(currentPage);
            } else {
              fetchNotices(currentPage);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminNotice;
