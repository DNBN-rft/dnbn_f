import { useState, useEffect } from "react";
import "./css/sale.css";
import { apiGet } from "../../utils/apiClient";
import { formatDateTime } from "../../utils/commonService";
import NegotiationFilter from "../order/components/NegotiationFilter";

const SaleHistory = () => {
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
            const response = await apiGet(`/store/sale/log-list?page=${page}&size=${pageSize}`);
            if (response.ok) {
                const data = await response.json();
                setSales(data.content || []);
                setCurrentPage(data.number || 0);
                setTotalPages(data.totalPages || 0);
            } else {
                setSales([]);
            }
        } catch (err) {
            console.error("할인 이력 조회 실패:", err);
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

            const response = await apiGet(`/store/sale/log-list/search?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setSales(data.content || []);
                setCurrentPage(data.number || 0);
                setTotalPages(data.totalPages || 0);
            } else {
                setSales([]);
            }
        } catch (err) {
            console.error("할인 이력 검색 실패:", err);
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

    const filteredSales = (Array.isArray(sales) ? sales : []);

    return (
        <div className="sale-wrap">
            <div className="sale-header">
                <div className="sale-header-title">할인 이력</div>
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
                    isHistory={true}
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
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{textAlign: "center", padding: "20px"}}>
                                    로딩 중...
                                </td>
                            </tr>
                        ) : filteredSales.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{textAlign: "center", padding: "20px"}}>
                                    할인 이력이 없습니다.
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
                                    <td>
                                        <span className={`sale-status-badge ${sale.saleLogStatus === 'CANCELED' ? 'canceled' : sale.saleLogStatus === 'COMPLETED' ? 'ended' : ''}`}>
                                            {sale.saleLogStatus === 'CANCELED' ? '취소' : sale.saleLogStatus === 'COMPLETED' ? '종료' : sale.saleLogStatus}
                                        </span>
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

export default SaleHistory;
