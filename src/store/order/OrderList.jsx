import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./css/orderlist.css";
import OrderInfo from "./modal/OrderInfo";
import { apiGet, apiPost } from "../../utils/apiClient";
import { formatDateTime } from "../../utils/commonService";

const OrderList = () => {
  const location = useLocation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchField, setSearchField] = useState("판매번호");
  const [searchText, setSearchText] = useState("");
  const [isOrderInfoModalOpen, setIsOrderInfoModalOpen] = useState(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const handleReset = () => {
    setSearchField("판매번호");
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(0);
    loadOrders(0);
  };

  const loadOrders = async (page = 0) => {
    setLoading(true);
    try {
      let userData = localStorage.getItem("user");
      const storeCode = JSON.parse(userData).storeCode;
     
      const response = await apiGet(`/store/order/statistics/list/${storeCode}?page=${page}&size=${pageSize}`);
      const data = await response.json();
      
      if (response.ok) {
        setCurrentPage(data.number || 0);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        
        const orderList = (data.content || []).map(p => ({
          orderCode: p.orderCode || p.orderId || p.saleCode,
          productNm: p.productsNm,
          buyer: p.buyer,
          totalPrice: p.price,
          payType: p.payType,
          payDate: p.paymentDateTime
        }));
        setList(orderList);
      } else {
        setList([]);
      }
    } catch (error) {
      console.error("주문 목록 조회 중 오류 발생:", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 알람에서 전달받은 state 처리
  useEffect(() => {
    if (location.state?.openModal && location.state?.orderCode) {
      setSelectedOrderCode(location.state.orderCode);
      setIsOrderInfoModalOpen(true);
      
      // state 초기화 (뒤로가기 시 모달이 다시 열리는 것 방지)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const excelDownload = async () => {
    try {
      let userData = localStorage.getItem("user");
      if (!userData) {
        alert('로그인 정보를 찾을 수 없습니다.');
        return;
      }
      
      const storeCode = JSON.parse(userData).storeCode;
      
      const response = await apiPost(`/store/order/list/${storeCode}/excel`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // 현재 날짜로 파일명 생성
      const today = new Date();
      const dateString = today.getFullYear() + 
                        String(today.getMonth() + 1).padStart(2, '0') + 
                        String(today.getDate()).padStart(2, '0');
      
      a.download = `상품_판매_리스트_${dateString}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
    } catch (error) {
      alert('엑셀 다운로드 중 오류가 발생했습니다.');
    }
  }

  return (
    <div className="orderlist-wrap">
      <div className="orderlist-header">
        <div className="orderlist-header-title">매출목록</div>
        <div className="orderlist-header-excel" onClick={excelDownload}>엑셀 다운로드</div>
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
      </div>

      <div className="orderlist-count">
        전체 {totalElements}개 상품
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
            {loading ? (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                  로딩 중...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                  주문 내역이 없습니다.
                </td>
              </tr>
            ) : (
              list.map((p, idx) => (
                <tr key={p.orderCode || idx} onClick={() => {
                  setSelectedOrderCode(p.orderCode);
                  setIsOrderInfoModalOpen(true);
                }} className="product-table-row">
                  <td>{currentPage * pageSize + idx + 1}</td>
                  <td className="product-product-info">
                    {p.productNm}
                  </td>
                  <td>{p.buyer}</td>
                  <td>{p.totalPrice?.toLocaleString()}원</td>
                  <td>{p.payType}</td>
                  <td>{formatDateTime(p.payDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="product-footer">
          <div className="product-pagination">
            <button 
              className="product-page" 
              onClick={() => {
                if (currentPage > 0) {
                  loadOrders(currentPage - 1);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`product-page ${currentPage === i ? 'active' : ''}`}
                onClick={() => loadOrders(i)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="product-page" 
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  loadOrders(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
        </div>
      </div>
      {isOrderInfoModalOpen && (
        <OrderInfo 
          orderCode={selectedOrderCode}
          onClose={() => {
            setIsOrderInfoModalOpen(false);
            setSelectedOrderCode(null);
          }} 
        />
      )}
    </div>
  );
};

export default OrderList;
