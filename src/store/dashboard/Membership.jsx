import { useNavigate } from 'react-router-dom';
import './css/membership.css';

const Membership = () => {
  const navigate = useNavigate();
  // 임시 데이터 (실제로는 API에서 받아와야 함)
  const subscription = {
    subscriptionPlan: {
      subscriptionPlanNm: "Premium Plan"
    },
    nextBillingDate: "" // 빈 문자열이면 무료 체험중으로 표시
  };

  const functionUsageStatistics = [
    {
      functionNm: "할인 등록",
      usagePercent: 30,
      usedAmount: 3,
      usageLimitAmount: 10
    },
    {
      functionNm: "홍보 발송",
      usagePercent: 1/7,
      usedAmount: 1,
      usageLimitAmount: 7
    }
  ];

  return (
    <div className='membership-wrap'>
      <div className="membership-header">
        <div className="membership-title">대시보드</div>
      </div>

      <div className='membership-info'>
        <div className='membership-cust-info'>현재 회원님은 <span className='membership-plan-info'>{subscription.subscriptionPlan.subscriptionPlanNm}</span>을 이용중입니다.</div>
        <div className='membership-group'>
          <div className='membership-cycle-info'>다음 결제일: <span className='membership-date-info'>{subscription.nextBillingDate || "무료 체험중(베타 프로모션 기간)"}</span></div>
          <div className='membership-shift-btn-group'>
            <button onClick={() => navigate('/store/membership-change')}>멤버쉽 변경</button>
          </div>
        </div>
      </div>

      <div className='membership-usage-info'>
        <div className='membership-usage-title'>기능 사용량</div>
        
        <table className='membership-usage-table'>
          <thead>
            <tr>
              <th>서비스 구분</th>
              <th colSpan={3}>한도</th>
            </tr>
          </thead>
          
          <tbody>
            <tr>
              <td>할인 등록</td>
              <td>30%</td>
              <td><progress value={3} max={10} className='membership-progress'></progress></td>
              <td>3/10회</td>
            </tr>

            <tr>
              <td>홍보 발송</td>
              <td>14%</td>
              <td><progress value={1} max={7} className='membership-progress'></progress></td>
              <td>1/7회</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='membership-credit-history'>
        <div className='membership-credit-title'>크레딧 사용 내역<span className='membership-credit-subtitle'>(최근 3개월 내역)</span></div>

        <table className='membership-credit-table'>
          <thead>
            <tr>
              <th>기간</th>
              <th>구독플랜명</th>
              <th>결제방법</th>
              <th>결제금액</th>
              <th>결제일</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>2025.04.12 ~ 2025.05.11</td>
              <td>Premium Plan</td>
              <td>신용카드</td>
              <td>₩10,000</td>
              <td>2025.05.12</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Membership;