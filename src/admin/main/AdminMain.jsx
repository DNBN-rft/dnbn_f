import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./css/adminmain.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminMain = () => {
  return (
    <div className="adminmain-container">
      <div className="adminmain-header">
        <h1 className="adminmain-title">관리자 대시보드</h1>
        <p className="adminmain-subtitle">실시간 통계 및 현황</p>
      </div>

      <div className="adminmain-wrap">
        {/* 주요 통계 카드 */}
        <div className="adminmain-stats-grid">
          <div className="adminmain-stat-card adminmain-card-primary">
            <div className="adminmain-card-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="adminmain-card-content">
              <h3 className="adminmain-card-title">총 가맹점</h3>
              <p className="adminmain-card-value">1,234<span className="adminmain-card-unit">개</span></p>
              <p className="adminmain-card-sub">신규 <span className="adminmain-highlight">+23</span></p>
            </div>
          </div>

          <div className="adminmain-stat-card adminmain-card-success">
            <div className="adminmain-card-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <div className="adminmain-card-content">
              <h3 className="adminmain-card-title">일반 사용자</h3>
              <p className="adminmain-card-value">15,678<span className="adminmain-card-unit">명</span></p>
              <p className="adminmain-card-sub">신규 <span className="adminmain-highlight">+156</span></p>
            </div>
          </div>

          <div className="adminmain-stat-card adminmain-card-warning">
            <div className="adminmain-card-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="adminmain-card-content">
              <h3 className="adminmain-card-title">신고 현황</h3>
              <p className="adminmain-card-value">12<span className="adminmain-card-unit">건</span></p>
              <p className="adminmain-card-sub">미처리 <span className="adminmain-highlight-warning">8건</span></p>
            </div>
          </div>

          <div className="adminmain-stat-card adminmain-card-info">
            <div className="adminmain-card-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="adminmain-card-content">
              <h3 className="adminmain-card-title">최고 매출 지역</h3>
              <p className="adminmain-card-value">강남구</p>
              <p className="adminmain-card-sub">총액 <span className="adminmain-highlight">₩8,234,000</span></p>
            </div>
          </div>
        </div>

        {/* 정산 정보 */}
        <div className="adminmain-settlement-section">
          <div className="adminmain-section-card">
            <div className="adminmain-section-header">
              <h2 className="adminmain-section-title">
                <i className="fas fa-wallet"></i> 정산 현황
              </h2>
            </div>
            <div className="adminmain-settlement-content">
              <div className="adminmain-settlement-item">
                <span className="adminmain-settlement-label">정산 대기 금액</span>
                <span className="adminmain-settlement-value adminmain-amount-large">₩12,345,000</span>
              </div>
              <div className="adminmain-settlement-divider"></div>
              <div className="adminmain-settlement-item">
                <span className="adminmain-settlement-label">정산 예정일</span>
                <span className="adminmain-settlement-value">2025년 11월 30일</span>
              </div>
            </div>
            <div className="adminmain-settlement-graph">
              <div className="adminmain-bar-chart">
                <div className="adminmain-bar" style={{height: '60%'}} data-amount="₩2,500,000">
                  <span className="adminmain-bar-tooltip">₩2,500,000</span>
                  <span className="adminmain-bar-label">1주차</span>
                </div>
                <div className="adminmain-bar" style={{height: '75%'}} data-amount="₩3,100,000">
                  <span className="adminmain-bar-tooltip">₩3,100,000</span>
                  <span className="adminmain-bar-label">2주차</span>
                </div>
                <div className="adminmain-bar" style={{height: '85%'}} data-amount="₩3,500,000">
                  <span className="adminmain-bar-tooltip">₩3,500,000</span>
                  <span className="adminmain-bar-label">3주차</span>
                </div>
                <div className="adminmain-bar" style={{height: '95%'}} data-amount="₩4,000,000">
                  <span className="adminmain-bar-tooltip">₩4,000,000</span>
                  <span className="adminmain-bar-label">4주차</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 가맹점 순위 & 이탈률 */}
        <div className="adminmain-two-column">
          <div className="adminmain-section-card adminmain-ranking-card">
            <div className="adminmain-section-header">
              <h2 className="adminmain-section-title">
                <i className="fas fa-trophy"></i> 가맹점 매출 TOP 5
              </h2>
            </div>
            <div className="adminmain-ranking-list">
              <div className="adminmain-ranking-item adminmain-rank-1">
                <span className="adminmain-rank-number">1</span>
                <span className="adminmain-rank-store">동네반찬 강남점</span>
                <span className="adminmain-rank-sales">₩2,340,000</span>
              </div>
              <div className="adminmain-ranking-item adminmain-rank-2">
                <span className="adminmain-rank-number">2</span>
                <span className="adminmain-rank-store">맛있는 반찬가게</span>
                <span className="adminmain-rank-sales">₩1,890,000</span>
              </div>
              <div className="adminmain-ranking-item adminmain-rank-3">
                <span className="adminmain-rank-number">3</span>
                <span className="adminmain-rank-store">신선한 식재료</span>
                <span className="adminmain-rank-sales">₩1,650,000</span>
              </div>
              <div className="adminmain-ranking-item">
                <span className="adminmain-rank-number">4</span>
                <span className="adminmain-rank-store">건강반찬 서초점</span>
                <span className="adminmain-rank-sales">₩1,420,000</span>
              </div>
              <div className="adminmain-ranking-item">
                <span className="adminmain-rank-number">5</span>
                <span className="adminmain-rank-store">엄마손반찬</span>
                <span className="adminmain-rank-sales">₩1,280,000</span>
              </div>
            </div>
          </div>

          <div className="adminmain-section-card adminmain-churn-card">
            <div className="adminmain-section-header">
              <h2 className="adminmain-section-title">
                <i className="fas fa-chart-line"></i> 이번 달 이탈률
              </h2>
            </div>
            <div className="adminmain-churn-content">
              <div className="adminmain-churn-item">
                <div className="adminmain-churn-label">
                  <i className="fas fa-store"></i> 가맹점 이탈률
                </div>
                <div className="adminmain-progress-container">
                  <div className="adminmain-progress-bar">
                    <div className="adminmain-progress-fill adminmain-progress-store" style={{width: '3.2%'}}></div>
                  </div>
                  <span className="adminmain-progress-value">3.2%</span>
                </div>
              </div>
              <div className="adminmain-churn-item">
                <div className="adminmain-churn-label">
                  <i className="fas fa-user"></i> 사용자 이탈률
                </div>
                <div className="adminmain-progress-container">
                  <div className="adminmain-progress-bar">
                    <div className="adminmain-progress-fill adminmain-progress-user" style={{width: '5.8%'}}></div>
                  </div>
                  <span className="adminmain-progress-value">5.8%</span>
                </div>
              </div>
            </div>
            <div className="adminmain-churn-chart">
              <div className="adminmain-donut-chart">
                <div className="adminmain-donut-segment adminmain-donut-active"></div>
                <div className="adminmain-donut-center">
                  <span className="adminmain-donut-value">94.2%</span>
                  <span className="adminmain-donut-label">활성 유지율</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 플랫폼 수익 */}
        <div className="adminmain-profit-section">
          <div className="adminmain-section-card">
            <div className="adminmain-section-header">
              <h2 className="adminmain-section-title">
                <i className="fas fa-chart-bar"></i> 플랫폼 수익 (구독 플랜)
              </h2>
            </div>
            <div className="adminmain-profit-container">
              {/* 좌측: 그래프 */}
              <div className="adminmain-profit-chart">
                <Line
                  data={{
                    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    datasets: [
                      {
                        label: '월별 수익',
                        data: [3200000, 3500000, 3800000, 4100000, 4300000, 4200000, 4400000, 4600000, 4500000, 4700000, 4567000, 0],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return '₩' + context.parsed.y.toLocaleString();
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₩' + value.toLocaleString() + '원';
                          },
                        },
                        grid: {
                          color: '#f1f5f9',
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </div>
              {/* 우측: 수익 통계 */}
              <div className="adminmain-profit-summary">
                <div className="adminmain-profit-item adminmain-profit-total">
                  <span className="adminmain-profit-label">이번 달 총 수익</span>
                  <span className="adminmain-profit-value adminmain-profit-value-large">₩4,567,000</span>
                </div>
                <div className="adminmain-profit-divider"></div>
                <div className="adminmain-profit-item">
                  <div className="adminmain-profit-plan-header">
                    <span className="adminmain-profit-plan-dot adminmain-dot-basic"></span>
                    <span className="adminmain-profit-label">베이직 플랜</span>
                  </div>
                  <span className="adminmain-profit-value adminmain-profit-basic">₩1,200,000</span>
                </div>
                <div className="adminmain-profit-item">
                  <div className="adminmain-profit-plan-header">
                    <span className="adminmain-profit-plan-dot adminmain-dot-pro"></span>
                    <span className="adminmain-profit-label">프로 플랜</span>
                  </div>
                  <span className="adminmain-profit-value adminmain-profit-pro">₩2,100,000</span>
                </div>
                <div className="adminmain-profit-item">
                  <div className="adminmain-profit-plan-header">
                    <span className="adminmain-profit-plan-dot adminmain-dot-premium"></span>
                    <span className="adminmain-profit-label">프리미엄 플랜</span>
                  </div>
                  <span className="adminmain-profit-value adminmain-profit-premium">₩1,267,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
