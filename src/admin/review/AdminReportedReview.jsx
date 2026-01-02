import { useEffect, useState } from "react";
import "./css/adminreview.css";
import AdminReviewDetail from "./modal/AdminReviewDetail";
import {
  deleteReviews,
  hideReview,
  unhideReview,
  searchReviews,
} from "../../utils/adminReviewService";
import { apiGet } from "../../utils/apiClient";
import { useNavigate } from "react-router-dom";

const AdminReportedReview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 검색 여부 플래그
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 필터 상태
  const [filters, setFilters] = useState({
    status: "statusall",
    rate: "rateall",
    period: "dayall",
    searchType: "typeall",
    searchKeyword: "",
    startDate: "",
    endDate: "",
  });

  // 리뷰 목록 조회
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet(`/admin/review/reportedReview?page=${page}&size=${pageSize}`);
      if (!response.ok) {
        throw new Error("리뷰 목록을 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setReviews(data.content || []);
      setCurrentPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setIsSearchMode(false);
    } catch (err) {
      setError(err.message);
      console.error("리뷰 목록 조회 실패: ", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = (reviewIdx) => {
    setSelectedReview(reviewIdx);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handleUpdateSuccess = () => {
    if (isSearchMode) {
      handleSearchInternal(currentPage);
    } else {
      loadReviews(currentPage);
    }
  };

  // 숨기기/보이기
  const handleToggleHidden = async (reviewIdx, isHidden) => {
    const result = isHidden
      ? await unhideReview(reviewIdx)
      : await hideReview(reviewIdx);
    if (result.success) {
      alert(result.data);
      if (isSearchMode) {
        handleSearchInternal(currentPage);
      } else {
        loadReviews(currentPage);
      }
    } else {
      alert(result.error);
    }
  };

  // 체크박스 선택
  const handleCheckboxChange = (reviewIdx) => {
    setSelectedReviews((prev) => {
      if (prev.includes(reviewIdx)) {
        return prev.filter((idx) => idx !== reviewIdx);
      } else {
        return [...prev, reviewIdx];
      }
    });
  };

  // 전체 선택
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIdxs = reviews.map((r) => r.reviewIdx);
      setSelectedReviews(allIdxs);
    } else {
      setSelectedReviews([]);
    }
  };

  // 리뷰 삭제
  const handleDelete = async () => {
    if (selectedReviews.length === 0) {
      alert("삭제할 리뷰를 선택해주세요.");
      return;
    }

    if (
      !window.confirm(
        `선택한 ${selectedReviews.length}개의 리뷰를 삭제하시겠습니까?`
      )
    ) {
      return;
    }

    const result = await deleteReviews(selectedReviews);
    if (result.success) {
      alert(result.data);
      setSelectedReviews([]);
      setShowCheckbox(false);
      if (isSearchMode) {
        handleSearchInternal(currentPage);
      } else {
        loadReviews(currentPage);
      }
    } else {
      alert(result.error);
    }
  };

  // 검색 내부 함수
  const handleSearchInternal = async (page = 0) => {
    const searchParams = {
      isHidden: filters.status === "normal" ? false :
        filters.status === "hidden" ? true : null,
      ratings: filters.rate !== "rateall" ? [parseInt(filters.rate)] : null,
      startDate: filters.startDate,
      endDate: filters.endDate,
      searchTerm: filters.searchKeyword,
      searchType: filters.searchType === "typeall" ? "all" :
        filters.searchType === "store" ? "storenm" :
          filters.searchType === "author" ? "regnm" :
            filters.searchType === "content" ? "content" : "all",
      isReported: true, // 신고된 리뷰만 조회
    };

    setLoading(true);
    setError(null);
    try {
      const result = await searchReviews(searchParams, page, pageSize);
      if (result.success) {
        setReviews(result.data.content || []);
        setCurrentPage(result.data.number || 0);
        setTotalPages(result.data.totalPages || 0);
        setTotalElements(result.data.totalElements || 0);
        setIsSearchMode(true);
      } else {
        setError(result.error);
        alert(result.error);
      }
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
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
      status: "statusall",
      rate: "rateall",
      period: "dayall",
      searchType: "typeall",
      searchKeyword: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(0);
    loadReviews(0);
  };

  return (
    <div className="adminreview-container">
      <div className="adminreview-wrap">
        {/* 탭 네비게이션 */}
        <div className="adminreview-tab-navigation">
          <button
            className="adminreview-tab-btn"
            onClick={() => {
              navigate("/admin/review");
            }}
          >
            리뷰 목록
          </button>
          <button className="adminreview-tab-btn adminreview-tab-active">
            신고 누적 리뷰 목록
          </button>
        </div>
        <div className="adminreview-filter-wrap">
          <div className="adminreview-filter-row">
            <div className="adminreview-filter-group">
              <label>조회기간</label>
              <input
                type="date"
                className="adminreview-date-input"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
              <span>~</span>
              <input
                type="date"
                className="adminreview-date-input"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="adminreview-filter-row">
            <div className="adminreview-filter-group">
              <label htmlFor="review-status">상태</label>
              <select
                name="review-status"
                id="review-status"
                className="adminreview-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="statusall">전체</option>
                <option value="normal">정상</option>
                <option value="hidden">숨김</option>
              </select>
            </div>

            <div className="adminreview-filter-group">
              <label htmlFor="review-rate">평점</label>
              <select
                name="review-rate"
                id="review-rate"
                className="adminreview-select"
                value={filters.rate}
                onChange={(e) =>
                  setFilters({ ...filters, rate: e.target.value })
                }
              >
                <option value="rateall">전체</option>
                <option value="1">1점</option>
                <option value="2">2점</option>
                <option value="3">3점</option>
                <option value="4">4점</option>
                <option value="5">5점</option>
              </select>
            </div>
          </div>

          <div className="adminreview-filter-row adminreview-search-row">
            <div className="adminreview-search-group">
              <select
                name="type"
                id="type"
                className="adminreview-select-type"
                value={filters.searchType}
                onChange={(e) =>
                  setFilters({ ...filters, searchType: e.target.value })
                }
              >
                <option value="typeall">전체</option>
                <option value="store">가맹점명</option>
                <option value="content">내용</option>
                <option value="author">작성자</option>
              </select>
              <input
                type="text"
                className="adminreview-input"
                placeholder="검색어를 입력하세요"
                value={filters.searchKeyword}
                onChange={(e) =>
                  setFilters({ ...filters, searchKeyword: e.target.value })
                }
              />
              <button className="adminreview-search-btn" onClick={handleSearch}>
                검색
              </button>
              <button className="adminreview-reset-btn" onClick={handleReset}>
                초기화
              </button>
            </div>
          </div>
        </div>
        <div className="adminreview-table-wrap">
          <div className="adminreview-table-header">
            <div className="adminreview-table-info">
              총 <b>{totalElements}</b>건
            </div>
            {showCheckbox && (
              <button
                className="adminreview-btn adminreview-btn-delete-confirm"
                onClick={handleDelete}
              >
                선택 삭제
              </button>
            )}
            <button
              className="adminreview-btn adminreview-btn-delete-mode"
              onClick={() => {
                setShowCheckbox(!showCheckbox);
                setSelectedReviews([]);
              }}
            >
              {showCheckbox ? "취소" : "삭제"}
            </button>
          </div>
          {loading ? (
            <div className="adminreview-loading">로딩 중</div>
          ) : error ? (
            <div className="adminreview-error">{error}</div>
          ) : (
            <table className="adminreview-table">
              <thead>
                <tr>
                  {showCheckbox && (
                    <th>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedReviews.length === reviews.length &&
                          reviews.length > 0
                        }
                      />
                    </th>
                  )}
                  <th>번호</th>
                  <th>가맹점명</th>
                  <th>작성자</th>
                  <th>평점</th>
                  <th>내용</th>
                  <th>작성일</th>
                  <th>상태</th>
                  <th>신고 누적 횟수</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showCheckbox ? "10" : "9"}
                      style={{ textAlign: "center" }}
                    >
                      등록된 리뷰가 없습니다.
                    </td>
                  </tr>
                ) : (
                  reviews.map((review, index) => (
                    <tr key={review.reviewIdx}>
                      {showCheckbox && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedReviews.includes(review.reviewIdx)}
                            onChange={() =>
                              handleCheckboxChange(review.reviewIdx)
                            }
                          />
                        </td>
                      )}
                      <td>{currentPage * pageSize + index + 1}</td>
                      <td>{review.storeNm}</td>
                      <td>{review.custNm}</td>
                      <td>{review.reviewRate}</td>
                      <td className="adminreview-content">
                        {review.reviewContent}
                      </td>
                      <td>
                        {new Date(
                          review.reviewRegDateTime
                        ).toLocaleDateString()}
                      </td>
                      <td
                        className={
                          review.isHidden
                            ? "adminreview-status-hidden"
                            : "adminreview-status-normal"
                        }
                      >
                        {review.isHidden ? "숨김" : "정상"}
                      </td>
                      <td>{review.reportedCnt}</td>
                      <td>
                        <button
                          className="adminreview-btn adminreview-btn-detail"
                          onClick={() => handleDetailClick(review.reviewIdx)}
                        >
                          상세
                        </button>
                        <button
                          className={`adminreview-btn ${review.isHidden
                              ? "adminreview-btn-show"
                              : "adminreview-btn-hide"
                            }`}
                          onClick={() =>
                            handleToggleHidden(
                              review.reviewIdx,
                              review.isHidden
                            )
                          }
                        >
                          {review.isHidden ? "보이기" : "숨기기"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 페이지네이션 */}
          <div className="adminreview-pagination">
            <button
              className="adminreview-page-btn"
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  isSearchMode ? handleSearchInternal(newPage) : loadReviews(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`adminreview-page-btn ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  isSearchMode ? handleSearchInternal(index) : loadReviews(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="adminreview-page-btn"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  isSearchMode ? handleSearchInternal(newPage) : loadReviews(newPage);
                }
              }}
              disabled={currentPage === totalPages - 1 || totalPages === 0}
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AdminReviewDetail
          reviewIdx={selectedReview}
          onClose={handleCloseModal}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default AdminReportedReview;
