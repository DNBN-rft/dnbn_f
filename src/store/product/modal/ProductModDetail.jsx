import { useState, useEffect } from "react";
import "./css/productmoddetail.css";
import { apiGet, apiPutFormData } from "../../../utils/apiClient";

const ProductModDetail = ({ product, onClose, onSave }) => {

  const [dragActive, setDragActive] = useState({
    store: false
  });

  const removeImageFromList = (index) => {
    setAllImages(prev => prev.filter((_, i) => i !== index));
  };

  const [formData, setFormData] = useState({
    productNm: "",
    categoryIdx: "",
    productPrice: "",
    productAmount: "",
    productState: "PENDING",
    isAdult: false,
    isStock: true,
    productDetailDescription: ""
  });

  const [categories, setCategories] = useState([]);

  // 통합된 이미지 리스트 (기존 + 새로운)
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProductImageSelect(e.dataTransfer.files[0]);
    };
  };

  const handleProductImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleProductImageSelect(e.target.files[0]);
    }
  };

  const handleProductImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 새로운 이미지를 allImages에 추가
        setAllImages(prev => [...prev, {
          type: 'new',
          data: file,
          preview: reader.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    loadCategories();

    if (product) {
      // productState 한글 -> Enum 매핑
      let stateEnum = "PENDING";
      if (product.productState === "판매 중") stateEnum = "ON_SALE";
      else if (product.productState === "판매 종료") stateEnum = "ENDED";
      else if (product.productState === "대기") stateEnum = "PENDING";
      else if (product.productState === "판매 제재") stateEnum = "REJECTED";

      setFormData({
        productNm: product.productNm || "",
        categoryIdx: "",
        productPrice: product.productPrice || "",
        productAmount: product.productAmount || "",
        productState: stateEnum,
        isAdult: product.isAdult || false,
        isStock: product.isStock !== undefined ? product.isStock : true,
        productDetailDescription: product.productDetailDescription || ""
      });

      // 기존 이미지를 allImages에 추가 (type: 'existing' 표시)
      if (product.imgs?.files && product.imgs.files.length > 0) {
        const existingImages = product.imgs.files.map(img => {
          // originalName 또는 fileOriginNm 중 존재하는 것 사용
          const fileName = img.originalName || img.fileOriginNm || '';
          
          return {
            type: 'existing',
            data: img,
            preview: `http://localhost:8080${img.fileUrl}`,
            name: fileName
          };
        });
        setAllImages(existingImages);
      } else {
        setAllImages([]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (categories.length > 0 && product?.categoryNm) {
      const matchedCategory = categories.find(cat => cat.categoryNm === product.categoryNm);
      if (matchedCategory) {
        setFormData(prev => ({
          ...prev,
          categoryIdx: matchedCategory.categoryIdx
        }));
      }
    }
  }, [categories, product?.categoryNm]);

  const loadCategories = async () => {
    try {
      const response = await apiGet("/category");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      }
    } catch (err) {
      console.error("카테고리 조회 실패:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };


  // 파일 확장자로 MIME 타입 결정
  const getMimeTypeFromFileName = (fileName) => {
    if (!fileName || typeof fileName !== 'string') {
      console.warn('파일명이 없음, 기본값 image/jpeg 사용');
      return 'image/jpeg';
    }
    
    const parts = fileName.split('.');
    if (parts.length < 2) {
      console.warn('파일 확장자가 없음:', fileName);
      return 'image/jpeg';
    }
    
    const ext = parts.pop().toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'bmp': 'image/bmp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  };

  // 기존 이미지를 File 객체로 변환하는 함수
  const convertExistingImageToFile = async (imageUrl, fileName) => {
    try {
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // fileName이 없으면 URL에서 추출 시도
      let finalFileName = fileName;
      if (!finalFileName) {
        const urlParts = imageUrl.split('/');
        finalFileName = urlParts[urlParts.length - 1] || 'image.jpg';
      }
      
      // MIME 타입을 파일명 확장자로 결정
      const mimeType = getMimeTypeFromFileName(finalFileName);
      
      return new File([blob], finalFileName, { type: mimeType });
    } catch (err) {
      console.error("이미지 변환 실패:", err);
      return null;
    }
  };

  const handleSave = async () => {
    if (!formData.productNm.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }
    if (!formData.categoryIdx) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!formData.productPrice) {
      alert("가격을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("productNm", formData.productNm);
      formDataObj.append("categoryIdx", formData.categoryIdx);
      formDataObj.append("productPrice", parseInt(formData.productPrice));
      formDataObj.append("productAmount", parseInt(formData.productAmount));
      formDataObj.append("productState", formData.productState);
      formDataObj.append("isAdult", formData.isAdult);
      formDataObj.append("isStock", formData.isStock);
      formDataObj.append("productDetailDescription", formData.productDetailDescription);

      // 모든 이미지를 FormData에 추가 (기존 + 새 이미지)
      if (allImages && allImages.length > 0) {
        for (const img of allImages) {
          if (img.type === 'new') {
            // 새로운 이미지는 그대로 추가
            formDataObj.append("productImgs", img.data);
          } else {
            // 기존 이미지는 fetch로 가져와서 File 객체로 변환
            const file = await convertExistingImageToFile(img.preview, img.name);
            if (file) {
              formDataObj.append("productImgs", file);
            }
          }
        }
      }

      const response = await apiPutFormData(`/store/product/${product.productCode}`, formDataObj);

      if (response.ok) {
        alert("상품이 수정되었습니다.");
        if (onSave) {
          onSave();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "상품 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("수정 실패:", err);
      alert("상품 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 언마운트 시 미리보기 URL 해제
  useEffect(() => {
    return () => {
      allImages.forEach(img => {
        if (img.type === 'new') {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [allImages]);

  return (
    <div className="productdetail-wrap">
      <div className="productdetail-modal">
        <div className="productdetail-header">상품 수정</div>

        {/* 상단 */}
        <div className="productdetail-top-content">
          <div>
            {allImages.length > 0 ? (
              <img
                src={allImages[0].preview}
                alt={product.productNm}
                className="productmoddetail-top-content-img"
              />
            ) : (
              <div>이미지 없음</div>
            )}
          </div>

          <div className="productdetail-top-content-info">
            <div className="productdetail-top-content-info1">
              <input
                type="text"
                name="productNm"
                value={formData.productNm}
                onChange={handleChange}
                className="productmod-input"
                placeholder="상품명"
              />
            </div>

            <div className="productdetail-top-content-info3">
              카테고리:{" "}
              <select
                name="categoryIdx"
                value={formData.categoryIdx}
                onChange={handleChange}
                className="productmod-select"
              >
                <option value="">선택하세요</option>
                {categories.map((cat) => (
                  <option key={cat.categoryIdx} value={cat.categoryIdx}>
                    {cat.categoryNm}
                  </option>
                ))}
              </select>
            </div>

            <div className="productdetail-top-content-info4">
              판매가격:{" "}
              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                className="productmod-input"
              />
            </div>

            <div className="productdetail-top-content-info5">
              재고:{" "}
              <input
                type="number"
                name="productAmount"
                value={formData.productAmount}
                onChange={handleChange}
                className="productmod-input"
              />
            </div>

            <div className="productdetail-top-content-info6">
              판매상태:{" "}
              <select
                name="productState"
                value={formData.productState}
                onChange={handleChange}
                className="productmod-select"
              >
                <option value="PENDING">대기</option>
                <option value="ON_SALE">판매 중</option>
                <option value="ENDED">판매 종료</option>
                <option value="REJECTED">판매 제재</option>
              </select>
            </div>
          </div>
        </div>

        {/* 중간 */}
        <div className="productdetail-middle-content">
          <div className="productdetail-middle-content-info1">
            <div className="productdetail-middle-content-info-title">할인 여부</div>
            <div className="productdetail-middle-content-info-detail">
              {product.isSale ? "예" : "아니오"}
            </div>
          </div>

          <div className="productdetail-middle-content-info2">
            <div className="productdetail-middle-content-info-title">네고 여부</div>
            <div className="productdetail-middle-content-info-detail">
              {product.isNego ? "예" : "아니오"}
            </div>
          </div>

          <div className="productdetail-middle-content-info3">
            <div className="productdetail-middle-content-info-title">상품구분</div>
            <div className="productdetail-middle-content-info-detail">
              <select
                name="isAdult"
                value={formData.isAdult}
                onChange={handleChange}
                className="productmod-select"
              >
                <option value={false}>일반</option>
                <option value={true}>성인</option>
              </select>
            </div>
          </div>

          <div className="productdetail-middle-content-info4">
            <div className="productdetail-middle-content-info-title">상품타입</div>
            <div className="productdetail-middle-content-info-detail">
              <select
                name="isStock"
                value={formData.isStock}
                onChange={handleChange}
                className="productmod-select"
              >
                <option value={true}>서비스</option>
                <option value={false}>일반</option>
              </select>
            </div>
          </div>
        </div>

        <div className="productdetail-description">
          <div className="productdetail-description-title">상품 상세설명</div>
          <div className="productdetail-description-content">
            <textarea
              name="productDetailDescription"
              value={formData.productDetailDescription}
              onChange={handleChange}
              className="productmod-textarea"
              rows="5"
            />
          </div>
        </div>

        <div className="fileinfo-middle-subtitle">상품 이미지</div>
        <div className="file-input-wrapper">
          <input
            type="file"
            id="productImage"
            accept=".jpg,.jpeg,.png"
            className="fileinfo-middle-file-input-hidden"
            onChange={handleProductImageChange}
          />
          <label
            htmlFor="productImage"
            className={`file-input-label ${dragActive.product ? 'drag-active' : ''}`}
            onDragEnter={(e) => handleDrag(e, 'product')}
            onDragLeave={(e) => handleDrag(e, 'product')}
            onDragOver={(e) => handleDrag(e, 'product')}
            onDrop={(e) => handleDrop(e, 'product')}
          >
            <div className="file-input-content">
              {allImages.length > 0 ? (
                <div className="file-preview-grid">
                  {allImages.map((img, index) => (
                    <div key={index} className="file-preview-item">
                      <button
                        type="button"
                        className="file-remove-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          removeImageFromList(index);
                        }}
                      >
                        ×
                      </button>
                      <img src={img.preview} alt="미리보기" className="file-preview-image" />
                      <span className="file-name-small">{img.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <span className="file-input-text">등록할 상품 이미지를 올려주세요.(jpg, png) </span>
                  <span className="file-input-link">파일찾기</span>
                </>
              )}
            </div>
          </label>
        </div>

        <div className="productdetail-btn-area">
          <button
            className="productdetail-btn productdetail-btn-edit"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "저장 중..." : "수정 완료"}
          </button>
          <button
            className="productdetail-btn productdetail-btn-close"
            onClick={onClose}
            disabled={loading}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};


export default ProductModDetail;