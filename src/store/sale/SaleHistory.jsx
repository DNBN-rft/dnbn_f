import { useState, useEffect } from "react";
import "./css/sale.css";
import { apiGet } from "../../utils/apiClient";
import { formatDateTime } from "../../utils/commonService";

const SaleHistory = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async (page = 0) => {
        setLoading(true);
        try {
            const response = await apiGet(`/store/sale/history?page=${page}&size=${pageSize}`);
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

    const filteredSales = (Array.isArray(sales) ? sales : []).filter(sale => {
        const matchKeyword = searchKeyword === "" || 
            sale.productNm?.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchStatus = statusFilter === "" || sale.saleStatus === statusFilter;
        return matchKeyword && matchStatus;
    });

    return (
        <div className="sale-wrap">
            {/* 헤더 */}
            <div className="sale-header">
                <div className="sale-header-title">할인 이력</div>
            </div>

            <div className="sale-contents">
                {/* 대시보드 */}
                <div className="sale-dashboard">
                    <div className="sale-sent">
                        <div className="sale-sent-box"></div>
                        <div className="sale-sent-contents">
                            <div className="sale-sent-title">할인 완료</div>
                            <div className="sale-sent-number">
                                {(Array.isArray(sales) ? sales : []).filter(s => s.saleStatus === "할인 완료").length}
                            </div>
                        </div>
                    </div>

                    <div className="sale-left">
                        <div className="sale-left-box"></div>
                        <div className="sale-left-contents">
                            <div className="sale-left-title">할인 취소</div>
                            <div className="sale-left-number">
                                {(Array.isArray(sales) ? sales : []).filter(s => s.saleStatus === "할인 취소").length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 검색 영역 */}
                <div className="sale-search">
                    <select 
                        className="sale-search-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">전체 상태</option>
                        <option value="할인 완료">할인 완료</option>
                        <option value="할인 취소">할인 취소</option>
                    </select>
                    <input
                        type="text"
                        className="sale-search-input"
                        placeholder="상품명을 입력하세요."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button className="sale-search-btn" onClick={() => loadSales(0)}>새로고침</button>
                </div>

                {/* 테이블 */}
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
                                                    src={`http://localhost:8080${sale.images.files[0].fileUrl}`}
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
