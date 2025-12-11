import { useEffect, useState } from "react";
import "./css/review.css";
import ReviewAnswer from "./modal/ReviewAnswer";

const Review = () => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchField, setSearchField] = useState("판매번호");
  const [searchText, setSearchText] = useState("");
  const [isReviewAnswerModalOpen, setIsReviewAnswerModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewData, setReviewData] = useState([]);

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSearchField("판매번호");
    setSearchText("");
  }

  const fetchReviews = async () => {
    try {
      const storeCode = "STO_00001";

      const response = await fetch (`http://localhost:8080/api/review/view/${storeCode}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

      if (!response.ok) {
        throw new Error("네트워크 응답에 문제가 있습니다.");
      }
      const data = await response.json();
      setReviewData(data);
    } catch (error) {
    }};

  useEffect(() => {
    fetchReviews();
  }, []);

  // 숨김 처리 함수
  const handleHideReview = async (reviewIdx) => {
    if (!window.confirm("이 리뷰를 숨김 처리하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/review/hidden/${reviewIdx}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hidden: true
        }),
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
          <div className="review-recent-btn-group">
            <button type="button" className="review-recent-btn">
              최근 1개월
            </button>
            <button type="button" className="review-recent-btn">
              최근 3개월
            </button>
            <button type="button" className="review-recent-btn">
              최근 6개월
            </button>
            <button type="button" className="review-recent-btn">
              최근 12개월
            </button>
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
          <div className="review-info-value">{reviewData.length.toLocaleString()}</div>
          <div className="review-info-sub">
            오늘 신규 {reviewData.filter(r => {
              if (!r.regDate) return false;
              const today = new Date();
              const regDate = new Date(r.regDate);
              return regDate.toDateString() === today.toDateString();
            }).length}건
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
            {reviewData.map((p, idx) => {
              return (
                <tr key={p.reviewIdx}>
                  <td>{idx + 1}</td>
                  <td className="review-review-info">
                    {p.reviewImg && <div className="review-thumb" style={{backgroundImage: `url(${p.reviewImg})`}} />}
                    <div className="review-name">{p.productNm || "-"}</div>
                  </td>
                  <td>{p.content}</td>
                  <td>{p.reviewRate}</td>
                  <td>{p.regNm || "회원"}</td>
                  <td>{p.regDate ? new Date(p.regDate).toLocaleString('ko-KR') : "-"}</td>
                  <td>
                    <button 
                      className="review-btn"
                      onClick={() => {
                        setSelectedReview(p);
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="review-footer">
          <div className="review-pagination">
            <button className="review-page">이전</button>
            <button className="review-page active">1</button>
            <button className="review-page">2</button>
            <button className="review-page">3</button>
            <button className="review-page">다음</button>
          </div>
        </div>
      </div>
      {isReviewAnswerModalOpen && selectedReview && (
        <ReviewAnswer
          onClose={() => setIsReviewAnswerModalOpen(false)}
          review={selectedReview}
          refreshData={fetchReviews}
        />
      )}

    </div>
  );
};

export default Review;
