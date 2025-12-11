import { useState } from "react";
import "./css/orderlist.css";
import OrderInfo from "./modal/OrderInfo";

const OrderList = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchField, setSearchField] = useState("판매번호");
  const [searchText, setSearchText] = useState("");
  const [isOrderInfoModalOpen, setIsOrderInfoModalOpen] = useState(false);

  const handleReset = () => {
    setSearchField("판매번호");
    setSearchText("");
    setStartDate("");
    setEndDate("");
  };

  const sampleProducts = Array.from({ length: 10 }).map((_, i) => ({
  id: `PROD_${String(i + 1).padStart(6, "0")}`,
  productName: i === 0 ? "아메리카노" : "카페라떼",
  productCount: 3,
  buyerName: "홍길동",
  totalAmount: 25000,
  paymentMethod: "카드결제",
  paymentDate: "2025-11-10 09:30",
}));


  return (
    <div>
      <div className="orderlist-header">
        <div className="orderlist-header-title">매출목록</div>
        <div className="orderlist-header-excel">엑셀 다운로드</div>
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
            <button type="button" className="orderlist-recent-btn">
              최근 1개월
            </button>
            <button type="button" className="orderlist-recent-btn">
              최근 3개월
            </button>
            <button type="button" className="orderlist-recent-btn">
              최근 6개월
            </button>
            <button type="button" className="orderlist-recent-btn">
              최근 12개월
            </button>
          </div>
        </div>
        <div className="orderlist-search">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="orderlist-search-select"
          >
            <option>판매번호</option>
            <option>상품명</option>
            <option>상품코드</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="orderlist-search-input"
          />
          <div className="orderlist-search-btn">
            <button className="orderlist-btn">검색</button>
            <button className="orderlist-btn" onClick={handleReset}>
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="orderlist-count">
        전체 30개 상품 중 1-10개 표시
      </div>

      <div className="product-table-wrap">
        <table className="product-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>상품정보</th>
              <th>구매자</th>
              <th>결제금액</th>
              <th>결제방법</th>
              <th>결제일시</th>
            </tr>
          </thead>
          <tbody>
            {sampleProducts.map((p, idx) => (
              <tr key={p.id} onClick={() => setIsOrderInfoModalOpen(true)} style={{cursor: "pointer"}}>
                <td>{idx + 1}</td>
                <td className="product-product-info">
                  {p.productName} 외 {p.productCount}개
                </td>
                <td>{p.buyerName}</td>
                <td>{p.totalAmount.toLocaleString()}원</td>
                <td>{p.paymentMethod}</td>
                <td>{p.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="product-footer">
          <div className="product-pagination">
            <button className="product-page">이전</button>
            <button className="product-page active">1</button>
            <button className="product-page">2</button>
            <button className="product-page">3</button>
            <button className="product-page">다음</button>
          </div>
        </div>
      </div>
      {isOrderInfoModalOpen && <OrderInfo onClose={() => setIsOrderInfoModalOpen(false)} />}
    </div>
  );
};

export default OrderList;
