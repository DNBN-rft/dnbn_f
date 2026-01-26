import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./css/review.css";
import ReviewAnswer from "./modal/ReviewAnswer";
import { apiGet, apiPut } from "../../utils/apiClient";
import ReviewReport from "./modal/ReviewReport";
import { formatDate } from "../../utils/commonService";

const Review = () => {
  const location = useLocation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchField, setSearchField] = useState("판매번호");
  const [searchText, setSearchText] = useState("");
  const [isReviewAnswerModalOpen, setIsReviewAnswerModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [selectedReviewIdx, setSelectedReviewIdx] = useState(null);
  const [isReviewReportModalOpen, setIsReviewReportModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSearchField("판매번호");
    setSearchText("");
  }

  const fetchReviews = async (page = 0) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      const storeCode = userInfo.storeCode;

      const response = await apiGet(`/store/review/view/${storeCode}?page=${page}&size=${pageSize}`);
      const data = await response.json();
      
      if (response.ok) {
        setReviewData(data.content || []);
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        setReviewData([]);
      }
    } catch (error) {
      setReviewData([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 알람에서 전달받은 state 처리
  useEffect(() => {
    if (location.state?.openModal && location.state?.reviewIdx) {
      setSelectedReviewIdx(location.state.reviewIdx);
      setIsReviewAnswerModalOpen(true);
      
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleHideReview = async (reviewIdx) => {
    if (!window.confirm("이 리뷰를 숨김 처리하시겠습니까?")) {
      return;
    }

    try {
      const response = await apiPut(`/store/review/hidden/${reviewIdx}`, {
        hidden: true
      });

      if (!response.ok) {
        throw new Error("숨김 처리에 실패했습니다.");
      }

      alert("리뷰가 숨김 처리되었습니다.");
      await fetchReviews();
    } catch (error) {
      alert("숨김 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleReportReview = async (reviewIdx) => {
    setSelectedReviewIdx(reviewIdx);
    setIsReviewReportModalOpen(true);
  };

  return (
    <div className="review-wrap">

      <div className="review-header">
        <div className="review-header-title">리뷰관리</div>
      </div>

      <div className="review-filter">
        <div className="review-date-range">
          <div className="review-date-range-inner">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="review-date-input"
            />
            <span className="review-date-sep">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="review-date-input"
            />
          </div>
        </div>
        <div className="review-search">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="review-search-select"
          >
            <option>상품명</option>
            <option>작성자</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="review-search-input"
          />
          <div className="review-search-btn">
            <button className="review-btn">검색</button>
            <button className="review-btn" onClick={handleReset}>
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="review-info">
        <div className="review-info1">
          <div className="review-info-title">총 리뷰수</div>
          <div className="review-info-value">{totalElements.toLocaleString()}</div>
          <div className="review-info-sub">
            현재 페이지 {reviewData.length}건
          </div>
        </div>
        <div className="review-info2">
          <div className="review-info-title">평균 평점</div>
          <div className="review-info-value">
            {reviewData.length > 0 
              ? (reviewData.reduce((sum, r) => sum + r.reviewRate, 0) / reviewData.length).toFixed(1)
              : "리뷰 없음"
            }
          </div>
          <div className="stars stars-4 review-info-sub" aria-label="4.6 / 5"></div>
        </div>
        <div className="review-info3">
          <div className="review-info-title">미응답 리뷰</div>
          <div className="review-info-value">{reviewData.filter(r => !r.reviewAnswered).length}개</div>
          <div className="review-info-sub">응답 필요</div>
        </div>
        <div className="review-info4">
          <div className="review-info-title">낮은 평점 리뷰</div>
          <div className="review-info-value">{reviewData.filter(r => r.reviewRate <= 2).length}개</div>
          <div className="review-info-sub">조치 필요</div>
        </div>
      </div>

      <div className="review-table-wrap">
        <table className="review-table">
          <thead>
            <tr>
              <th className="review-th1">No.</th>
              <th className="review-th2">상품명</th>
              <th className="review-th3">내용</th>
              <th className="review-th4">평점</th>
              <th className="review-th5">작성자</th>
              <th className="review-th6">작성일</th>
              <th className="review-th7">상세</th>
            </tr>
          </thead>
          <tbody>
            {reviewData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', padding: '40px 0'}}>
                  등록된 리뷰가 없습니다
                </td>
              </tr>
            ) : (
              reviewData.map((p, idx) => {
                return (
                  <tr key={p.reviewIdx}>
                  <td>{currentPage * pageSize + idx + 1}</td>
                  <td className="review-review-info">
                    {p.reviewImg && <div className="review-thumb" style={{backgroundImage: `url(${p.reviewImg})`}} />}
                    <div className="review-name">{p.productNm || "-"}</div>
                  </td>
                  <td>{p.content}</td>
                  <td>{p.reviewRate}</td>
                  <td>{p.regNm || "회원"}</td>
                  <td>{p.regDate ? formatDate(p.regDate) : "-"}</td>
                  <td>
                    <button 
                      className="review-btn"
                      onClick={() => {
                        setSelectedReviewIdx(p.reviewIdx);
                        setIsReviewAnswerModalOpen(true);
                      }}
                    >
                      {p.reviewAnswered ? "상세" : "답글"}
                    </button>
                    {p.hidden ? (
                      <button className="review-btn" disabled>숨김처리 중</button>
                    ) : p.hiddenExpireDate ? (
                      <button className="review-btn" disabled>숨김</button>
                    ) : (
                      <button 
                        className="review-btn"
                        onClick={() => handleHideReview(p.reviewIdx)}
                      >
                        숨김
                      </button>
                    )}
                    {p.reported ? (
                      <button className="review-btn" disabled>신고처리 중</button>
                    ) : p.reportExpireDate ? (
                      <button className="review-btn" disabled>신고됨</button>
                    ) :  (
                      <button
                      className="review-btn"
                      onClick={() => handleReportReview(p.reviewIdx)}
                      >신고</button>
                    )}
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>

        <div className="review-footer">
          <div className="review-pagination">
            <button 
              className="review-page"
              onClick={() => fetchReviews(currentPage - 1)}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`review-page ${currentPage === index ? 'active' : ''}`}
                onClick={() => fetchReviews(index)}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="review-page"
              onClick={() => fetchReviews(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || totalPages === 0}
            >
              다음
            </button>
          </div>
        </div>
      </div>
      {isReviewAnswerModalOpen && selectedReviewIdx && (
        <ReviewAnswer
          onClose={() => {
            setIsReviewAnswerModalOpen(false);
            setSelectedReviewIdx(null);
          }}
          reviewIdx={selectedReviewIdx}
          refreshData={fetchReviews}
        />
      )}
      {isReviewReportModalOpen && selectedReviewIdx && (
        <ReviewReport
          onClose={() => {
            setIsReviewReportModalOpen(false);
            setSelectedReviewIdx(null);
          }}
          reviewIdx={selectedReviewIdx}
          refreshData={fetchReviews}
        />
      )}

    </div>
  );
};

export default Review;
