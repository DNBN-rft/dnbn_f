import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./css/productmanage.css";
import ProductDetail from "./modal/ProductDetail";
import ProductAdd from "./modal/ProductAdd";
import ProductSale from "./modal/ProductSale";
import ProductNego from "./modal/ProductNego";
import { apiGet, apiPost } from "../../utils/apiClient";
import { formatDateTime } from "../../utils/commonService";

const ProductManage = () => {
  const location = useLocation();
  const [searchField, setSearchField] = useState("productNm");
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [statusFilter, setStatusFilter] = useState("전체");

  const [products, setProducts] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isNegoModalOpen, setIsNegoModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSaleProduct, setSelectedSaleProduct] = useState(null);
  const [selectedNegoProduct, setSelectedNegoProduct] = useState(null);

  const loadProducts = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet(`/store/product?page=${page}&size=${pageSize}`);
      const data = await response.json();
      
      if (response.ok) {
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setProducts(data.content);
      } else {
        setError("상품 조회에 실패했습니다.");
      }
    } catch (err) {
      console.error("API 요청 실패:", err);
      setError("상품 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchText) params.append("searchTerm", searchText);
      params.append("searchType", searchField);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page);
      params.append("size", pageSize);

      const response = await apiGet(`/store/product/search?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        if (data.content) {
          setCurrentPage(data.number);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        }
        setProducts(data.content || data);
      } else {
        setError("상품 조회에 실패했습니다.");
      }
    } catch (err) {
      console.error("API 요청 실패:", err);
      setError("상품 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 알람에서 전달받은 state 처리
  useEffect(() => {
    if (location.state?.openModal && location.state?.productCode) {
      setSelectedProduct(location.state.productCode);
      setIsDetailModalOpen(true);
      
      // state 초기화 (뒤로가기 시 모달이 다시 열리는 것 방지)
      window.history.replaceState({}, document.title);
    }
  }, [location, products]);

  const handleReset = () => {
    setSearchField("productNm");
    setSearchText("");
    setStartDate("");
    setEndDate("");
    // setStatusFilter("전체");
    setSelectedCheckboxes(new Map());
    setCurrentPage(0);
    loadProducts(0);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    searchProducts(0);
  };

  // 상품 클릭: 모달이 열려 있으면 열지 않음
  const handleProductClick = (product) => {
    if (isDetailModalOpen || isAddModalOpen || isSaleModalOpen || isNegoModalOpen) return;
    setSelectedProduct(product.productCode);
    setIsDetailModalOpen(true);
  };

  // 할인등록 버튼 클릭
  const handleSaleOpen = (product) => {
    if (isDetailModalOpen || isAddModalOpen || isSaleModalOpen || isNegoModalOpen) return;
    setSelectedSaleProduct(product);
    setIsSaleModalOpen(true);
  };

  // 네고등록 버튼 클릭
  const handleNegoOpen = (product) => {
    if (isDetailModalOpen || isAddModalOpen || isSaleModalOpen || isNegoModalOpen) return;
    setSelectedNegoProduct(product);
    setIsNegoModalOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newMap = new Map();
      products.forEach(p => {
        newMap.set(p.productCode, { productCode: p.productCode, isSale: p.isSale });
      });
      setSelectedCheckboxes(newMap);
    } else {
      setSelectedCheckboxes(new Map());
    }
  };

  const handleCheckboxChange = (productCode, isSale) => {
    const newMap = new Map(selectedCheckboxes);
    if (newMap.has(productCode)) {
      newMap.delete(productCode);
    } else {
      newMap.set(productCode, { productCode, isSale });
    }
    setSelectedCheckboxes(newMap);
  };

  const handleDeleteSelected = async () => {
    if (selectedCheckboxes.size === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    // 할인상품이 포함되어 있는지 체크
    const hasDiscountedProduct = Array.from(selectedCheckboxes.values()).some(item => item.isSale === true);
    if (hasDiscountedProduct) {
      alert("할인이 진행중인 상품이 있습니다.");
      return;
    }

    if (!window.confirm(`${selectedCheckboxes.size}개의 상품을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await apiPost("/store/product/delete", {
        productCodes: Array.from(selectedCheckboxes.keys())
      });

      if (response.ok) {
        alert("상품이 삭제되었습니다.");
        setSelectedCheckboxes(new Map());
        loadProducts();
      } else {
        alert("상품 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("상품 삭제 중 오류가 발생했습니다.");
    }
  };

  const excelDownload = async () => {
    try {
      const response = await apiPost("/store/product/excel");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const today = new Date();
      const dateString = today.getFullYear() + 
                        String(today.getMonth() + 1).padStart(2, '0') + 
                        String(today.getDate()).padStart(2, '0');
      
      a.download = `상품목록_${dateString}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
    } catch (error) {
      console.error("엑셀 다운로드 실패:", error);
      alert("엑셀 다운로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="product-container">
      <div className="productmanage-header">
        <div className="productmanage-header-title">상품관리</div>
        <div className="productmanage-header-actions">
          <button className="product-btn" onClick={() => {
            if (!isDetailModalOpen && !isAddModalOpen && !isSaleModalOpen && !isNegoModalOpen) {
              setIsAddModalOpen(true);
            }
          }}>+ 상품등록</button>
          <button className="product-btn outline danger" onClick={handleDeleteSelected}>상품삭제</button>
          <div className="productmanage-header-excel" onClick={excelDownload}>엑셀 다운로드</div>
        </div>
      </div>

      <div className="product-filter">
        <div className="product-date-range">
          <div className="productmanage-date-range-inner">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="product-date-sep">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="product-search">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="productNm">상품명</option>
              <option value="regNm">등록자</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="product-search-input"
            />
            <div className="productmanage-search-btn">
              <button className="product-btn" onClick={handleSearch}>검색</button>
              <button className="product-btn" onClick={handleReset}>초기화</button>
            </div>
          </div>
        </div>
      </div>

      <div className="product-table-wrap">
        <table className="product-table">
          <thead>
            <tr>
              <th><input type="checkbox" onChange={handleSelectAll} checked={selectedCheckboxes.size === products.length && products.length > 0} /></th>
              <th>상품정보</th>
              <th>가격</th>
              <th>재고</th>
              <th>판매상태</th>
              <th>서비스상품</th>
              <th>성인상품</th>
              <th>등록일</th>
              <th style={{ textAlign: 'center' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>로딩 중...</td></tr>
            ) : error ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error}</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>상품이 없습니다.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.productCode} onClick={() => handleProductClick(p)} style={{ cursor: 'pointer' }}>
                  <td onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedCheckboxes.has(p.productCode)}
                      onChange={() => handleCheckboxChange(p.productCode, p.isSale)}
                    />
                  </td>
                  <td className="product-product-info">
                    <div className="product-thumb">
                      {p.images?.files && p.images.files.length > 0 ? (
                        <img 
                          src={p.images.files[0].fileUrl} 
                          alt={p.productNm}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />  
                      ) : null}
                    </div>
                    <div>
                      <div className="product-badge-group">
                        {p.isSale && <span className="product-badge sale">할인</span>}
                        {p.isNego && <span className="product-badge nego">네고</span>}
                      </div>
                      <div className="productmanage-category">{p.categoryNm}</div>
                      <div className="productmanage-name">{p.productNm}</div>
                    </div>
                  </td>
                  <td>{p.productPrice?.toLocaleString()}원</td>
                  <td>{p.productAmount}</td>
                  <td>{p.productState}</td>
                  <td>{p.isStock ? "일반" : "서비스"}</td>
                  <td>{p.isAdult ? "O" : "X"}</td>
                  <td>{formatDateTime(p.productRegDateTime)}</td>
                  <td onClick={(e) => e.stopPropagation()} style={{ cursor: 'default', textAlign: 'center' }}>
                    <button className="product-sale-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaleOpen(p);
                      }}
                    >
                      할인등록
                    </button>
                    <button className="product-sale-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNegoOpen(p);
                      }}
                    >
                      네고등록
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="product-footer">
          <div className="product-count">
            전체 {totalElements}개 상품
          </div>
          <div className="product-pagination">
            <button 
              className="product-page" 
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  searchText ? searchProducts(newPage) : loadProducts(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`product-page ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  searchText ? searchProducts(index) : loadProducts(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="product-page"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  searchText ? searchProducts(newPage) : loadProducts(newPage);
                }
              }}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
          <div className="product-footer-spacer"></div>
        </div>
      </div>

      {isDetailModalOpen && selectedProduct && (
        <ProductDetail
          productCode={selectedProduct}
          onClose={() => setIsDetailModalOpen(false)}
          onRefresh={loadProducts}
        />
      )}
      {isAddModalOpen && (
        <ProductAdd onClose={() => {
          setIsAddModalOpen(false);
          loadProducts();
        }} />
      )}
      {isSaleModalOpen && selectedSaleProduct && (
        <ProductSale
          onClose={() => setIsSaleModalOpen(false)}
          productPrice={selectedSaleProduct.productPrice}
          productCode={selectedSaleProduct.productCode}
          onRefresh={loadProducts}
        />
      )}
      {isNegoModalOpen && selectedNegoProduct && (
        <ProductNego
          onClose={() => setIsNegoModalOpen(false)}
          productCode={selectedNegoProduct.productCode}
          onRefresh={loadProducts}
        />
      )}
    </div>
  );
};

export default ProductManage;