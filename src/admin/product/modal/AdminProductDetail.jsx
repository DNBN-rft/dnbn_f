import { useState, useEffect } from "react";
import "./css/adminproductdetail.css";
import { getProductDetail, updateProduct } from "../../../utils/adminProductService";
import { getCategoryList } from "../../../utils/commonService";

const AdminProductDetail = ({ productCode, onClose, onUpdate }) => {
  const [productData, setProductData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [categoryList, setCategoryList] = useState([]);

  const fetchProductDetail = async () => {
    const result = await getProductDetail(productCode);
    console.log("상품 상세 조회 응답:", result);
    if (result.success) {
      console.log("상품 데이터:", result.data);
      setProductData(result.data);
      setEditForm({
        productNm: result.data.productNm,
        categoryIdx: result.data.categoryIdx,
        categoryNm: result.data.categoryNm,
        isAdult: result.data.isAdult,
        productPrice: result.data.productPrice,
        productAmount: result.data.productAmount,
        productState: result.data.productState,
        isNego: result.data.isNego,
        isSale: result.data.isSale,
        productDescription: result.data.productDescription,
      });
    } else {
      alert(result.error);
      onClose();
    }
  };

  const fetchCategories = async () => {
    const result = await getCategoryList();
    if (result.success) {
      setCategoryList(result.data);
    }
  };

  useEffect(() => {
    if (productCode) {
      fetchProductDetail();
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCode]);

  const handleSave = async () => {
    const result = await updateProduct(productCode, editForm);
    if (result.success) {
      alert(result.data);
      setIsEditMode(false);
      fetchProductDetail();
      if (onUpdate) {
        onUpdate();
      }
    } else {
      alert(result.error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      productNm: productData.productNm,
      categoryIdx: productData.categoryIdx,
      categoryNm: productData.categoryNm,
      isAdult: productData.isAdult,
      productPrice: productData.productPrice,
      productAmount: productData.productAmount,
      productState: productData.productState,
      isNego: productData.isNego,
      isSale: productData.isSale,
      productDescription: productData.productDescription,
    });
    setIsEditMode(false);
  };

  const getProductStateText = (state) => {
    switch (state) {
      case "AVAILABLE": return "판매중";
      case "SOLDOUT": return "품절";
      case "REJECTED": return "제재";
      default: return state;
    }
  };

  if (!productData) return null;

  return (
    <div className="adminproductdetail-backdrop" onClick={onClose}>
      <div className="adminproductdetail-img">
        {productData.imgs?.files && productData.imgs.files.length > 0 ? (
          <img 
            src={`http://localhost:8080${productData.imgs.files[0].fileUrl}`}
            alt={productData.productNm}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div>이미지 없음</div>
        )}
      </div>
      <div
        className="adminproductdetail-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="adminproductdetail-header">
          <h2 className="adminproductdetail-title">상품 상세 정보</h2>
          <button className="adminproductdetail-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="adminproductdetail-content">
          {/* 가맹점 정보 섹션 */}
          <section className="adminproductdetail-section">
            <h3 className="adminproductdetail-section-title">가맹점 정보</h3>
            <div className="adminproductdetail-grid">
              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">가맹점명</label>
                <span className="adminproductdetail-value">
                  {productData.storeNm}
                </span>
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">가맹점 코드</label>
                <span className="adminproductdetail-value">
                  {productData.storeCode}
                </span>
              </div>

              <div className="adminproductdetail-field adminproductdetail-field-full">
                <label className="adminproductdetail-label">가맹점 주소</label>
                <span className="adminproductdetail-value">
                  {productData.storeAddr} {productData.storeDetailAddr}
                </span>
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">연락처</label>
                <span className="adminproductdetail-value">
                  {productData.storeTelNo}
                </span>
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">영업일</label>
                <span className="adminproductdetail-value">
                  {productData.storeOpenDate?.join(", ") || "-"}
                </span>
              </div>

              <div className="adminproductdetail-field adminproductdetail-field-full">
                <label className="adminproductdetail-label">영업시간</label>
                <span className="adminproductdetail-value">
                  {productData.storeOpenTime} ~ {productData.storeCloseTime}
                </span>
              </div>
            </div>
          </section>

          {/* 상품 등록자 정보 섹션 */}
          <section className="adminproductdetail-section">
            <h3 className="adminproductdetail-section-title">상품 등록자</h3>
            <div className="adminproductdetail-grid">
              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">등록자 ID</label>
                <span className="adminproductdetail-value">
                  {productData.memberId}
                </span>
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">등록자명</label>
                <span className="adminproductdetail-value">
                  {productData.memberNm}
                </span>
              </div>
            </div>
          </section>

          {/* 상품 정보 섹션 */}
          <section className="adminproductdetail-section">
            <div className="adminproductdetail-section-header">
              <h3 className="adminproductdetail-section-title">상품 정보</h3>
              {isEditMode ? (
                <div className="adminproductdetail-section-actions">
                  <button 
                    className="adminproductdetail-btn adminproductdetail-save-btn"
                    onClick={handleSave}
                  >
                    저장
                  </button>
                  <button 
                    className="adminproductdetail-btn adminproductdetail-cancel-btn"
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button 
                  className="adminproductdetail-btn adminproductdetail-edit-btn"
                  onClick={() => setIsEditMode(true)}
                >
                  수정
                </button>
              )}
            </div>
            <div className="adminproductdetail-grid">
              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">상품명</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editForm.productNm}
                    onChange={(e) => setEditForm({...editForm, productNm: e.target.value})}
                    className="adminproductdetail-input"
                  />
                ) : (
                  <span className="adminproductdetail-value">
                    {productData.productNm}
                  </span>
                )}
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">상품 코드</label>
                <span className="adminproductdetail-value">
                  {productData.productCode}
                </span>
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">카테고리</label>
                {isEditMode ? (
                  <select
                    value={editForm.categoryIdx || ''}
                    onChange={(e) => {
                      const selectedCategory = categoryList.find(cat => cat.categoryIdx === parseInt(e.target.value));
                      setEditForm({
                        ...editForm, 
                        categoryIdx: parseInt(e.target.value),
                        categoryNm: selectedCategory?.categoryNm || ''
                      });
                    }}
                    className="adminproductdetail-select"
                  >
                    <option value="">카테고리 선택</option>
                    {categoryList.map(category => (
                      <option key={category.categoryIdx} value={category.categoryIdx}>
                        {category.categoryNm}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="adminproductdetail-value">
                    {productData.categoryNm}
                  </span>
                )}
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">성인상품</label>
                {isEditMode ? (
                  <select
                    value={editForm.isAdult}
                    onChange={(e) => setEditForm({...editForm, isAdult: e.target.value === 'true'})}
                    className="adminproductdetail-select"
                  >
                    <option value="false">일반</option>
                    <option value="true">성인</option>
                  </select>
                ) : (
                  <span className="adminproductdetail-value">
                    {productData.isAdult ? "성인" : "일반"}
                  </span>
                )}
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">가격</label>
                {isEditMode ? (
                  <input
                    type="number"
                    value={editForm.productPrice}
                    onChange={(e) => setEditForm({...editForm, productPrice: parseInt(e.target.value)})}
                    className="adminproductdetail-input"
                  />
                ) : (
                  <span className="adminproductdetail-value">
                    {productData.productPrice?.toLocaleString()}원
                  </span>
                )}
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">재고</label>
                {isEditMode ? (
                  <input
                    type="number"
                    value={editForm.productAmount}
                    onChange={(e) => setEditForm({...editForm, productAmount: parseInt(e.target.value)})}
                    className="adminproductdetail-input"
                  />
                ) : (
                  <span className="adminproductdetail-value">
                    {productData.productAmount}
                  </span>
                )}
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">판매상태</label>
                {isEditMode ? (
                  <select
                    value={editForm.productState}
                    onChange={(e) => setEditForm({...editForm, productState: e.target.value})}
                    className="adminproductdetail-select"
                  >
                    <option value="AVAILABLE">판매중</option>
                    <option value="SOLDOUT">품절</option>
                    <option value="REJECTED">제재</option>
                  </select>
                ) : (
                  <span className="adminproductdetail-value">
                    {getProductStateText(productData.productState)}
                  </span>
                )}
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">할인</label>
                {isEditMode ? (
                  <select
                    value={editForm.isSale}
                    onChange={(e) => setEditForm({...editForm, isSale: e.target.value === 'true'})}
                    className="adminproductdetail-select"
                  >
                    <option value="false">미사용</option>
                    <option value="true">사용</option>
                  </select>
                ) : (
                  <span className="adminproductdetail-value">
                    {productData.isSale ? "사용" : "미사용"}
                  </span>
                )}
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">네고</label>
                {isEditMode ? (
                  <select
                    value={editForm.isNego}
                    onChange={(e) => setEditForm({...editForm, isNego: e.target.value === 'true'})}
                    className="adminproductdetail-select"
                  >
                    <option value="false">미사용</option>
                    <option value="true">사용</option>
                  </select>
                ) : (
                  <span className="adminproductdetail-value">
                    {productData.isNego ? "사용" : "미사용"}
                  </span>
                )}
              </div>

              <div className="adminproductdetail-field">
                <label className="adminproductdetail-label">등록일</label>
                <span className="adminproductdetail-value">
                  {new Date(productData.productRegDateTime).toLocaleString()}
                </span>
              </div>

              <div className="adminproductdetail-field adminproductdetail-field-full">
                <label className="adminproductdetail-label">상품 설명</label>
                {isEditMode ? (
                  <textarea
                    value={editForm.productDescription}
                    onChange={(e) => setEditForm({...editForm, productDescription: e.target.value})}
                    className="adminproductdetail-textarea"
                    rows="4"
                  />
                ) : (
                  <span className="adminproductdetail-value">
                    {productData.productDescription}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="adminproductdetail-footer">
          <button
            className="adminproductdetail-btn adminproductdetail-close-footer-btn"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
