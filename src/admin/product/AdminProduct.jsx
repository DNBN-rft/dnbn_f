import { useState, useEffect } from "react";
import "./css/adminproduct.css";
import AdminProductDetail from "./modal/AdminProductDetail";
import { getProducts, restrictProducts, deleteProducts, searchProducts } from "../../utils/adminProductService";
import { getCategoryList } from "../../utils/commonService";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isBulkRestrictionModalOpen, setIsBulkRestrictionModalOpen] = useState(false);
  const [bulkRestrictionReason, setBulkRestrictionReason] = useState("");
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  
  // 검색 여부 플래그
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "all-category",
    saleStatus: "all",
    searchType: "all",
    searchKeyword: "",
  });

  // 상품 목록 조회
  useEffect(() => {
    loadProducts();
    fetchCategories();
  }, []);

  const loadProducts = async (page = 0) => {
    const result = await getProducts(page, pageSize);
    if (result.success) {
      setProducts(result.data.content);
      setCurrentPage(result.data.number);
      setTotalPages(result.data.totalPages);
      setTotalElements(result.data.totalElements);
      setIsSearchMode(false);
    }
  };

  const fetchCategories = async () => {
    const result = await getCategoryList();
    if (result.success) {
      setCategoryList(result.data);
    }
  };

  const handleDetailClick = async (productCode) => {
    setSelectedProduct(productCode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateSuccess = () => {
    if (isSearchMode) {
      handleSearchInternal(currentPage);
    } else {
      loadProducts(currentPage);
    }
  };

  // 체크박스 선택
  const handleCheckboxChange = (productCode) => {
    setSelectedProducts(prev => {
      if (prev.includes(productCode)) {
        return prev.filter(code => code !== productCode);
      } else {
        return [...prev, productCode];
      }
    });
  };

  // 전체 선택
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allCodes = products.map(p => p.productCode);
      setSelectedProducts(allCodes);
    } else {
      setSelectedProducts([]);
    }
  };

  // 상품 제재
  const handleRestrict = async () => {
    if (selectedProducts.length === 0) {
      alert("제재할 상품을 선택해주세요.");
      return;
    }
    
    setIsBulkRestrictionModalOpen(true);
  };

  // 제재 사유 입력 후 제출
  const handleBulkRestrictionSubmit = async () => {
    const result = await restrictProducts(selectedProducts, bulkRestrictionReason);
    if (result.success) {
      alert(result.data);
      setSelectedProducts([]);
      setBulkRestrictionReason("");
      setIsBulkRestrictionModalOpen(false);
      if (isSearchMode) {
        handleSearchInternal(currentPage);
      } else {
        loadProducts(currentPage);
      }
    } else {
      alert(result.error);
    }
  };

  // 제재 모달 취소
  const handleBulkRestrictionCancel = () => {
    setBulkRestrictionReason("");
    setIsBulkRestrictionModalOpen(false);
  };

  // 상품 삭제
  const handleDelete = async () => {
    if (selectedProducts.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }
    
    if (!window.confirm(`선택한 ${selectedProducts.length}개의 상품을 삭제하시겠습니까?`)) {
      return;
    }

    const result = await deleteProducts(selectedProducts);
    if (result.success) {
      alert(result.data);
      setSelectedProducts([]);
      if (isSearchMode) {
        handleSearchInternal(currentPage);
      } else {
        loadProducts(currentPage);
      }
    } else {
      alert(result.error);
    }
  };

  // 검색 내부 함수
  const handleSearchInternal = async (page = 0) => {
    const searchParams = {
      startDate: filters.startDate,
      endDate: filters.endDate,
      categoryNm: filters.category,
      productState: filters.saleStatus,
      searchTerm: filters.searchKeyword,
      searchType: filters.searchType,
    };

    const result = await searchProducts(searchParams, page, pageSize);
    if (result.success) {
      setProducts(result.data.content);
      setCurrentPage(result.data.number);
      setTotalPages(result.data.totalPages);
      setTotalElements(result.data.totalElements);
      setIsSearchMode(true);
    } else {
      alert(result.error);
    }
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setCurrentPage(0);
    handleSearchInternal(0);
  };

  // 필터 초기화
  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      category: "all-category",
      saleStatus: "all",
      searchType: "all",
      searchKeyword: "",
    });
    setCurrentPage(0);
    loadProducts(0);
  };

  // 할인/네고 텍스트
  const getDiscountNegoText = (isSale, isNego) => {
    if (isSale && isNego) return "할인+네고";
    if (isSale) return "할인";
    if (isNego) return "네고";
    return "할인/네고 없음";
  };
  return (
    <div className="adminproduct-container">
      <div className="adminproduct-wrap">
        <div className="adminproduct-filter-wrap">
          <div className="adminproduct-filter-row">
            <div className="adminproduct-filter-group">
              <label>조회기간</label>
              <input 
                type="date" 
                className="adminproduct-date-input"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
              <span>~</span>
              <input 
                type="date" 
                className="adminproduct-date-input"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="adminproduct-filter-row">
            <div className="adminproduct-filter-group">
              <label>카테고리</label>
              <select
                name="category"
                id="category"
                className="adminproduct-select"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all-category">전체</option>
                {categoryList.map(category => (
                  <option key={category.categoryIdx} value={category.categoryNm}>
                    {category.categoryNm}
                  </option>
                ))}
              </select>
            </div>
            <div className="adminproduct-filter-group">
              <label>판매상태</label>
              <select
                name="saleStatus"
                id="saleStatus"
                className="adminproduct-select"
                value={filters.saleStatus}
                onChange={(e) => setFilters({...filters, saleStatus: e.target.value})}
              >
                <option value="">전체</option>
                <option value="ON_SALE">판매중</option>
                <option value="ENDED">판매 종료</option>
                <option value="PENDING">대기</option>
                <option value="SOLD_OUT">품절</option>
                <option value="RESTRICTED">제재</option>
              </select>
            </div>
          </div>

          <div className="adminproduct-filter-row adminproduct-search-row">
            <div className="adminproduct-search-group">
              <select
                name="column"
                id="column"
                className="adminproduct-select-type"
                value={filters.searchType}
                onChange={(e) => setFilters({...filters, searchType: e.target.value})}
              >
                <option value="all">전체</option>
                <option value="productNm">상품명</option>
                <option value="storeNm">가맹점명</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력해주세요."
                className="adminproduct-input"
                value={filters.searchKeyword}
                onChange={(e) => setFilters({...filters, searchKeyword: e.target.value})}
              />
              <button className="adminproduct-search-btn" onClick={handleSearch}>검색</button>
              <button className="adminproduct-search-btn" onClick={handleReset}>초기화</button>
            </div>
          </div>
        </div>

        <div className="adminproduct-table-wrap">
          <div className="adminproduct-table-header">
            <div className="adminproduct-table-info">
              총 <span className="adminproduct-count">{totalElements}</span>건
            </div>
            <div className="adminproduct-btn-group">
              <button 
                className="adminproduct-btn adminproduct-btn-restrict"
                onClick={handleRestrict}
              >
                상품제재
              </button>
              <button 
                className="adminproduct-btn adminproduct-btn-delete"
                onClick={handleDelete}
              >
                상품삭제
              </button>
            </div>
          </div>

          <table className="adminproduct-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedProducts.length === products.length && products.length > 0}
                  />
                </th>
                <th>No.</th>
                <th>가맹명</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>성인상품</th>
                <th>가격</th>
                <th>재고</th>
                <th>판매상태</th>
                <th>할인/네고</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center' }}>
                    등록된 상품이 없습니다.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product.productCode}>
                    <td>
                      <input 
                        type="checkbox"
                        checked={selectedProducts.includes(product.productCode)}
                        onChange={() => handleCheckboxChange(product.productCode)}
                      />
                    </td>
                    <td>{currentPage * pageSize + index + 1}</td>
                    <td>{product.storeNm}</td>
                    <td>{product.productNm}</td>
                    <td>{product.categoryNm}</td>
                    <td>{product.isAdult ? "O" : "X"}</td>
                    <td>{product.productPrice?.toLocaleString()}원</td>
                    <td>{product.productAmount}</td>
                    <td>{product.productState}</td>
                    <td>{getDiscountNegoText(product.isSale, product.isNego)}</td>
                    <td>{new Date(product.productRegDateTime).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="adminproduct-btn adminproduct-btn-detail"
                        onClick={() => { handleDetailClick(product.productCode); }}
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="adminproduct-pagination">
            <button 
              className="adminproduct-page-btn"
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  isSearchMode ? handleSearchInternal(newPage) : loadProducts(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`adminproduct-page-btn ${currentPage === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(index);
                  isSearchMode ? handleSearchInternal(index) : loadProducts(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="adminproduct-page-btn"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  isSearchMode ? handleSearchInternal(newPage) : loadProducts(newPage);
                }
              }}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AdminProductDetail 
          productCode={selectedProduct}
          onClose={handleCloseModal}
          onUpdate={handleUpdateSuccess}
        />
      )}

      {isBulkRestrictionModalOpen && (
        <div className="adminproduct-modal-backdrop" onClick={handleBulkRestrictionCancel}>
          <div className="adminproduct-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="adminproduct-modal-header">
              <h2>상품 제재</h2>
            </div>
            <div className="adminproduct-modal-body">
              <p className="adminproduct-modal-info">
                선택한 {selectedProducts.length}개의 상품을 제재하시겠습니까?
              </p>
              <div className="adminproduct-form-group">
                <label htmlFor="bulkRestrictionReason" className="adminproduct-label">제재 사유</label>
                <textarea
                  id="bulkRestrictionReason"
                  className="adminproduct-textarea"
                  value={bulkRestrictionReason}
                  onChange={(e) => setBulkRestrictionReason(e.target.value)}
                  placeholder="제재 사유를 입력해주세요"
                  rows="4"
                />
              </div>
            </div>
            <div className="adminproduct-modal-footer">
              <button 
                className="adminproduct-btn adminproduct-btn-cancel"
                onClick={handleBulkRestrictionCancel}
              >
                취소
              </button>
              <button 
                className="adminproduct-btn adminproduct-btn-confirm"
                onClick={handleBulkRestrictionSubmit}
              >
                제재하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
