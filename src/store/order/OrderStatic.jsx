import { useState } from "react";
import "./css/orderstatic.css";

const OrderStatic = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환 (로컬 타임존)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleRecentDateClick = (type) => {
    const today = new Date();
    let startDate, endDate;

    if (type === "today") {
      // 오늘
      startDate = new Date(today);
      endDate = new Date(today);
    } else if (type === "week") {
      // 이번 주 (월요일 시작, 일요일 끝)
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 일요일이면 -6, 아니면 1-요일
      startDate = new Date(today);
      startDate.setDate(today.getDate() + diff);
      
      // 이번 주 일요일
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (type === "month") {
      // 이번 달 1일부터 말일까지
      const year = today.getFullYear();
      const month = today.getMonth();
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
    }

    setStartDate(formatDate(startDate));
    setEndDate(formatDate(endDate));
  };

  const handleRecentDateClickWrapper = (e) => {
    const { name } = e.target;
    handleRecentDateClick(name);
  };

  const handleSearch = () => {
    // TODO: API 호출 로직 추가
    console.log("검색:", { startDate, endDate });
  };

  return (
    <div className="orderlist-wrap">
      <div className="orderlist-header">
        <div className="orderlist-header-title">매출통계</div>
        <div className="orderstatic-header-right">
          <button
            type="button"
            className="orderstatic-search-btn"
            onClick={handleSearch}
          >
            조회
          </button>
          <div className="orderlist-header-excel">엑셀 다운로드</div>
        </div>
      </div>

      <div className="orderlist-filter">
        <div className="orderlist-date-range">
          <div className="orderlist-date-range-inner">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="orderlist-date-input"
            />
            <span className="orderlist-date-sep">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="orderlist-date-input"
            />
          </div>
          <div className="orderlist-recent-btn-group">
            <button
              type="button"
              className="orderlist-recent-btn"
              name="today"
              onClick={handleRecentDateClickWrapper}
            >
              일간
            </button>
            <button
              type="button"
              className="orderlist-recent-btn"
              name="week"
              onClick={handleRecentDateClickWrapper}
            >
              주간
            </button>
            <button
              type="button"
              className="orderlist-recent-btn"
              name="month"
              onClick={handleRecentDateClickWrapper}
            >
              월간
            </button>
          </div>
        </div>
      </div>

      <div className="orderlist-info">
        <div className="orderlist-info1">
          <div className="orderlist-info-title">총 판매량</div>
          <div className="orderlist-info-value">9개</div>
        </div>
        <div className="orderlist-info2">
          <div className="orderlist-info-title">총 매출액</div>
          <div className="orderlist-info-value">1,000,000원</div>
        </div>
        <div className="orderlist-info3">
          <div className="orderlist-info-title">총 주문수</div>
          <div className="orderlist-info-value">100개</div>
        </div>
        <div className="orderlist-info4">
          <div className="orderlist-info-title">평균 주문액</div>
          <div className="orderlist-info-value">10,000원</div>
        </div>
      </div>

      <div className="orderlist-info-detail">
        <div className="orderlist-info-detail-left">
          <div className="orderlist-info-detail-title">인기 상품 TOP 3</div>

          <div className="orderlist-info-detail-rank">
            <div className="orderlist-rank-detail">
              <div className="rank">1</div>

              <div className="orderlist-product-detail">
                <div className="product-name">무선 블루투스 이어폰</div>
                <div className="product-sale">5개 판매</div>
              </div>
            </div>
            <div className="product-price">15,000원</div>
          </div>
        </div>

        <div className="orderlist-info-detail-right">
          <div className="orderlist-info-detail-title">카테고리별 매출</div>

          <div className="orderlist-info-detail-rank">
            <div>음식/카페</div>
            <div>13,000원</div>
          </div>
          <div className="orderlist-info-detail-right-bar">
            <div className="orderlist-info-detail-right-bg">
              <div
                className="orderlist-info-detail-right-color"
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="orderlist-graph">
        <div className="orderlist-info-detail-title">매출 그래프</div>
        <div className="orderlist-graph-detail">그래프 영역</div>
      </div>
    </div>
  );
};
export default OrderStatic;
