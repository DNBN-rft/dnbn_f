import { useState, useEffect } from "react";
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
import { apiGet } from "../../utils/apiClient";
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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiGet('/admin/dashboard');
        setDashboardData(await response.json());
        setError(null);
      } catch (err) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
        console.log('대시보드 데이터:', dashboardData);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="adminmain-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="adminmain-container">에러: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="adminmain-container">데이터가 없습니다.</div>;
  }
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
              <p className="adminmain-card-value">{(dashboardData.totalStore || 0).toLocaleString()}<span className="adminmain-card-unit">개</span></p>
              <p className="adminmain-card-sub">신규 <span className="adminmain-highlight">+{dashboardData.newStore || 0}</span></p>
            </div>
          </div>

          <div className="adminmain-stat-card adminmain-card-success">
            <div className="adminmain-card-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <div className="adminmain-card-content">
              <h3 className="adminmain-card-title">일반 사용자</h3>
              <p className="adminmain-card-value">{(dashboardData.totalCust || 0).toLocaleString()}<span className="adminmain-card-unit">명</span></p>
              <p className="adminmain-card-sub">신규 <span className="adminmain-highlight">+{dashboardData.newCust || 0}</span></p>
            </div>
          </div>

          <div className="adminmain-stat-card adminmain-card-warning">
            <div className="adminmain-card-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="adminmain-card-content">
              <h3 className="adminmain-card-title">신고 현황</h3>
              <p className="adminmain-card-value">{dashboardData.totalReport || 0}<span className="adminmain-card-unit">건</span></p>
              <p className="adminmain-card-sub">미처리 <span className="adminmain-highlight-warning">{dashboardData.pendingReport || 0}건</span></p>
            </div>
          </div>

          <div className="adminmain-stat-card adminmain-card-info">
            <div className="adminmain-card-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="adminmain-card-content">
              <h3 className="adminmain-card-title">최고 매출 지역</h3>
              <p className="adminmain-card-value">{dashboardData.state || '-'} {dashboardData.district || '-'}</p>
              <p className="adminmain-card-sub">총액 <span className="adminmain-highlight">₩{(dashboardData.topDistrictPrice || 0).toLocaleString()}</span></p>
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
                <span className="adminmain-settlement-value adminmain-amount-large">
                  ₩{dashboardData.pendingLists && dashboardData.pendingLists.length > 0 
                    ? dashboardData.pendingLists.reduce((sum, item) => sum + (item.pendingPayout || 0), 0).toLocaleString()
                    : '0'}
                </span>
              </div>
              <div className="adminmain-settlement-divider"></div>
              <div className="adminmain-settlement-item">
                <span className="adminmain-settlement-label">정산 예정일</span>
                <span className="adminmain-settlement-value">
                  {dashboardData.pendingLists?.[dashboardData.pendingLists.length - 1]?.payoutDate 
                    ? (() => {
                        const date = new Date(dashboardData.pendingLists[dashboardData.pendingLists.length - 1].payoutDate);
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        return `${year}년 ${month}월 ${day}일`;
                      })()
                    : '-'}
                </span>
              </div>
            </div>
            <div className="adminmain-settlement-graph">
              <div className="adminmain-bar-chart">
                {(dashboardData.pendingLists && dashboardData.pendingLists.length > 0 
                  ? dashboardData.pendingLists 
                  : [{weekNumber: 1, acceptPayout: 0}, {weekNumber: 2, acceptPayout: 0}, {weekNumber: 3, acceptPayout: 0}, {weekNumber: 4, acceptPayout: 0}]
                ).map((pending, index) => {
                  const dataList = dashboardData.pendingLists && dashboardData.pendingLists.length > 0 ? dashboardData.pendingLists : [{acceptPayout: 0}];
                  const maxPayout = Math.max(...dataList.map(p => p.acceptPayout || 0));
                  const height = maxPayout > 0 ? ((pending.acceptPayout || 0) / maxPayout * 100) : 0;
                  return (
                    <div key={index} className="adminmain-bar" style={{height: `${height}%`}} data-amount={`₩${(pending.acceptPayout || 0).toLocaleString()}`}>
                      <span className="adminmain-bar-tooltip">₩{(pending.acceptPayout || 0).toLocaleString()}</span>
                      <span className="adminmain-bar-label">{pending.weekNumber}주차</span>
                    </div>
                  );
                })}
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
                <span className="adminmain-rank-store">{dashboardData.firstStore || '-'}</span>
                <span className="adminmain-rank-sales">{dashboardData.firstStore ? `₩${(dashboardData.firstStorePrice || 0).toLocaleString()}` : '-'}</span>
              </div>
              <div className="adminmain-ranking-item adminmain-rank-2">
                <span className="adminmain-rank-number">2</span>
                <span className="adminmain-rank-store">{dashboardData.secondStore || '-'}</span>
                <span className="adminmain-rank-sales">{dashboardData.secondStore ? `₩${(dashboardData.secondStorePrice || 0).toLocaleString()}` : '-'}</span>
              </div>
              <div className="adminmain-ranking-item adminmain-rank-3">
                <span className="adminmain-rank-number">3</span>
                <span className="adminmain-rank-store">{dashboardData.thirdStore || '-'}</span>
                <span className="adminmain-rank-sales">{dashboardData.thirdStore ? `₩${(dashboardData.thirdStorePrice || 0).toLocaleString()}` : '-'}</span>
              </div>
              <div className="adminmain-ranking-item">
                <span className="adminmain-rank-number">4</span>
                <span className="adminmain-rank-store">{dashboardData.fourthStore || '-'}</span>
                <span className="adminmain-rank-sales">{dashboardData.fourthStore ? `₩${(dashboardData.fourthStorePrice || 0).toLocaleString()}` : '-'}</span>
              </div>
              <div className="adminmain-ranking-item">
                <span className="adminmain-rank-number">5</span>
                <span className="adminmain-rank-store">{dashboardData.fifthStore || '-'}</span>
                <span className="adminmain-rank-sales">{dashboardData.fifthStore ? `₩${(dashboardData.fifthStorePrice || 0).toLocaleString()}` : '-'}</span>
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
                    <div className="adminmain-progress-fill adminmain-progress-store" style={{width: `${dashboardData.leaveStore || 0}%`}}></div>
                  </div>
                  <span className="adminmain-progress-value">{dashboardData.leaveStore || 0}% ({dashboardData.leaveStoreCount || 0}개)</span>
                </div>
              </div>
              <div className="adminmain-churn-item">
                <div className="adminmain-churn-label">
                  <i className="fas fa-user"></i> 사용자 이탈률
                </div>
                <div className="adminmain-progress-container">
                  <div className="adminmain-progress-bar">
                    <div className="adminmain-progress-fill adminmain-progress-user" style={{width: `${dashboardData.leaveCust || 0}%`}}></div>
                  </div>
                  <span className="adminmain-progress-value">{dashboardData.leaveCust || 0}% ({dashboardData.leaveCustCount || 0}명)</span>
                </div>
              </div>
            </div>
            <div className="adminmain-churn-chart">
              {/* 가맹점 활성 유지율 */}
              <div className="adminmain-donut-wrapper">
                <div 
                  className="adminmain-donut-chart"
                  title={`활성 가맹점 수: ${dashboardData.activeStoreCount || 0}개`}
                  style={{
                    background: `conic-gradient(
                      rgba(241, 129, 30, 1) 0deg ${dashboardData.activeStoreDegree || 0}deg,
                      #e2e8f0 ${dashboardData.activeStoreDegree || 0}deg 360deg
                    )`
                  }}
                >
                  <div className="adminmain-donut-center">
                    <span className="adminmain-donut-value">{dashboardData.activeStorePercent || 0}%</span>
                    <span className="adminmain-donut-label">가맹점</span>
                    <span className="adminmain-donut-label">활성 유지율</span>
                  </div>
                </div>
              </div>
              {/* 사용자 활성 유지율 */}
              <div className="adminmain-donut-wrapper">
                <div 
                  className="adminmain-donut-chart"
                  title={`활성 사용자 수: ${dashboardData.activeCustCount || 0}명`}
                  style={{
                    background: `conic-gradient(
                      rgba(59, 130, 246, 1) 0deg ${dashboardData.activeCustDegree || 0}deg,
                      #e2e8f0 ${dashboardData.activeCustDegree || 0}deg 360deg
                    )`
                  }}
                >
                  <div className="adminmain-donut-center">
                    <span className="adminmain-donut-value" style={{color: 'rgba(59, 130, 246, 1)'}}>{dashboardData.activeCustPercent || 0}%</span>
                    <span className="adminmain-donut-label">사용자</span>
                    <span className="adminmain-donut-label">활성 유지율</span>
                  </div>
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
                    labels: dashboardData.planIncomeLists ? dashboardData.planIncomeLists.map(item => `${item.month || 0}월`) : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    datasets: [
                      {
                        label: '월별 수익',
                        data: dashboardData.planIncomeLists ? dashboardData.planIncomeLists.map(item => item.monthIncome || 0) : [],
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
                  <span className="adminmain-profit-value adminmain-profit-value-large">
                    ₩{dashboardData.planIncomeLists && dashboardData.planIncomeLists.length > 0 
                      ? (dashboardData.planIncomeLists[dashboardData.planIncomeLists.length - 1].monthIncome || 0).toLocaleString() 
                      : '0'}
                  </span>
                </div>
                <div className="adminmain-profit-divider"></div>
                <div className="adminmain-profit-item">
                  <div className="adminmain-profit-plan-header">
                    <span className="adminmain-profit-plan-dot adminmain-dot-basic"></span>
                    <span className="adminmain-profit-label">베이직 플랜</span>
                  </div>
                  <span className="adminmain-profit-value adminmain-profit-basic">
                    ₩{dashboardData.planIncomeLists && dashboardData.planIncomeLists.length > 0 
                      ? (dashboardData.planIncomeLists[dashboardData.planIncomeLists.length - 1].basicIncome || 0).toLocaleString() 
                      : '0'}
                  </span>
                </div>
                <div className="adminmain-profit-item">
                  <div className="adminmain-profit-plan-header">
                    <span className="adminmain-profit-plan-dot adminmain-dot-pro"></span>
                    <span className="adminmain-profit-label">스탠다드 플랜</span>
                  </div>
                  <span className="adminmain-profit-value adminmain-profit-pro">
                    ₩{dashboardData.planIncomeLists && dashboardData.planIncomeLists.length > 0 
                      ? (dashboardData.planIncomeLists[dashboardData.planIncomeLists.length - 1].standardIncome || 0).toLocaleString() 
                      : '0'}
                  </span>
                </div>
                <div className="adminmain-profit-item">
                  <div className="adminmain-profit-plan-header">
                    <span className="adminmain-profit-plan-dot adminmain-dot-premium"></span>
                    <span className="adminmain-profit-label">프리미엄 플랜</span>
                  </div>
                  <span className="adminmain-profit-value adminmain-profit-premium">
                    ₩{dashboardData.planIncomeLists && dashboardData.planIncomeLists.length > 0 
                      ? (dashboardData.planIncomeLists[dashboardData.planIncomeLists.length - 1].premiumIncome || 0).toLocaleString() 
                      : '0'}
                  </span>
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
