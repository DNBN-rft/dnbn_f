import { useState } from "react";
import "./css/orderinfo.css";
import ReasonInputModal from "./ReasonInputModal";

const OrderInfo = ({ onClose }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonType, setReasonType] = useState(null); // 'cancel' or 'refund'
  const [selectedProductId, setSelectedProductId] = useState(null);

  const sampleProducts = [
    { id: 1, name: "프리미엄 원두 커피", quantity: 2, price: 15000, status: "결제대기" },
    { id: 2, name: "카페라떼", quantity: 1, price: 5000, status: "취소" },
    { id: 3, name: "아메리카노", quantity: 3, price: 4000, status: "환불" },
    { id: 4, name: "카푸치노", quantity: 1, price: 5500, status: "결제완료" },
    { id: 5, name: "바닐라라떼", quantity: 2, price: 6000, status: "환불" }
  ];

  const handleReasonClick = (status, productId) => {
    setSelectedProductId(productId);
    if (status === "취소") {
      setReasonType("cancel");
    } else if (status === "환불") {
      setReasonType("refund");
    }
    setShowReasonModal(true);
  };

  const handleReasonSubmit = (reason) => {
    console.log("사유 제출:", {
      productId: selectedProductId,
      type: reasonType,
      reason: reason
    });
    // 여기에 백엔드 API 호출 코드를 추가하세요
    // 예: axios.post('/api/order/reason', { productId: selectedProductId, reason: reason })
    setShowReasonModal(false);
    setReasonType(null);
    setSelectedProductId(null);
  };

  const handleReasonModalClose = () => {
    setShowReasonModal(false);
    setReasonType(null);
    setSelectedProductId(null);
  };

  const renderActionButton = (status, productId) => {
    if (status === "취소") {
      return (
        <button 
          className="orderinfo-cancel-btn"
          onClick={() => handleReasonClick(status, productId)}
        >
          취소사유
        </button>
      );
    } else if (status === "환불") {
      return (
        <button 
          className="orderinfo-cancel-btn"
          onClick={() => handleReasonClick(status, productId)}
        >
          환불사유
        </button>
      );
    }
    return "-";
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(sampleProducts.map(p => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        const newSelected = prev.filter(itemId => itemId !== id);
        setSelectAll(false);
        return newSelected;
      } else {
        const newSelected = [...prev, id];
        if (newSelected.length === sampleProducts.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  return (
    <div className="orderinfo-wrap" onClick={onClose}>
      <div className="orderinfo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="orderinfo-header">판매상세</div>

        <div className="orderinfo-cust-tab">
          <div className="orderinfo-subtitle">고객정보</div>
          <div className="orderinfo-cust-wrap">
            <table className="orderinfo-cust-table">
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>연락처</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>asdf1234</td>
                        <td>홍길동</td>
                        <td>010-1234-5678</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="orderinfo-subtitle">결제정보</div>
          <div className="orderinfo-credit-wrap">
            <table className="orderinfo-credit-table">
              <thead>
                <tr>
                  <th>결제번호</th>
                  <th>판매번호</th>
                  <th>총금액</th>
                  <th>결제수단</th>
                  <th>결제일시</th>
                  <th>영수증</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>T_TEST_4ea8f28d</td>
                  <td>SPRD_7b9f9208_00001</td>
                  <td>30,000원</td>
                  <td>신용카드</td>
                  <td>2025-06-01 12:13</td>
                  <td>
                    <button className="orderinfo-bill-btn">조회</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="orderinfo-subtitle">판매정보</div>
          <div className="orderinfo-sale-wrap">
            <table className="orderinfo-sale-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>상품명</th>
                  <th>수량</th>
                  <th>상품단가</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>

              <tbody>
                {sampleProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <input 
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        onChange={() => handleSelectItem(product.id)}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price.toLocaleString()}원</td>
                    <td>{product.status}</td>
                    <td>{renderActionButton(product.status, product.id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="orderinfo-process-btn-group">
            <button>사용</button>
            <button>취소</button>
        </div>
        <div className="orderinfo-close-btn-group">
        <div className="orderinfo-close-btn" onClick={onClose}>창닫기</div>
        </div>
      </div>

      {showReasonModal && (
        <ReasonInputModal
          type={reasonType}
          onClose={handleReasonModalClose}
          onSubmit={handleReasonSubmit}
        />
      )}
    </div>
  );
};

export default OrderInfo;
