import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./css/admincategory.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminCategory = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchedCategory, setSearchedCategory] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [detailData, setDetailData] = useState(null);

    // 카테고리 한글 매핑
    const categoryNames = {
        all: "전체",
        retail: "소매/잡화",
        food: "음식/카페",
        health: "뷰티/헬스",
        life: "생활서비스",
        medical: "의료/건강",
        education: "교육/취미",
        rental: "숙박/렌탈",
        service: "서비스/전문",
        sport: "오락/스포츠",
        etc: "기타",
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        // TODO: 실제로는 API 호출로 데이터를 가져와야 합니다
        // 현재는 목업 데이터를 사용합니다
        setSearchedCategory(selectedCategory);
        const mockData = generateMockData(selectedCategory);
        setChartData(mockData.chart);
        setDetailData(mockData.detail);
    };

    // 목업 데이터 생성 함수
    const generateMockData = (category) => {
        if (category === "all") {
            // 전체 카테고리 데이터
            const categories = Object.keys(categoryNames).filter(key => key !== "all");
            const sales = categories.map(() => Math.floor(Math.random() * 5000000) + 1000000);
            const products = categories.map(() => Math.floor(Math.random() * 500) + 50);
            const orders = categories.map(() => Math.floor(Math.random() * 1000) + 100);

            return {
                chart: {
                    labels: categories.map(cat => categoryNames[cat]),
                    datasets: [
                        {
                            label: "판매액 (원)",
                            data: sales,
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                detail: categories.map((cat, idx) => ({
                    category: categoryNames[cat],
                    sales: sales[idx],
                    products: products[idx],
                    orders: orders[idx],
                })),
            };
        } else {
            // 개별 카테고리 데이터 (월별 또는 세부 항목별)
            const labels = ["1월", "2월", "3월", "4월", "5월", "6월"];
            const sales = labels.map(() => Math.floor(Math.random() * 1000000) + 200000);
            const products = labels.map(() => Math.floor(Math.random() * 100) + 10);
            const orders = labels.map(() => Math.floor(Math.random() * 200) + 20);

            return {
                chart: {
                    labels: labels,
                    datasets: [
                        {
                            label: "판매액 (원)",
                            data: sales,
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                detail: labels.map((label, idx) => ({
                    category: label,
                    sales: sales[idx],
                    products: products[idx],
                    orders: orders[idx],
                })),
            };
        }
    };

    // 차트 옵션
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `${categoryNames[searchedCategory]} 판매액`,
                font: {
                    size: 18,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString() + "원";
                    },
                },
            },
        },
    };

    return (
        <div className="admincategory-container">
            <div className="admincategory-wrap">
                <div className="admincategory-filter-wrap">
                    <select
                        name="category"
                        id="category"
                        className="admincategory-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">전체</option>
                        <option value="retail">소매/잡화</option>
                        <option value="food">음식/카페</option>
                        <option value="health">뷰티/헬스</option>
                        <option value="life">생활서비스</option>
                        <option value="medical">의료/건강</option>
                        <option value="education">교육/취미</option>
                        <option value="rental">숙박/렌탈</option>
                        <option value="service">서비스/전문</option>
                        <option value="sport">오락/스포츠</option>
                        <option value="etc">기타</option>
                    </select>

                    <button
                        className="admincategory-search-btn"
                        onClick={handleSearch}
                    >
                        검색
                    </button>
                </div>
                <div className="admincategory-graph-wrap">
                    <div className="admincategory-graph">
                        {chartData ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <div className="admincategory-empty-message">
                                카테고리를 선택하고 검색 버튼을 눌러주세요.
                            </div>
                        )}
                    </div>
                    <div className="admincategory-graph-detail">
                        {detailData ? (
                            <div className="admincategory-detail-content">
                                <h3 className="admincategory-detail-title">
                                    {categoryNames[searchedCategory]} 상세 데이터
                                </h3>
                                <div className="admincategory-detail-list">
                                    {detailData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="admincategory-detail-item"
                                        >
                                            <h4 className="admincategory-detail-item-title">
                                                {item.category}
                                            </h4>
                                            <div className="admincategory-detail-row">
                                                <span className="admincategory-detail-label">
                                                    판매액:
                                                </span>
                                                <span className="admincategory-detail-value">
                                                    {item.sales.toLocaleString()}원
                                                </span>
                                            </div>
                                            <div className="admincategory-detail-row">
                                                <span className="admincategory-detail-label">
                                                    등록상품:
                                                </span>
                                                <span className="admincategory-detail-value">
                                                    {item.products.toLocaleString()}개
                                                </span>
                                            </div>
                                            <div className="admincategory-detail-row">
                                                <span className="admincategory-detail-label">
                                                    판매횟수:
                                                </span>
                                                <span className="admincategory-detail-value">
                                                    {item.orders.toLocaleString()}회
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="admincategory-empty-message">
                                카테고리를 선택하고 검색 버튼을 눌러주세요.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCategory;