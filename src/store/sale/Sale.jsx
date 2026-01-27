import { useState, useEffect } from "react";
import "./css/sale.css";
import { apiGet, apiDelete } from "../../utils/apiClient";
import { formatDateTime } from "../../utils/commonService";
import NegotiationFilter from "../order/components/NegotiationFilter";

const Sale = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [sliderMax, setSliderMax] = useState(100000);
    const [priceRange, setPriceRange] = useState("100000");
    const [isManualInput, setIsManualInput] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async (page = 0) => {
        setLoading(true);
        try {
            const response = await apiGet(`/store/sale?page=${page}&size=${pageSize}`);
            if (response.ok) {
                const data = await response.json();
                setSales(data.content || []);
                setCurrentPage(data.number || 0);
                setTotalPages(data.totalPages || 0);
            } else {
                setSales([]);
            }
        } catch (err) {
            console.error("할인 목록 조회 실패:", err);
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    const searchSales = async (page = 0) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchText) params.append("productNm", searchText);
            if (startDate) params.append("startDateTime", startDate + "T00:00:00");
            if (endDate) params.append("endDateTime", endDate + "T23:59:59");
            if (statusFilter && statusFilter !== "ALL") {
                const statusMap = {
                    "UPCOMING": "할인 전",
                    "ONGOING": "할인 중",
                    "COMPLETED": "할인 완료",
                    "CANCELED": "할인 취소"
                };
                params.append("saleStatus", statusMap[statusFilter]);
            }
            if (minPrice || maxPrice) {
                params.append("minPriceRange", minPrice);
                params.append("maxPriceRange", maxPrice);
            }
            params.append("page", page);
            params.append("size", pageSize);

            console.log("검색 파라미터:", params.toString());

            const response = await apiGet(`/store/sale/search?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setSales(data.content || []);
                setCurrentPage(data.number || 0);
                setTotalPages(data.totalPages || 0);
            } else {
                setSales([]);
            }
        } catch (err) {
            console.error("할인 검색 실패:", err);
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchText("");
        setStartDate("");
        setEndDate("");
        setStatusFilter("ALL");
        setMinPrice(0);
        setMaxPrice(100000);
        setSliderMax(100000);
        setPriceRange("100000");
        setIsManualInput(false);
        setCurrentPage(0);
        loadSales(0);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        searchSales(0);
    };

    const handleCancelSale = async (saleIdx) => {
        if (!window.confirm("할인을 취소하시겠습니까?")) {
            return;
        }

        try {
            const response = await apiDelete(`/store/sale/${saleIdx}`);
            if (response.ok) {
                alert("할인이 취소되었습니다.");
                setSales(prevSales => prevSales.filter(sale => sale.saleIdx !== saleIdx));
            } else {
                const errorData = await response.json();
                alert(errorData.message || "할인 취소에 실패했습니다.");
            }
        } catch (err) {
            console.error("할인 취소 실패:", err);
            alert("할인 취소 중 오류가 발생했습니다.");
        }
    };

    const filteredSales = (Array.isArray(sales) ? sales : []);

    return (
        <div className="sale-wrap">
            {/* 헤더 */}
            <div className="sale-header">
                <div className="sale-header-title">할인 관리</div>
            </div>

            <div className="sale-contents">
                {/* 필터 */}
                <NegotiationFilter
                    searchText={searchText}
                    setSearchText={setSearchText}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    sliderMax={sliderMax}
                    setSliderMax={setSliderMax}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    isManualInput={isManualInput}
                    setIsManualInput={setIsManualInput}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                />

                <table className="sale-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>상품 정보</th>
                            <th>원가</th>
                            <th>할인가</th>
                            <th>시작 일시</th>
                            <th>종료 일시</th>
                            <th>상태</th>
                            <th>관리</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" style={{textAlign: "center", padding: "20px"}}>
                                    로딩 중...
                                </td>
                            </tr>
                        ) : filteredSales.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{textAlign: "center", padding: "20px"}}>
                                    할인 내역이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            filteredSales.map((sale, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="sale-product-info">
                                        <div className="sale-product-info-wrap">
                                            {sale.images?.files && sale.images.files.length > 0 ? (
                                                <img
                                                    src={sale.images.files[0].fileUrl}
                                                    alt="상품 이미지"
                                                    className="sale-product-img"
                                                />
                                            ) : (
                                                <div className="sale-product-img" style={{backgroundColor: "#e0e0e0"}}></div>
                                            )}
                                            <div className="sale-product-text">
                                                <div className="sale-product-name">{sale.productNm}</div>
                                                <div className="sale-product-discount">
                                                    {sale.saleType} {sale.saleValue}{sale.saleType === "할인률" ? "%" : "원"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="sale-originPrice">{sale.originalPrice?.toLocaleString()}원</td>
                                    <td className="sale-price">{sale.discountedPrice?.toLocaleString()}원</td>
                                    <td className="sale-request-date">{formatDateTime(sale.startDateTime)}</td>
                                    <td className="sale-sent-date">{formatDateTime(sale.endDateTime)}</td>
                                    <td className="sale-status">
                                        <p className="sale-status-text">{sale.saleStatus}</p>
                                    </td>
                                    <td className="sale-manage">
                                        <button 
                                            className="sale-cancel-btn"
                                            onClick={() => handleCancelSale(sale.saleIdx)}
                                            disabled={sale.saleStatus === "할인 취소" || sale.saleStatus === "할인 완료"}
                                        >
                                            취소
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="sale-footer">
                <div className="sale-pagination">
                    <button 
                        className="product-page" 
                        onClick={() => {
                            if (currentPage > 0) {
                                const newPage = currentPage - 1;
                                loadSales(newPage);
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
                            onClick={() => loadSales(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        className="product-page"
                        onClick={() => {
                            if (currentPage < totalPages - 1) {
                                const newPage = currentPage + 1;
                                loadSales(newPage);
                            }
                        }}
                        disabled={currentPage === totalPages - 1 || totalPages === 0}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sale;