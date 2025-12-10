import { useState, useEffect } from "react";
import "./css/sale.css";
import { apiGet, apiDelete } from "../../utils/apiClient";

const Sale = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        setLoading(true);
        try {
            const response = await apiGet("/sale");
            if (response.ok) {
                const data = await response.json();
                setSales(data);
            }
        } catch (err) {
            console.error("할인 목록 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSale = async (productCode) => {
        if (!window.confirm("할인을 취소하시겠습니까?")) {
            return;
        }

        try {
            const response = await apiDelete(`/sale/${productCode}`);
            if (response.ok) {
                alert("할인이 취소되었습니다.");
                // 즉시 해당 항목을 목록에서 제거
                setSales(prevSales => prevSales.filter(sale => sale.productCode !== productCode));
            } else {
                const errorData = await response.json();
                alert(errorData.message || "할인 취소에 실패했습니다.");
            }
        } catch (err) {
            console.error("할인 취소 실패:", err);
            alert("할인 취소 중 오류가 발생했습니다.");
        }
    };

    const filteredSales = sales.filter(sale => {
        const matchKeyword = searchKeyword === "" || 
            sale.productNm?.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchStatus = statusFilter === "" || sale.saleStatus === statusFilter;
        return matchKeyword && matchStatus;
    });

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-";
        return dateTime.replace("T", " ").substring(0, 16);
    };

    return (
        <div className="sale-wrap">
            {/* 헤더 */}
            <div className="sale-header">
                <div className="sale-header-title">할인 관리</div>
            </div>

            <div className="sale-contents">
                {/* 대시보드 */}
                <div className="sale-dashboard">
                    <div className="sale-sent">
                        <div className="sale-sent-box"></div>
                        <div className="sale-sent-contents">
                            <div className="sale-sent-title">할인 완료</div>
                            <div className="sale-sent-number">
                                {sales.filter(s => s.saleStatus === "할인 완료").length}
                            </div>
                        </div>
                    </div>

                    <div className="sale-left">
                        <div className="sale-left-box"></div>
                        <div className="sale-left-contents">
                            <div className="sale-left-title">진행 중</div>
                            <div className="sale-left-number">
                                {sales.filter(s => s.saleStatus === "할인 중").length}
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
                        <option value="할인 중">할인 중</option>
                        <option value="할인 전">할인 전</option>
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
                    <button className="sale-search-btn" onClick={loadSales}>새로고침</button>
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
                                    <td className="sale-manage">
                                        <button 
                                            className="sale-cancel-btn"
                                            onClick={() => handleCancelSale(sale.productCode)}
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
                    <button className="sale-page">이전</button>
                    <button className="sale-page active">1</button>
                    <button className="sale-page">2</button>
                    <button className="sale-page">3</button>
                    <button className="sale-page">다음</button>
                </div>
            </div>
        </div>
    );
};

export default Sale;