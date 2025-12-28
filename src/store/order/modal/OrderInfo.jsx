import { useState, useEffect } from "react";
import "./css/orderinfo.css";
import ReasonInputModal from "./ReasonInputModal";
import { apiGet, apiPut } from "../../../utils/apiClient";
import { formatDateTime } from "../../../utils/commonService";

const OrderInfo = ({ onClose, orderCode }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonType, setReasonType] = useState(null); // 'cancel' or 'refund'
  const [selectedOrderDetailIdx, setSelectedOrderDetailIdx] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderCode) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiGet(`/store/order/statistics/detail/${orderCode}`);
        const data = await response.json();
        
        if (response.ok) {
          setOrderData(data);
        }
      } catch (error) {
        console.error("주문 상세 정보 조회 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderCode]);

  const handleReasonClick = (status, orderDetailIdx, reason) => {
    setSelectedOrderDetailIdx(orderDetailIdx);
    if (status === "취소") {
      setReasonType("cancel");
      setReason(reason);
    } else if (status === "환불") {
      setReasonType("refund");
      setReason(reason);
    }
    setShowReasonModal(true);
  };

  const handleReasonSubmit = async (reason) => {
    setShowReasonModal(false);
    setReasonType(null);
    setSelectedOrderDetailIdx(null);
    setReason("");
    
    // 데이터 재조회하여 버튼 상태 업데이트
    try {
      const response = await apiGet(`/order/statistics/detail/${orderCode}`);
      const data = await response.json();
      if (response.ok) {
        setOrderData(data);
      }
    } catch (error) {
      console.error("데이터 재조회 실패:", error);
    }
  };

  const handleReasonModalClose = () => {
    setShowReasonModal(false);
    setReasonType(null);
    setSelectedOrderDetailIdx(null);
    setReason("");
  };

  const renderActionButton = (product) => {
    if (product.cancelDate) {
      const hasReason = product.reason && product.reason.trim() !== "";
      return (
        <button 
          className="orderinfo-cancel-btn"
          onClick={() => handleReasonClick("취소", product.orderDetailIdx, product.reason)}
          disabled={hasReason}
          style={{ opacity: hasReason ? 0.5 : 1, cursor: hasReason ? 'not-allowed' : 'pointer' }}
        >
          취소사유
        </button>
      );
    } 
    else if (product.refundDate) {
      const hasReason = product.reason && product.reason.trim() !== "";
      return (
        <button 
          className="orderinfo-cancel-btn"
          onClick={() => handleReasonClick("환불", product.orderDetailIdx, product.reason)}
          disabled={hasReason}
          style={{ opacity: hasReason ? 0.5 : 1, cursor: hasReason ? 'not-allowed' : 'pointer' }}
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
    if (checked && orderData?.products) {
      setSelectedItems(orderData.products.map(p => p.orderDetailIdx));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (orderDetailIdx) => {
    setSelectedItems(prev => {
      if (prev.includes(orderDetailIdx)) {
        const newSelected = prev.filter(id => id !== orderDetailIdx);
        setSelectAll(false);
        return newSelected;
      } else {
        const newSelected = [...prev, orderDetailIdx];
        if (orderData?.products && newSelected.length === orderData.products.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  const handleSubmitSelectedItems = async () => {
    if (selectedItems.length === 0) {
      alert('선택된 상품이 없습니다.');
      return;
    }

    const requestBody = {
      orderDetailIdxList: selectedItems
    };

    try {
      const response = await apiPut('/store/order/qr', requestBody);
      if (response.ok) {
        alert('사용 처리 되었습니다.');
        const detailResponse = await apiGet(`/order/statistics/detail/${orderCode}`);
        const data = await detailResponse.json();
        if (detailResponse.ok) {
          setOrderData(data);
          setSelectedItems([]);
          setSelectAll(false);
        }
      } else {
        const result = await response.json();
        alert('처리 실패: ' + (result.message || '알 수 없는 오류'));
      }
    } catch (error) {
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const handleCancelSelectedItems = async () => {
    if (selectedItems.length === 0) {
      alert('선택된 상품이 없습니다.');
      return;
    }

    if (!window.confirm('선택한 상품을 취소하시겠습니까?')) {
      return;
    }

    const requestBody = {
      orderDetailIdxList: selectedItems
    };

    try {
      const response = await apiPut('/order/status', requestBody);
      if (response.ok) {
        alert('취소/환불 처리 되었습니다.');
        const detailResponse = await apiGet(`/order/statistics/detail/${orderCode}`);
        const data = await detailResponse.json();
        if (detailResponse.ok) {
          setOrderData(data);
          setSelectedItems([]);
          setSelectAll(false);
        }
      } else {
        const result = await response.json();
        alert('취소/환불 처리 실패: ' + (result.message || '알 수 없는 오류'));
      }
    } catch (error) {
      alert('취소/환불 처리 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="orderinfo-wrap" onClick={onClose}>
        <div className="orderinfo-modal" onClick={(e) => e.stopPropagation()}>
          <div className="orderinfo-header">판매상세</div>
          <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="orderinfo-wrap" onClick={onClose}>
        <div className="orderinfo-modal" onClick={(e) => e.stopPropagation()}>
          <div className="orderinfo-header">판매상세</div>
          <div style={{ padding: '40px', textAlign: 'center' }}>주문 정보를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

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
                        <td>{orderData.custId || '-'}</td>
                        <td>{orderData.custNm || '-'}</td>
                        <td>{orderData.custTelNo || '-'}</td>
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
                  <td>{orderData.payCode || '-'}</td>
                  <td>{orderData.orderCode || '-'}</td>
                  <td>{orderData.totalPrice ? `${orderData.totalPrice.toLocaleString()}원` : '-'}</td>
                  <td>{orderData.payType || '-'}</td>
                  <td>{formatDateTime(orderData.payDate) || '-'}</td>
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
                  <th>QR사용여부</th>
                  <th>관리</th>
                </tr>
              </thead>

              <tbody>
                {orderData.products && orderData.products.length > 0 ? (
                  orderData.products.map((product, index) => (
                    <tr key={product.orderDetailIdx || index}>
                      <td>
                        <input 
                          type="checkbox"
                          checked={selectedItems.includes(product.orderDetailIdx)}
                          onChange={() => handleSelectItem(product.orderDetailIdx)}
                        />
                      </td>
                      <td>{product.productNm || '-'}</td>
                      <td>{product.productAmount || 0}</td>
                      <td>{product.productPrice ? `${product.productPrice.toLocaleString()}원` : '-'}</td>
                      <td>{product.orderStatus || '-'}</td>
                      <td>{product.qrUsed ? '사용' : '미사용'}</td>
                      <td>{renderActionButton(product)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      판매 상품이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="orderinfo-process-btn-group">
            <button onClick={handleSubmitSelectedItems}>사용</button>
            <button onClick={handleCancelSelectedItems}>취소</button>
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
          orderDetailIdx={selectedOrderDetailIdx}
          existingReason={reason}
        />
      )}
    </div>
  );
};

export default OrderInfo;
