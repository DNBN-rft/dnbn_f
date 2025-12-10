import { ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/membership.css';
import { useEffect, useState } from 'react';
import { apiGet } from '../../utils/apiClient';

const Membership = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let userInfo = localStorage.getItem('user');
        const storeCode = JSON.parse(userInfo).storeCode;

        const response = await apiGet(`/store/dashboard/${storeCode}`);
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          setError('대시보드 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('대시보드 조회 실패:', err);
        setError('대시보드 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 로딩 중일 때
  if (loading) {
    return <div className="membership-wrap">로딩 중...</div>;
  }

  // 에러 발생 시
  if (error) {
    return <div className="membership-wrap">{error}</div>;
  }

  // 데이터가 없을 때
  if (!dashboardData) {
    return <div className="membership-wrap">대시보드 정보가 없습니다.</div>;
  }

  const { planNm, nextBillingDate, membershipPlanFuncList, membershipPaymentList } = dashboardData;

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 기능 정렬 및 병합 처리
  const processedFunctions = () => {
    if (!membershipPlanFuncList) return [];

    const functionMap = {};
    let specialTimeCombined = null;

    // 데이터를 먼저 맵으로 변환
    membershipPlanFuncList.forEach(func => {
      if (func.funcNm === '특가 등록 시간' || func.funcNm === '네고 등록 시간') {
        // 특가/네고 등록 시간 병합 (24시간만 표기)
        if (!specialTimeCombined) {
          specialTimeCombined = {
            funcNm: '특가/네고 등록 시간',
            usageLimit: 24,
            usageUnit: '시간'
          };
        }
      } else {
        functionMap[func.funcNm] = func;
      }
    });

    // 정렬 순서 정의
    const order = ['상품 등록', '특가 등록 횟수', '네고 등록 횟수', '특가/네고 등록 시간', '상품 노출 반경', '요금'];
    const result = [];

    order.forEach(name => {
      if (name === '특가/네고 등록 시간' && specialTimeCombined) {
        result.push(specialTimeCombined);
      } else if (functionMap[name]) {
        result.push(functionMap[name]);
      }
    });

    return result;
  };

  // 기능별 표시 내용 렌더링 함수
  const renderFunctionRow = (func) => {
    if (func.funcNm === '상품 등록') {
      return (
        <tr key={func.funcNm}>
          <td>{func.funcNm}</td>
          <td>-</td>
          <td>
            <progress 
              value={1} 
              max={1} 
              className='membership-progress'
            ></progress>
          </td>
          <td>무제한</td>
        </tr>
      );
    } else if (func.funcNm === '특가/네고 등록 시간' || func.funcNm === '상품 노출 반경' || func.funcNm === '요금') {
      return (
        <tr key={func.funcNm}>
          <td>{func.funcNm}</td>
          <td colSpan={3}>{func.usageLimit}{func.usageUnit}</td>
        </tr>
      );
    } else {
      // 특가 등록 횟수, 네고 등록 횟수 등 진행률 표시
      return (
        <tr key={func.funcNm}>
          <td>{func.funcNm}</td>
          <td>-</td>
          <td>
            <progress 
              value={0} 
              max={func.usageLimit} 
              className='membership-progress'
            ></progress>
          </td>
          <td>0/{func.usageLimit}{func.usageUnit}</td>
        </tr>
      );
    }
  };

  return (
    <div className='membership-wrap'>
      <div className="membership-header">
        <div className="membership-title">대시보드</div>
      </div>

      <div className='membership-info'>
        <div className='membership-cust-info'>현재 회원님은 <span className='membership-plan-info'>{planNm}</span>을 이용중입니다.</div>
        <div className='membership-group'>
          <div className='membership-cycle-info'>다음 결제일: <span className='membership-date-info'>{nextBillingDate ? formatDate(nextBillingDate) : "무료 체험중(베타 프로모션 기간)"}</span></div>
          <div className='membership-shift-btn-group'>
            <button onClick={() => navigate('/store/membership-change')}>멤버쉽 변경</button>
          </div>
        </div>
      </div>

      <div className='membership-usage-info'>
        <div className='membership-usage-title'>내 플랜 정보</div>
        
        <table className='membership-usage-table'>
          <thead>
            <tr>
              <th>서비스 구분</th>
              <th colSpan={3}>한도</th>
            </tr>
          </thead>
          
          <tbody>
            {processedFunctions().map((func) => 
              renderFunctionRow(func)
            )}
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
            {membershipPaymentList && membershipPaymentList.length > 0 ? (
              membershipPaymentList.map((payment, index) => (
                <tr key={index}>
                  <td>{formatDate(payment.membershipStartDate)} ~ {formatDate(payment.membershipEndDate)}</td>
                  <td>{payment.membershipNm}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>₩{payment.paymentPrice.toLocaleString()}</td>
                  <td>{formatDate(payment.paymentDateTime)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{textAlign: 'center'}}>결제 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Membership;