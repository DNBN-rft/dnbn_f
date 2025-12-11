import { useState, useEffect } from "react";
import "./css/adminproduct.css";
import AdminProductDetail from "./modal/AdminProductDetail";
import { getProducts, restrictProducts, deleteProducts } from "../../utils/adminProductService";
import { getCategoryList } from "../../utils/commonService";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "all-category",
    saleStatus: "all",
    searchType: "all-option",
    searchKeyword: "",
  });

  // 상품 목록 조회
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const result = await getProducts();
    if (result.success) {
      setProducts(result.data);
      setFilteredProducts(result.data);
    } else {
      alert(result.error);
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
    fetchProducts();
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
      const allCodes = filteredProducts.map(p => p.productCode);
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
    
    if (!window.confirm(`선택한 ${selectedProducts.length}개의 상품을 제재하시겠습니까?`)) {
      return;
    }

    const result = await restrictProducts(selectedProducts);
    if (result.success) {
      alert(result.data);
      setSelectedProducts([]);
      fetchProducts();
    } else {
      alert(result.error);
    }
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
      fetchProducts();
    } else {
      alert(result.error);
    }
  };

  // 필터 적용
  const handleSearch = () => {
    let result = [...products];

    // 날짜 필터
    if (filters.startDate) {
      result = result.filter(p => 
        new Date(p.productRegDateTime) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      result = result.filter(p => 
        new Date(p.productRegDateTime) <= new Date(filters.endDate)
      );
    }

    // 카테고리 필터
    if (filters.category !== "all-category") {
      result = result.filter(p => p.categoryNm === filters.category);
    }

    // 판매상태 필터
    if (filters.saleStatus !== "all") {
      if (filters.saleStatus === "판매중") {
        result = result.filter(p => p.productState === "AVAILABLE");
      } else if (filters.saleStatus === "품절") {
        result = result.filter(p => p.productState === "SOLDOUT");
      } else if (filters.saleStatus === "제재") {
        result = result.filter(p => p.productState === "REJECTED");
      }
    }

    // 검색어 필터
    if (filters.searchKeyword) {
      result = result.filter(p => {
        if (filters.searchType === "productNm") {
          return p.productNm.includes(filters.searchKeyword);
        } else if (filters.searchType === "productCode") {
          return p.productCode.includes(filters.searchKeyword);
        } else {
          return p.productNm.includes(filters.searchKeyword) || 
                 p.productCode.includes(filters.searchKeyword);
        }
      });
    }

    setFilteredProducts(result);
  };

  // 필터 초기화
  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      category: "all-category",
      saleStatus: "all",
      searchType: "all-option",
      searchKeyword: "",
    });
    setFilteredProducts(products);
  };

  // 날짜 범위 설정
  const setDateRange = (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    
    setFilters(prev => ({
      ...prev,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    }));
  };

  // 판매상태 한글 변환
  const getProductStateText = (state) => {
    switch (state) {
      case "AVAILABLE": return "판매중";
      case "SOLDOUT": return "품절";
      case "REJECTED": return "제재";
      default: return state;
    }
  };

  // 할인/네고 텍스트
  const getDiscountNegoText = (isSale, isNego) => {
    if (isSale && isNego) return "할인+네고";
    if (isSale) return "할인";
    if (isNego) return "네고";
    return "일반";
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
            <div className="adminproduct-filter-btn-group">
              <button className="adminproduct-filter-date-btn" onClick={() => setDateRange(1)}>1개월</button>
              <button className="adminproduct-filter-date-btn" onClick={() => setDateRange(3)}>3개월</button>
              <button className="adminproduct-filter-date-btn" onClick={() => setDateRange(6)}>6개월</button>
              <button className="adminproduct-filter-date-btn" onClick={() => setDateRange(12)}>12개월</button>
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
            <div className="adminproduct-filter-status-btn-group">
              <button 
                className={`adminproduct-filter-status-btn ${filters.saleStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, saleStatus: 'all'})}
              >
                전체
              </button>
              <button 
                className={`adminproduct-filter-status-btn ${filters.saleStatus === '판매중' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, saleStatus: '판매중'})}
              >
                판매중
              </button>
              <button 
                className={`adminproduct-filter-status-btn ${filters.saleStatus === '품절' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, saleStatus: '품절'})}
              >
                품절
              </button>
              <button 
                className={`adminproduct-filter-status-btn ${filters.saleStatus === '제재' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, saleStatus: '제재'})}
              >
                제재
              </button>
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
                <option value="all-option">전체</option>
                <option value="productNm">상품명</option>
                <option value="productCode">상품코드</option>
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
              총 <span className="adminproduct-count">{filteredProducts.length}</span>건
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
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center' }}>
                    등록된 상품이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product.productCode}>
                    <td>
                      <input 
                        type="checkbox"
                        checked={selectedProducts.includes(product.productCode)}
                        onChange={() => handleCheckboxChange(product.productCode)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{product.storeNm}</td>
                    <td>{product.productNm}</td>
                    <td>{product.categoryNm}</td>
                    <td>{product.isAdult ? "성인" : "전체"}</td>
                    <td>{product.productPrice?.toLocaleString()}원</td>
                    <td>{product.productAmount}</td>
                    <td>{getProductStateText(product.productState)}</td>
                    <td>{getDiscountNegoText(product.isSale, product.isNego)}</td>
                    <td>{new Date(product.productRegDateTime).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="adminproduct-btn adminproduct-btn-detail"
                        onClick={() => handleDetailClick(product.productCode)}
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AdminProductDetail 
          productCode={selectedProduct}
          onClose={handleCloseModal}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default AdminProduct;
