import { useEffect, useState } from "react";
import "./css/adminreportedreview.css";
import AdminReviewDetail from "./modal/AdminReviewDetail";
import {
  deleteReviews,
  hideReview,
  unhideReview,
  getReportedReviews,
} from "../../utils/adminReviewService";
import { useNavigate } from "react-router-dom";

const AdminReportedReview = () => {
  const navigator = useNavigate();
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

  // 필터 상태 (현재는 사용 안함, UI를 위해 유지)
  const [filters, setFilters] = useState({
    status: "statusall",
    rate: "rateall",
    period: "dayall",
    searchType: "typeall",
    searchKeyword: "",
  });

  // 리뷰 목록 조회
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getReportedReviews(page, pageSize);
      if (result.success) {
        setReviews(result.data.content);
        setCurrentPage(result.data.number);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
      } else {
        setError(result.error);
        setReviews([]);
      }
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
    loadReviews(currentPage);
  };

  // 숨기기/보이기
  const handleToggleHidden = async (reviewIdx, isHidden) => {
    const result = isHidden
      ? await unhideReview(reviewIdx)
      : await hideReview(reviewIdx);
    if (result.success) {
      alert(result.data);
      loadReviews(currentPage);
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

  // 검색 함수 (현재는 비활성화)
  const handleSearch = () => {
    // TODO: 추후 검색 기능 구현 시 활성화
    alert("검색 기능은 현재 준비 중입니다.");
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
      loadReviews(currentPage);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="adminreportedreview-container">
      <div className="adminreportedreview-wrap">
        {/* 탭 네비게이션 */}
        <div className="adminreportedreview-tab-navigation">
          <button
            className="adminreportedreview-tab-btn"
            onClick={() => {
              navigator("/admin/review");
            }}
          >
            리뷰 목록
          </button>
          <button className="adminreportedreview-tab-btn adminreportedreview-tab-active">
            신고 누적 리뷰 목록
          </button>
        </div>
        <div className="adminreportedreview-filter-wrap">
          <div className="adminreportedreview-filter-row">
            <div className="adminreportedreview-filter-group">
              <label htmlFor="review-status">상태</label>
              <select
                name="review-status"
                id="review-status"
                className="adminreportedreview-select"
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

            <div className="adminreportedreview-filter-group">
              <label htmlFor="review-rate">평점</label>
              <select
                name="review-rate"
                id="review-rate"
                className="adminreportedreview-select"
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

            <div className="adminreportedreview-filter-group">
              <label htmlFor="report-today">기간</label>
              <select
                name="report-today"
                id="report-today"
                className="adminreportedreview-select"
                value={filters.period}
                onChange={(e) =>
                  setFilters({ ...filters, period: e.target.value })
                }
              >
                <option value="dayall">전체</option>
                <option value="today">오늘</option>
                <option value="week">이번주</option>
                <option value="month">이번달</option>
              </select>
            </div>
          </div>

          <div className="adminreportedreview-filter-row adminreportedreview-search-row">
            <div className="adminreportedreview-search-group">
              <select
                name="type"
                id="type"
                className="adminreportedreview-select-type"
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
                className="adminreportedreview-input"
                placeholder="검색어를 입력하세요"
                value={filters.searchKeyword}
                onChange={(e) =>
                  setFilters({ ...filters, searchKeyword: e.target.value })
                }
              />
              <button className="adminreportedreview-search-btn" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </div>
        <div className="adminreportedreview-table-wrap">
          <div className="adminreportedreview-table-header">
            <div className="adminreportedreview-table-info">
              총 <b>{totalElements}</b>건
            </div>
            {showCheckbox && (
              <button
                className="adminreportedreview-btn adminreportedreview-btn-delete-confirm"
                onClick={handleDelete}
              >
                선택 삭제
              </button>
            )}
            <button
              className="adminreportedreview-btn adminreportedreview-btn-delete-mode"
              onClick={() => {
                setShowCheckbox(!showCheckbox);
                setSelectedReviews([]);
              }}
            >
              {showCheckbox ? "취소" : "삭제"}
            </button>
          </div>
          {loading ? (
            <div className="adminreportedreview-loading">로딩 중</div>
          ) : error ? (
            <div className="adminreportedreview-error">{error}</div>
          ) : (
            <table className="adminreportedreview-table">
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
                      <td className="adminreportedreview-content">
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
                            ? "adminreportedreview-status-hidden"
                            : "adminreportedreview-status-normal"
                        }
                      >
                        {review.isHidden ? "숨김" : "정상"}
                      </td>
                      <td>{review.reportedCnt}</td>
                      <td>
                        <button
                          className="adminreportedreview-btn adminreportedreview-btn-detail"
                          onClick={() => handleDetailClick(review.reviewIdx)}
                        >
                          상세
                        </button>
                        <button
                          className={`adminreportedreview-btn ${
                            review.isHidden
                              ? "adminreportedreview-btn-show"
                              : "adminreportedreview-btn-hide"
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
          <div className="adminreportedreview-pagination">
            <button 
              className="adminreportedreview-page-btn"
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadReviews(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`adminreportedreview-page-btn ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  loadReviews(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="adminreportedreview-page-btn"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadReviews(newPage);
                }
              }}
              disabled={currentPage === totalPages - 1}
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
