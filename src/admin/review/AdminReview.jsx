import { useState, useEffect } from "react";
import "./css/adminreview.css";
import AdminReviewDetail from "./modal/AdminReviewDetail";
import { getReviews, hideReview, unhideReview, deleteReviews } from "../../utils/adminReviewService";

const AdminReview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);

  // 필터 상태
  const [filters, setFilters] = useState({
    status: "statusall",
    rate: "rateall",
    period: "dayall",
    searchType: "typeall",
    searchKeyword: "",
  });

  // 리뷰 목록 조회
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const result = await getReviews();
    if (result.success) {
      setReviews(result.data);
      setFilteredReviews(result.data);
    } else {
      alert(result.message || "리뷰 목록 조회 실패");
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
    fetchReviews();
  };

  // 숨기기/보이기
  const handleToggleHidden = async (reviewIdx, isHidden) => {
    const result = isHidden ? await unhideReview(reviewIdx) : await hideReview(reviewIdx);
    if (result.success) {
      alert(result.data);
      fetchReviews();
    } else {
      alert(result.error);
    }
  };

  // 체크박스 선택
  const handleCheckboxChange = (reviewIdx) => {
    setSelectedReviews(prev => {
      if (prev.includes(reviewIdx)) {
        return prev.filter(idx => idx !== reviewIdx);
      } else {
        return [...prev, reviewIdx];
      }
    });
  };

  // 전체 선택
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIdxs = filteredReviews.map(r => r.reviewIdx);
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

    if (!window.confirm(`선택한 ${selectedReviews.length}개의 리뷰를 삭제하시겠습니까?`)) {
      return;
    }

    const result = await deleteReviews(selectedReviews);
    if (result.success) {
      alert(result.data);
      setSelectedReviews([]);
      setShowCheckbox(false);
      fetchReviews();
    } else {
      alert(result.error);
    }
  };

  // 필터 적용
  const handleSearch = () => {
    let result = [...reviews];

    // 상태 필터
    if (filters.status !== "statusall") {
      if (filters.status === "normal") {
        result = result.filter(r => !r.isHidden);
      } else if (filters.status === "hidden") {
        result = result.filter(r => r.isHidden);
      }
    }

    // 평점 필터
    if (filters.rate !== "rateall") {
      result = result.filter(r => r.reviewRate === parseInt(filters.rate));
    }

    // 기간 필터
    if (filters.period !== "dayall") {
      const now = new Date();
      result = result.filter(r => {
        const reviewDate = new Date(r.reviewRegDateTime);
        if (filters.period === "today") {
          return reviewDate.toDateString() === now.toDateString();
        } else if (filters.period === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return reviewDate >= weekAgo;
        } else if (filters.period === "month") {
          return reviewDate.getMonth() === now.getMonth() && reviewDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    // 검색어 필터
    if (filters.searchKeyword) {
      result = result.filter(r => {
        if (filters.searchType === "store") {
          return r.storeNm.includes(filters.searchKeyword);
        } else if (filters.searchType === "author") {
          return r.custNm.includes(filters.searchKeyword);
        } else if (filters.searchType === "content") {
          return r.reviewContent.includes(filters.searchKeyword);
        } else {
          return r.storeNm.includes(filters.searchKeyword) || 
                 r.custNm.includes(filters.searchKeyword) ||
                 r.reviewContent.includes(filters.searchKeyword);
        }
      });
    }

    setFilteredReviews(result);
  };

  return (
    <div className="adminreview-container">
      <div className="adminreview-wrap">
        <div className="adminreview-filter-wrap">
          <div className="adminreview-filter-row">
            <div className="adminreview-filter-group">
              <label htmlFor="review-status">상태</label>
              <select
                name="review-status"
                id="review-status"
                className="adminreview-select"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
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
                onChange={(e) => setFilters({...filters, rate: e.target.value})}
              >
                <option value="rateall">전체</option>
                <option value="1">1점</option>
                <option value="2">2점</option>
                <option value="3">3점</option>
                <option value="4">4점</option>
                <option value="5">5점</option>
              </select>
            </div>

            <div className="adminreview-filter-group">
              <label htmlFor="report-today">기간</label>
              <select
                name="report-today"
                id="report-today"
                className="adminreview-select"
                value={filters.period}
                onChange={(e) => setFilters({...filters, period: e.target.value})}
              >
                <option value="dayall">전체</option>
                <option value="today">오늘</option>
                <option value="week">이번주</option>
                <option value="month">이번달</option>
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
                onChange={(e) => setFilters({...filters, searchType: e.target.value})}
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
                onChange={(e) => setFilters({...filters, searchKeyword: e.target.value})}
              />
              <button className="adminreview-search-btn" onClick={handleSearch}>검색</button>
            </div>
          </div>
        </div>

        <div className="adminreview-table-wrap">
          <div className="adminreview-table-header">
            <div className="adminreview-table-info">
              총 <b>{filteredReviews.length}</b>건
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

          <table className="adminreview-table">
            <thead>
              <tr>
                {showCheckbox && (
                  <th>
                    <input 
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
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
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={showCheckbox ? "9" : "8"} style={{ textAlign: 'center' }}>
                    등록된 리뷰가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review, index) => (
                  <tr key={review.reviewIdx}>
                    {showCheckbox && (
                      <td>
                        <input 
                          type="checkbox"
                          checked={selectedReviews.includes(review.reviewIdx)}
                          onChange={() => handleCheckboxChange(review.reviewIdx)}
                        />
                      </td>
                    )}
                    <td>{index + 1}</td>
                    <td>{review.storeNm}</td>
                    <td>{review.custNm}</td>
                    <td>{review.reviewRate}</td>
                    <td className="adminreview-content">{review.reviewContent}</td>
                    <td>{new Date(review.reviewRegDateTime).toLocaleDateString()}</td>
                    <td className={review.isHidden ? "adminreview-status-hidden" : "adminreview-status-normal"}>
                      {review.isHidden ? "숨김" : "정상"}
                    </td>
                    <td>
                      <button 
                        className="adminreview-btn adminreview-btn-detail"
                        onClick={() => handleDetailClick(review.reviewIdx)}
                      >
                        상세
                      </button>
                      <button 
                        className={`adminreview-btn ${review.isHidden ? 'adminreview-btn-show' : 'adminreview-btn-hide'}`}
                        onClick={() => handleToggleHidden(review.reviewIdx, review.isHidden)}
                      >
                        {review.isHidden ? "보이기" : "숨기기"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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

export default AdminReview;
