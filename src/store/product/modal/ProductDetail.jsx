import { useState, useEffect, useCallback } from "react";
import "./css/productdetail.css";
import ProductModDetail from "./ProductModDetail";
import { apiGet, apiDelete } from "../../../utils/apiClient";
import { formatDateTime } from "../../../utils/commonService";

const ProductDetail = ({ productCode, onClose, onRefresh }) => {
  const [isModOpen, setIsModOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGet(`/store/product/detail/${productCode}`);

      if (response.ok) {
        const data = await response.json();
        console.log("상품 상세 조회 응답:", data);
        setProduct(data);
      } else {
        setError("상품 정보를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError("상품 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [productCode]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await apiDelete(`/store/product/${productCode}/delete`);

      if (response.ok) {
        alert("상품이 삭제되었습니다.");
        if (onRefresh) {
          onRefresh(); // 목록 새로고침
        }
        onClose(); // 모달 닫기
      } else {
        const errorData = await response.json();
        alert(errorData.message || "상품 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("상품 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return null;

  return (
    <>
      {!isModOpen && (
        <div className="productdetail-wrap" key={refreshKey}>
          <div className="productdetail-modal">
            <div className="productdetail-header">상품 상세 정보</div>

            <div className="productdetail-top-content">
              <div className="productdetail-top-content-img-wrapper">
                {product.imgs?.files?.length > 0 ? (
                  <img
                    src={`http://localhost:8080${product.imgs.files[0].fileUrl}`}
                    alt={product.productNm}
                    className="productdetail-top-content-img"
                  />
                ) : (
                  <div className="productdetail-no-image">이미지 없음</div>
                )}
              </div>
              <div className="productdetail-top-content-info">
                <div className="productdetail-top-content-info1">
                  <div>{product.productNm}</div>
                  <div className="productdetail-top-content-tag">
                    {product.productState}
                  </div>
                </div>

                <div className="productdetail-top-content-info2">
                  상품코드: {product.productCode}
                </div>

                <div className="productdetail-top-content-info3">
                  카테고리: {product.categoryNm}
                </div>

                <div className="productdetail-top-content-info4">
                  판매가격: {product.productPrice}
                </div>

                <div className="productdetail-top-content-info5">
                  재고: {product.productAmount}
                </div>
              </div>
            </div>

            <div className="productdetail-middle-content">
              <div className="productdetail-middle-content-info1">
                <div className="productdetail-middle-content-info-title">
                  할인 여부
                </div>
                <div className="productdetail-middle-content-info-detail">
                  {product.isSale ? "예" : "아니오"}
                </div>
              </div>

              <div className="productdetail-middle-content-info2">
                <div className="productdetail-middle-content-info-title">
                  네고 여부
                </div>
                <div className="productdetail-middle-content-info-detail">
                  {product.isNego ? "예" : "아니오"}
                </div>
              </div>

              <div className="productdetail-middle-content-info3">
                <div className="productdetail-middle-content-info-title">
                  상품구분
                </div>
                <div className="productdetail-middle-content-info-detail">
                  {product.isAdult ? "성인" : "일반"}
                </div>
              </div>

              <div className="productdetail-middle-content-info4">
                <div className="productdetail-middle-content-info-title">
                  상품타입
                </div>
                <div className="productdetail-middle-content-info-detail">
                  {product.isStock ? "서비스" : "일반"}
                </div>
              </div>
            </div>

            <div className="productdetail-description">
              <div className="productdetail-description-title">
                상품 상세설명
              </div>
              <div className="productdetail-description-content">
                {product.productDetailDescription}
              </div>
            </div>

            <div className="productdetail-bottom-content">
              <div className="productdetail-bottom-content-title">관리정보</div>

              <div className="productdetail-bottom-content-info">
                <div className="productdetail-bottom-content-writer">
                  <div>등록자</div>
                  <div>{product.regNm}</div>
                  <div>등록일시</div>
                  <div>{formatDateTime(product.regDateTime)}</div>
                </div>

                <div className="productdetail-bottom-content-editor">
                  <div>수정자</div>
                  <div>{product.modNm}</div>
                  <div>수정일시</div>
                  <div>{formatDateTime(product.modDateTime)}</div>
                </div>
              </div>
            </div>

            <div className="productdetail-btn-area">
              <button
                className="productdetail-btn productdetail-btn-edit"
                onClick={() => setIsModOpen(true)}
                disabled={product.productState === "판매 제재"}
                style={
                  product.productState === "판매 제재"
                    ? { opacity: 0.5, cursor: "not-allowed" }
                    : {}
                }
              >
                수정
              </button>

              <button
                className="productdetail-btn productdetail-btn-delete"
                onClick={handleDelete}
              >
                삭제
              </button>

              <button
                className="productdetail-btn productdetail-btn-close"
                onClick={onClose}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {isModOpen && (
        <ProductModDetail
          product={product}
          onClose={() => setIsModOpen(false)}
          onSave={() => {
            handleRefresh();
            setIsModOpen(false);
            if (onRefresh) {
              onRefresh(); // 목록도 새로고침
            }
          }}
        />
      )}
    </>
  );
};

export default ProductDetail;
