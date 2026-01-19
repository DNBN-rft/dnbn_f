import { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./css/adminplan.css";

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminPlan = () => {
    const currentMonth = new Date().getMonth(); // 0-11
    const [selectedPlan, setSelectedPlan] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    // const [selectedType, setSelectedType] = useState("sign");
    const [chartData, setChartData] = useState(null);

    // 플랜 이름 매핑
    const planNames = {
        free: "무료 플랜",
        shot: "단회 플랜",
        basic: "베이직 플랜",
        standard: "스탠다드 플랜",
        premium: "프리미엄 플랜",
        wide: "와이드 플랜",
        special: "스페셜 플랜",
    };

    // 플랜별 색상
    const planColors = {
        free: "rgb(75, 192, 192)",
        shot: "rgb(255, 99, 132)",
        basic: "rgb(54, 162, 235)",
        standard: "rgb(255, 206, 86)",
        premium: "rgb(153, 102, 255)",
        wide: "rgb(255, 159, 64)",
        special: "rgb(201, 203, 207)",
    };

    // 더미 데이터 (월별 가입/탈퇴자 수)
    const dummyData = {
        sign: {
            free: [45, 52, 48, 55, 61, 58, 65, 70, 68, 75, 82, 88],
            shot: [12, 15, 18, 22, 19, 25, 28, 24, 30, 27, 33, 35],
            basic: [32, 38, 42, 45, 48, 52, 55, 58, 62, 65, 68, 72],
            standard: [28, 32, 35, 38, 42, 45, 48, 52, 55, 58, 62, 65],
            premium: [18, 22, 25, 28, 32, 35, 38, 42, 45, 48, 52, 55],
            wide: [15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48, 52],
            special: [8, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45],
        },
        cancel: {
            free: [15, 18, 16, 20, 22, 19, 24, 26, 23, 28, 30, 27],
            shot: [8, 10, 9, 12, 11, 14, 13, 15, 16, 14, 18, 17],
            basic: [10, 12, 14, 13, 16, 15, 18, 17, 20, 19, 22, 21],
            standard: [8, 10, 12, 11, 14, 13, 16, 15, 18, 17, 20, 19],
            premium: [5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            wide: [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            special: [2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
    };

    // 차트 데이터 가져오기
    const fetchChartData = () => {
        // 여기에 실제 API 호출을 추가하세요
        // const response = await axios.get(`/api/admin/plan-statistics`, {
        //     params: { plan: selectedPlan, month: selectedMonth, type: setSelectedType }
        // });

        const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
        
        if (selectedPlan === "all") {
            // 전체 플랜 - 원형 그래프용 데이터 (선택된 월의 가입자 데이터)
            const monthData = Object.keys(planNames).map((planKey) => 
                dummyData.sign[planKey][selectedMonth]
            );

            setChartData({
                labels: Object.values(planNames),
                datasets: [{
                    data: monthData,
                    backgroundColor: Object.values(planColors),
                    borderColor: Object.values(planColors).map(color => color),
                    borderWidth: 1,
                }],
            });
        } else {
            // 특정 플랜 선택 - 선형 그래프 (가입/탈퇴 데이터)
            setChartData({
                labels: months,
                datasets: [
                    {
                        label: `${planNames[selectedPlan]} - 가입`,
                        data: dummyData.sign[selectedPlan],
                        borderColor: planColors[selectedPlan],
                        backgroundColor: planColors[selectedPlan] + "33",
                        tension: 0.3,
                        fill: true,
                    },
                    {
                        label: `${planNames[selectedPlan]} - 탈퇴`,
                        data: dummyData.cancel[selectedPlan],
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        tension: 0.3,
                        fill: true,
                        borderDash: [5, 5],
                    },
                ],
            });
        }
    };

    // 선택값 변경 시 자동 업데이트
    useEffect(() => {
        if (chartData !== null) {
            fetchChartData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPlan, selectedMonth]);

    // 컴포넌트 마운트 시 초기 데이터 로드
    useEffect(() => {
        fetchChartData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 차트 옵션
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `${planNames[selectedPlan]} 월별 가입자 추이`,
                font: {
                    size: 18,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right",
            },
            title: {
                display: true,
                text: `${["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"][selectedMonth]} 플랜별 가입자 분포`,
                font: {
                    size: 18,
                },
            },
        },
    };

    // 테이블 데이터 생성
    const getTableData = () => {
        if (selectedPlan !== "all") return [];
        
        return Object.keys(planNames).map((planKey) => ({
            plan: planNames[planKey],
            count: dummyData.sign[planKey][selectedMonth],
            color: planColors[planKey],
        }));
    };

    return (
        <div className="adminplan-container">
            <div className="adminplan-wrap">
                <div className="adminplan-filter-wrap">
                    <select
                        name="plan"
                        id="plan"
                        className="adminplan-select"
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                    >
                        <option value="all">전체 플랜</option>
                        <option value="free">무료 플랜</option>
                        <option value="shot">단회 플랜</option>
                        <option value="basic">베이직 플랜</option>
                        <option value="standard">스탠다드 플랜</option>
                        <option value="premium">프리미엄 플랜</option>
                        <option value="wide">와이드 플랜</option>
                        <option value="special">스페셜 플랜</option>
                    </select>

                    {selectedPlan === "all" ? (
                        <select
                            name="month"
                            id="month"
                            className="adminplan-select-month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        >
                            <option value={0}>1월</option>
                            <option value={1}>2월</option>
                            <option value={2}>3월</option>
                            <option value={3}>4월</option>
                            <option value={4}>5월</option>
                            <option value={5}>6월</option>
                            <option value={6}>7월</option>
                            <option value={7}>8월</option>
                            <option value={8}>9월</option>
                            <option value={9}>10월</option>
                            <option value={10}>11월</option>
                            <option value={11}>12월</option>
                        </select>
                    ) : (
                        <div></div>
                    )}
                </div>

                {selectedPlan === "all" ? (
                    <div className="adminplan-content-wrap">
                        <div className="adminplan-graph-pie">
                            {chartData && <Pie data={chartData} options={pieOptions} />}
                        </div>
                        <div className="adminplan-table">
                            <h3>플랜별 가입자 수</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>플랜</th>
                                        <th>가입자 수</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getTableData().map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <span 
                                                    className="plan-color-dot" 
                                                    style={{ backgroundColor: item.color }}
                                                ></span>
                                                {item.plan}
                                            </td>
                                            <td>{item.count}명</td>
                                        </tr>
                                    ))}
                                    <tr className="total-row">
                                        <td><strong>총합</strong></td>
                                        <td><strong>{getTableData().reduce((sum, item) => sum + item.count, 0)}명</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="adminplan-graph-line">
                        {chartData && <Line data={chartData} options={lineOptions} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPlan;