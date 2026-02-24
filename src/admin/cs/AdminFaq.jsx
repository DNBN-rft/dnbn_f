import { useState, useEffect } from "react";
import "./css/adminfaq.css";
import AdminFaqDetail from "./modal/AdminFaqDetail";
import AdminFaqAdd from "./modal/AdminFaqAdd";
import {
  getFaqList,
  deleteFaqList,
  searchFaq,
} from "../../utils/adminFaqService";
import { formatDateTime } from "../../utils/commonService";

const AdminFaq = () => {
  // 날짜와 시간을 두 줄로 포맷팅 (날짜 / 오전/오후 시간)
  const formatDateTimeWithLineBreak = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    const formatted = date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    // "2026. 02. 23. 오전 11:01" 형식을 분리
    const parts = formatted.match(/^(.+?)\s(오[전후].*)$/);
    if (parts) {
      return (
        <>
          {parts[1]}
          <br />
          {parts[2]}
        </>
      );
    }
    return formatted;
  };

  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [selectedFaqs, setSelectedFaqs] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 검색 관련 상태
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: new Date().toISOString().split('T')[0],
    faqType: "",
    userType: "",
    searchType: "all",
    searchKeyword: "",
  });

  // FAQ 목록 조회
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async (page = 0) => {
    try {
      const result = await getFaqList(page, pageSize);
      if (result.success && result.data) {
        setFaqs(result.data.content || []);
        setCurrentPage(result.data.number || 0);
        setTotalPages(result.data.totalPages || 0);
        setTotalElements(result.data.totalElements || 0);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      setFaqs([]);
    }
  };

  const handleSearchInternal = async (page = 0) => {
    try {
      const searchParams = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        faqType: filters.faqType,
        userType: filters.userType,
        searchType: filters.searchType,
        searchTerm: filters.searchKeyword,
      };
      const result = await searchFaq(searchParams, page, pageSize);
      if (result.success && result.data) {
        setFaqs(result.data.content || []);
        setCurrentPage(result.data.number || 0);
        setTotalPages(result.data.totalPages || 0);
        setTotalElements(result.data.totalElements || 0);
      } else {
        alert("검색 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("검색 중 오류:", error);
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    setIsSearchMode(true);
    handleSearchInternal(0);
  };

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: new Date().toISOString().split('T')[0],
      faqType: "",
      userType: "",
      searchType: "all",
      searchKeyword: "",
    });
    setIsSearchMode(false);
    setCurrentPage(0);
    fetchFaqs(0);
  };

  const handleCheckboxChange = (faqIdx) => {
    setSelectedFaqs((prev) => {
      if (prev.includes(faqIdx)) {
        return prev.filter((idx) => idx !== faqIdx);
      } else {
        return [...prev, faqIdx];
      }
    });
  };

  const toggleDeleteMode = () => {
    setShowCheckbox(!showCheckbox);
    setSelectedFaqs([]);
  };

  const handleDelete = async () => {
    if (selectedFaqs.length === 0) {
      alert("삭제할 FAQ를 선택해주세요.");
      return;
    }

    if (
      !window.confirm(
        `선택한 ${selectedFaqs.length}개의 FAQ를 삭제하시겠습니까?`
      )
    ) {
      return;
    }

    const result = await deleteFaqList(selectedFaqs);
    if (result.success) {
      alert(`선택한 ${selectedFaqs.length}개의 FAQ가 삭제되었습니다.`);
      setSelectedFaqs([]);
      setShowCheckbox(false);
      fetchFaqs(currentPage);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="adminfaq-container">
      <div className="adminfaq-wrap">
        {/* 검색 필터 */}
        <div className="adminfaq-filter-wrap">
          <div className="adminfaq-filter-row">
            <div className="adminfaq-filter-group">
              <label className="adminfaq-filter-label">기간 선택</label>
              <div className="adminfaq-date-group">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => {
                    const today = new Date().toISOString().split('T')[0];
                    setFilters({ 
                      ...filters, 
                      startDate: e.target.value,
                      endDate: today
                    });
                  }}
                  className="adminfaq-date-input"
                />
                <span className="adminfaq-date-separator">~</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="adminfaq-date-input"
                />
              </div>
            </div>
          </div>

          <div className="adminfaq-filter-divider"></div>

          <div className="adminfaq-filter-row">
            <div className="adminfaq-filter-group">
              <label className="adminfaq-filter-label">대상</label>
              <select
                value={filters.userType}
                onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                className="adminfaq-select"
              >
                <option value="">전체</option>
                <option value="사용자">사용자</option>
                <option value="가맹점">가맹점</option>
              </select>
            </div>

            <div className="adminfaq-filter-group">
              <label className="adminfaq-filter-label">분류</label>
              <select
                value={filters.faqType}
                onChange={(e) => setFilters({ ...filters, faqType: e.target.value })}
                className="adminfaq-select"
              >
                <option value="">전체</option>
                {filters.userType === "사용자" ? (
                  <>
                    <option value="회원/계정">회원/계정</option>
                    <option value="주문/결제">주문/결제</option>
                    <option value="취소/환불">취소/환불</option>
                    <option value="상품">상품</option>
                  </>
                ) : filters.userType === "가맹점" ? (
                  <>
                    <option value="회원/계정">회원/계정</option>
                    <option value="정산/결제">정산/결제</option>
                    <option value="상품/주문">상품/주문</option>
                  </>
                ) : (
                  <>
                    <option value="회원/계정">회원/계정</option>
                    <option value="주문/결제">주문/결제</option>
                    <option value="취소/환불">취소/환불</option>
                    <option value="상품">상품</option>
                    <option value="정산/결제">정산/결제</option>
                    <option value="상품/주문">상품/주문</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="adminfaq-filter-row">
            <div className="adminfaq-filter-group">
              <label className="adminfaq-filter-label">검색</label>
              <div className="adminfaq-search-group">
                <select
                  value={filters.searchType}
                  onChange={(e) => setFilters({ ...filters, searchType: e.target.value })}
                  className="adminfaq-select"
                >
                  <option value="all">제목+내용</option>
                  <option value="title">제목만</option>
                  <option value="content">내용만</option>
                  <option value="regNm">작성자</option>
                </select>
                <input
                  type="text"
                  placeholder="검색어를 입력해주세요."
                  value={filters.searchKeyword}
                  onChange={(e) => setFilters({ ...filters, searchKeyword: e.target.value })}
                  className="adminfaq-search-input"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className="adminfaq-filter-btn-group">
              <button className="adminfaq-search-btn" onClick={handleSearch}>
                검색
              </button>
              <button className="adminfaq-reset-btn" onClick={handleReset}>
                초기화
              </button>
            </div>
          </div>
        </div>

        <div className="adminfaq-table-wrap">
          <div className="adminfaq-table-header">
            <div className="adminfaq-table-info">
              총 <span className="adminfaq-count-bold">{totalElements}</span>
              건
            </div>
            <div className="adminfaq-table-actions">
              {showCheckbox ? (
                ""
              ) : (
                <button
                  className="adminfaq-write-btn"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  작성
                </button>
              )}
              {showCheckbox && (
                <button
                  className="adminfaq-delete-confirm-btn"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              )}
              <button
                className={`adminfaq-delete-btn ${
                  showCheckbox ? "active" : ""
                }`}
                onClick={toggleDeleteMode}
              >
                {showCheckbox ? "취소" : "삭제"}
              </button>
            </div>
          </div>

          <table className="adminfaq-table">
            <thead>
              <tr>
                {showCheckbox && <th>선택</th>}
                <th>No.</th>
                <th>제목</th>
                <th>분류</th>
                <th>대상</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>수정자</th>
                <th>수정일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {faqs && faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <tr key={faq.faqIdx}>
                    {showCheckbox && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedFaqs.includes(faq.faqIdx)}
                          onChange={() =>
                            handleCheckboxChange(faq.faqIdx)
                          }
                        />
                      </td>
                    )}
                    <td>{currentPage * pageSize + index + 1}</td>
                    <td className="adminfaq-title">{faq.faqTitle}</td>
                    <td>{faq.faqType || "-"}</td>
                    <td>{faq.userType || "-"}</td>
                    <td>{faq.regNm}</td>
                    <td className="adminfaq-date-cell">{formatDateTimeWithLineBreak(faq.regDateTime)}</td>
                    <td>{faq.modNm || "-"}</td>
                    <td className="adminfaq-date-cell">{formatDateTimeWithLineBreak(faq.modDateTime)}</td>
                    <td>
                      <button
                        className="adminfaq-btn adminfaq-btn-detail"
                        onClick={() => {
                          setSelectedFaq(faq.faqIdx);
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
                  <td
                    colSpan={showCheckbox ? "10" : "9"}
                    style={{ textAlign: "center" }}
                  >
                    등록된 FAQ가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="adminfaq-pagination">
            <button
              className="adminfaq-page-btn"
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  if (isSearchMode) {
                    handleSearchInternal(newPage);
                  } else {
                    fetchFaqs(newPage);
                  }
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`adminfaq-page-btn ${
                  currentPage === index ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentPage(index);
                  if (isSearchMode) {
                    handleSearchInternal(index);
                  } else {
                    fetchFaqs(index);
                  }
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="adminfaq-page-btn"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  if (isSearchMode) {
                    handleSearchInternal(newPage);
                  } else {
                    fetchFaqs(newPage);
                  }
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
      {isModalOpen && selectedFaq && (
        <AdminFaqDetail
          faqIdx={selectedFaq}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFaq(null);
          }}
          onUpdate={() => {
            if (isSearchMode) {
              handleSearchInternal(currentPage);
            } else {
              fetchFaqs(currentPage);
            }
          }}
        />
      )}

      {/* FAQ작성 모달 */}
      {isAddModalOpen && (
        <AdminFaqAdd
          onClose={() => setIsAddModalOpen(false)}
          onAdd={() => {
            if (isSearchMode) {
              handleSearchInternal(0);
            } else {
              fetchFaqs(0);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminFaq;
