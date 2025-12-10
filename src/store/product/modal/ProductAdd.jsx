import { useState, useEffect } from "react";
import "./css/productadd.css";
import { apiPostFormData, apiGet } from "../../../utils/apiClient";

const ProductAdd = ({ onClose }) => {
  const [formData, setFormData] = useState({
    categoryIdx: "",
    productName: "",
    productPrice: "",
    isAdult: false,
    isStock: true,
    productAmount: "",
    productDetailDescription: "",
    productImgs: []
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await apiGet("/category");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } else {
        console.error("카테고리 조회 실패");
      }
    } catch (err) {
      console.error("카테고리 조회 실패:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      productImgs: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryIdx) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (!formData.productName.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }

    if (!formData.productPrice) {
      alert("상품가격을 입력해주세요.");
      return;
    }

    if (formData.isStock && !formData.productAmount) {
      alert("재고량을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("categoryIdx", formData.categoryIdx);
      formDataObj.append("productName", formData.productName);
      formDataObj.append("productPrice", parseInt(formData.productPrice));
      formDataObj.append("isAdult", formData.isAdult);
      formDataObj.append("isStock", formData.isStock);
      formDataObj.append("productAmount", formData.isStock ? parseInt(formData.productAmount) : 0);
      formDataObj.append("productDetailDescription", formData.productDetailDescription);
      
      formData.productImgs.forEach(file => {
        formDataObj.append("productImgs", file);
      });

      const response = await apiPostFormData("/product", formDataObj);

      if (response.ok) {
        alert("상품이 등록되었습니다.");
        onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "상품 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("등록 실패:", err);
      alert("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productadd-wrap">
      <div className="productadd-modal">
        <div className="productadd-header">상품등록</div>

        <form onSubmit={handleSubmit}>
          <div className="productadd-info">
            <div className="productadd-title">기본 정보</div>
            <div className="productadd-info-content-head">
              <div className="productadd-content-title">카테고리</div>
              <div className="productadd-content-body">
                <select
                  name="categoryIdx"
                  value={formData.categoryIdx}
                  onChange={handleChange}
                  className="productadd-input-category"
                >
                  <option value="">카테고리 선택</option>
                  {categories.map(cat => (
                    <option key={cat.categoryIdx} value={cat.categoryIdx}>
                      {cat.categoryNm}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="productadd-info-content-body">
              <div className="productadd-content-title">상품명</div>
              <div className="productadd-content-body">
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="productadd-input"
                  placeholder="상품명 입력"
                />
              </div>
            </div>
            <div className="productadd-info-content-footer">
              <div className="productadd-content-title">상품가격</div>
              <div className="productadd-content-body">
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleChange}
                  className="productadd-input"
                  placeholder="상품가격 입력"
                />
              </div>
            </div>
          </div>

          <div className="productadd-expose">
            <div className="productadd-title">노출 설정</div>
            <div className="productadd-expose-content">
              <div className="productadd-expose-content-body">
                <div className="productadd-content-title">상품분류</div>
                <div className="productadd-content-body">
                  성인
                  <input
                    type="radio"
                    name="isAdult"
                    value="true"
                    checked={formData.isAdult === true}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAdult: true }))}
                    className="productadd-radio"
                  />{" "}
                  일반
                  <input
                    type="radio"
                    name="isAdult"
                    value="false"
                    checked={formData.isAdult === false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAdult: false }))}
                    className="productadd-radio"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="productadd-stock-info">
            <div className="productadd-title">재고 정보</div>
            <div className="productadd-stock-info-content">
              <div className="productadd-stock-info-content-head">
                <div className="productadd-content-title">재고 구분</div>
                <div className="productadd-content-body">
                  서비스
                  <input
                    type="radio"
                    name="isStock"
                    value="false"
                    checked={formData.isStock === false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isStock: false }))}
                    className="productadd-radio"
                  />{" "}
                  일반
                  <input
                    type="radio"
                    name="isStock"
                    value="true"
                    checked={formData.isStock === true}
                    onChange={(e) => setFormData(prev => ({ ...prev, isStock: true }))}
                    className="productadd-radio"
                  />
                </div>
              </div>
              <div className="productadd-stock-info-content-body">
                <div className="productadd-content-title">재고량</div>
                <div className="productadd-content-body">
                  <input
                    type="number"
                    name="productAmount"
                    value={formData.productAmount}
                    onChange={handleChange}
                    disabled={!formData.isStock}
                    className="productadd-input"
                    placeholder="수량 입력"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="productadd-detail-info">
            <div className="productadd-title">상세 정보</div>
            <div className="productadd-detail-info-content">
              <div className="productadd-detail-info-content-head">
                <div className="productadd-content-title-text">상품 설명</div>
                <div className="productadd-content-body-text">
                  <textarea 
                    name="productDetailDescription" 
                    value={formData.productDetailDescription}
                    onChange={handleChange}
                    placeholder="상품 설명 입력"
                  ></textarea>
                </div>
              </div>
              <div className="productadd-detail-info-content-body">
                <div className="productadd-content-title">첨부파일</div>
                <div className="productadd-content-body">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="productadd-file"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="productadd-btn-group">
            <button type="submit" className="productadd-reg-btn" disabled={loading}>
              {loading ? "등록 중..." : "등록"}
            </button>
            <button type="button" className="productadd-close-btn" onClick={onClose} disabled={loading}>
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductAdd;