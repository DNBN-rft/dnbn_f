import { useState } from "react";
import { apiCall } from "../../utils/apiClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import "./css/orderstatic.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrderStatic = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [staticData, setStaticData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateType, setDateType] = useState("");

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환 (로컬 타임존)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleRecentDateClick = (type) => {
    const today = new Date();
    let startDate, endDate;

    if (type === "today") {
      // 오늘
      startDate = new Date(today);
      endDate = new Date(today);
    } else if (type === "week") {
      // 이번 주 (월요일 시작, 일요일 끝)
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 일요일이면 -6, 아니면 1-요일
      startDate = new Date(today);
      startDate.setDate(today.getDate() + diff);
      
      // 이번 주 일요일
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (type === "month") {
      // 이번 달 1일부터 말일까지
      const year = today.getFullYear();
      const month = today.getMonth();
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
    }

    setStartDate(formatDate(startDate));
    setEndDate(formatDate(endDate));
    setDateType(type);
  };

  const handleRecentDateClickWrapper = (e) => {
    const { name } = e.target;
    handleRecentDateClick(name);
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert("시작 날짜와 종료 날짜를 모두 선택해주세요.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
      return;
    }

    try {
      setLoading(true);
      
      // localStorage에서 storeCode 가져오기
      const userInfo = localStorage.getItem("user");
      if (!userInfo) {
        alert("로그인 정보가 없습니다.");
        return;
      }
      
      const storeCode = JSON.parse(userInfo).storeCode;
      
      const requestBody = {
        startDate: startDate,
        endDate: endDate
      };
      
      console.log("API 요청:", {
        url: `/order/static/${storeCode}`,
        body: requestBody
      });
      
      // API 호출
      const response = await apiCall(`/order/statistics/${storeCode}`, {
        method: "POST",
        body: JSON.stringify(requestBody)
      });

      // JSON 파싱
      const data = await response.json();
      
      setStaticData(data);
      console.log("매출 통계 데이터:", data);
    } catch (error) {
      console.error("매출 통계 조회 실패:", error);
      console.error("에러 상세:", error);
      alert("매출 통계 조회에 실패했습니다. 콘솔을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcelDownload = async () => {
    if (!startDate || !endDate) {
      alert("시작 날짜와 종료 날짜를 모두 선택해주세요.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
      return;
    }

    if (!staticData) {
      alert("먼저 조회 버튼을 눌러 데이터를 조회해주세요.");
      return;
    }

    try {
      // localStorage에서 storeCode 가져오기
      const userInfo = localStorage.getItem("user");
      if (!userInfo) {
        alert("로그인 정보가 없습니다.");
        return;
      }
      
      const storeCode = JSON.parse(userInfo).storeCode;
      
      const requestBody = {
        startDate: startDate,
        endDate: endDate
      };
      
      // 엑셀 다운로드 API 호출 - fetch 직접 사용
      const response = await fetch(`http://localhost:8080/api/order/statistics/${storeCode}/excel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Blob으로 변환
      const blob = await response.blob();
      
      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `매출통계_${startDate}_${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      // 정리
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      console.log("엑셀 다운로드 완료");
    } catch (error) {
      console.error("엑셀 다운로드 실패:", error);
      alert("엑셀 다운로드에 실패했습니다.");
    }
  };

  return (
    <div className="orderlist-wrap">
      <div className="orderlist-header">
        <div className="orderlist-header-title">매출통계</div>
        <div className="orderstatic-header-right">
          <button
            type="button"
            className="orderstatic-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "조회 중..." : "조회"}
          </button>
          <button 
            type="button"
            className="orderlist-header-excel"
            onClick={handleExcelDownload}
            disabled={!staticData}
          >
            엑셀 다운로드
          </button>
        </div>
      </div>

      <div className="orderlist-filter">
        <div className="orderlist-date-range">
          <div className="orderlist-date-range-inner">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="orderlist-date-input"
            />
            <span className="orderlist-date-sep">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="orderlist-date-input"
            />
          </div>
          <div className="orderlist-recent-btn-group">
            <button
              type="button"
              className="orderlist-recent-btn"
              name="today"
              onClick={handleRecentDateClickWrapper}
            >
              일간
            </button>
            <button
              type="button"
              className="orderlist-recent-btn"
              name="week"
              onClick={handleRecentDateClickWrapper}
            >
              주간
            </button>
            <button
              type="button"
              className="orderlist-recent-btn"
              name="month"
              onClick={handleRecentDateClickWrapper}
            >
              월간
            </button>
          </div>
        </div>
      </div>

      <div className="orderlist-info">
        <div className="orderlist-info1">
          <div className="orderlist-info-title">총 판매량</div>
          <div className="orderlist-info-value">
            {staticData ? `${(staticData.total || 0).toLocaleString()}개` : "-"}
          </div>
        </div>
        <div className="orderlist-info2">
          <div className="orderlist-info-title">총 매출액</div>
          <div className="orderlist-info-value">
            {staticData ? `${(staticData.orderPrice || 0).toLocaleString()}원` : "-"}
          </div>
        </div>
        <div className="orderlist-info3">
          <div className="orderlist-info-title">총 주문수</div>
          <div className="orderlist-info-value">
            {staticData ? `${(staticData.orderCount || 0).toLocaleString()}개` : "-"}
          </div>
        </div>
        <div className="orderlist-info4">
          <div className="orderlist-info-title">평균 주문액</div>
          <div className="orderlist-info-value">
            {staticData ? `${(staticData.average || 0).toLocaleString()}원` : "-"}
          </div>
        </div>
      </div>

      <div className="orderlist-info-detail">
        <div className="orderlist-info-detail-left">
          <div className="orderlist-info-detail-title">인기 상품 TOP 3</div>

          {staticData ? (
            <>
              {staticData.topProductNm && (
                <div className="orderlist-info-detail-rank">
                  <div className="orderlist-rank-detail">
                    <div className="rank">1</div>
                    <div className="orderlist-product-detail">
                      <div className="product-name">{staticData.topProductNm}</div>
                      <div className="product-sale">{staticData.topProductAmount || 0}개 판매</div>
                    </div>
                  </div>
                  <div className="product-price">{(staticData.topProductTotal || 0).toLocaleString()}원</div>
                </div>
              )}
              {staticData.secondProductNm && (
                <div className="orderlist-info-detail-rank">
                  <div className="orderlist-rank-detail">
                    <div className="rank">2</div>
                    <div className="orderlist-product-detail">
                      <div className="product-name">{staticData.secondProductNm}</div>
                      <div className="product-sale">{staticData.secondProductAmount || 0}개 판매</div>
                    </div>
                  </div>
                  <div className="product-price">{(staticData.secondProductTotal || 0).toLocaleString()}원</div>
                </div>
              )}
              {staticData.thirdProductNm && (
                <div className="orderlist-info-detail-rank">
                  <div className="orderlist-rank-detail">
                    <div className="rank">3</div>
                    <div className="orderlist-product-detail">
                      <div className="product-name">{staticData.thirdProductNm}</div>
                      <div className="product-sale">{staticData.thirdProductAmount || 0}개 판매</div>
                    </div>
                  </div>
                  <div className="product-price">{(staticData.thirdProductTotal || 0).toLocaleString()}원</div>
                </div>
              )}
            </>
          ) : (
            <div>조회 버튼을 눌러 데이터를 확인하세요.</div>
          )}
        </div>

        <div className="orderlist-info-detail-right">
          <div className="orderlist-info-detail-title">카테고리별 매출</div>

          {staticData ? (
            <>
              {staticData.topCategoryNm && (
                <>
                  <div className="orderlist-info-detail-rank">
                    <div>{staticData.topCategoryNm}</div>
                    <div>{(staticData.topCategoryTotal || 0).toLocaleString()}원</div>
                  </div>
                  <div className="orderlist-info-detail-right-bar">
                    <div className="orderlist-info-detail-right-bg">
                      <div
                        className="orderlist-info-detail-right-color"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
              {staticData.secondCategoryNm && (
                <>
                  <div className="orderlist-info-detail-rank">
                    <div>{staticData.secondCategoryNm}</div>
                    <div>{(staticData.secondCategoryTotal || 0).toLocaleString()}원</div>
                  </div>
                  <div className="orderlist-info-detail-right-bar">
                    <div className="orderlist-info-detail-right-bg">
                      <div
                        className="orderlist-info-detail-right-color"
                        style={{ 
                          width: `${(staticData.topCategoryTotal || 0) > 0 
                            ? ((staticData.secondCategoryTotal || 0) / (staticData.topCategoryTotal || 1) * 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
              {staticData.thirdCategoryNm && (
                <>
                  <div className="orderlist-info-detail-rank">
                    <div>{staticData.thirdCategoryNm}</div>
                    <div>{(staticData.thirdCategoryTotal || 0).toLocaleString()}원</div>
                  </div>
                  <div className="orderlist-info-detail-right-bar">
                    <div className="orderlist-info-detail-right-bg">
                      <div
                        className="orderlist-info-detail-right-color"
                        style={{ 
                          width: `${(staticData.topCategoryTotal || 0) > 0 
                            ? ((staticData.thirdCategoryTotal || 0) / (staticData.topCategoryTotal || 1) * 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div>조회 버튼을 눌러 데이터를 확인하세요.</div>
          )}
        </div>
      </div>
      <div className="orderlist-graph">
        <div className="orderlist-info-detail-title">매출 그래프</div>
        <div className="orderlist-graph-detail">
          {staticData && staticData.orderGraph && staticData.orderGraph.length > 0 ? (
            renderChart()
          ) : (
            <div>조회 버튼을 눌러 그래프를 확인하세요.</div>
          )}
        </div>
      </div>
    </div>
  );

  function renderChart() {
    if (!staticData || !staticData.orderGraph) return null;

    const graphData = staticData.orderGraph;

    // 날짜 형식 변환 함수
    const formatChartLabel = (dateStr) => {
      const date = new Date(dateStr);
      if (dateType === "today") {
        return "오늘";
      } else if (dateType === "week") {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[date.getDay()] + '요일';
      } else {
        // 월간은 날짜 표시
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }
    };

    const labels = graphData.map(item => formatChartLabel(item.date));
    const amounts = graphData.map(item => item.amount);
    const totals = graphData.map(item => item.total);

    // 일간 - Bar 차트 (오늘의 판매개수와 판매금액)
    if (dateType === "today") {
      const data = {
        labels: ['판매개수', '판매금액'],
        datasets: [{
          label: '오늘의 매출',
          data: [amounts[0] || 0, (totals[0] || 0) / 10000], // 금액은 만원 단위로
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: '오늘의 매출 현황',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                if (label === '판매금액') {
                  return `판매금액: ${(context.parsed.y * 10000).toLocaleString()}원`;
                }
                return `판매개수: ${context.parsed.y}개`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }
        }
      };

      return (
        <div style={{ height: '400px' }}>
          <Bar data={data} options={options} />
        </div>
      );
    }

    // 주간 - Bar 차트 (금액만 표시, 호버 시 개수와 금액)
    if (dateType === "week") {
      const data = {
        labels: labels,
        datasets: [
          {
            label: '판매금액',
            data: totals,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            amounts: amounts, // 판매개수 데이터를 추가 속성으로 저장
          }
        ]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: '이번 주 매출 현황',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const index = context.dataIndex;
                const amount = context.dataset.amounts[index];
                const total = context.parsed.y;
                return [
                  `판매금액: ${total.toLocaleString()}원`,
                  `판매개수: ${amount.toLocaleString()}개`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '판매금액 (원)'
            },
            ticks: {
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }
        }
      };

      return (
        <div style={{ height: '400px' }}>
          <Bar data={data} options={options} />
        </div>
      );
    }

    // 월간 - Line 차트 (일단위 판매개수와 판매금액)
    if (dateType === "month") {
      const data = {
        labels: labels,
        datasets: [
          {
            label: '판매개수',
            data: amounts,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            yAxisID: 'y',
            tension: 0.1,
          },
          {
            label: '판매금액 (만원)',
            data: totals.map(t => t / 10000),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            yAxisID: 'y1',
            tension: 0.1,
          }
        ]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '이번 달 매출 추이',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label === '판매금액 (만원)') {
                  return `판매금액: ${(context.parsed.y * 10000).toLocaleString()}원`;
                }
                return `${label}: ${context.parsed.y.toLocaleString()}개`;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: '판매개수 (개)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: '판매금액 (만원)'
            }
          },
        }
      };

      return (
        <div style={{ height: '400px' }}>
          <Line data={data} options={options} />
        </div>
      );
    }

    return null;
  }
};
export default OrderStatic;
