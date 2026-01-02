import { Card } from 'react-bootstrap';
import './css/subscription.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiCall } from '../../utils/apiClient';

const SubscriptionPlans = () => {

  const navigate = useNavigate();
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
    const fetchPlanInfo = async () => {
      try {
        const response = await apiCall('/store/planinfo');
        const data = await response.json();
        // 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
        setPlanData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('플랜 정보 조회 실패:', error);
        // 에러 발생 시 빈 배열로 설정
        setPlanData([]);
      }
    };
    
    fetchPlanInfo();
  }, []);

  const getPlanIcon = (planName) => {
    switch (planName) {
    case 'Free':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
          <path d="M232,80V64a8,8,0,0,0-8-8H32a8,8,0,0,0-8,8V80a8,8,0,0,0,8,8H224A8,8,0,0,0,232,80ZM224,96H32a8,8,0,0,0-8,8v88a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V104A8,8,0,0,0,224,96Z" opacity="0.2"></path>
          <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,144H32V64H224V192Z"></path>
        </svg>
      );
    case 'Basic':
    case 'Standard':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"></path>
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,1,1-11.32,11.32L128,149.32l-26.34,26.34a8,8,0,1,1-11.32-11.32L116.68,128,90.34,101.66a8,8,0,1,1,11.32-11.32L128,106.68l26.34-26.34a8,8,0,1,1,11.32,11.32L139.32,128Z"></path>
        </svg>
      );
      case 'Wide Area':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
            <path d="M237.66,153,153,237.66a8,8,0,0,1-11.31,0L42.34,138.34A8,8,0,0,1,40,132.69V40h92.69a8,8,0,0,1,5.65,2.34l99.32,99.32A8,8,0,0,1,237.66,153Z" opacity="0.2"></path>
            <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path>
          </svg>
        );
      case 'Special':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
            <path d="M200,152l-40,40L96,176,40,136,72.68,70.63,128,56l55.32,14.63L183.6,72H144L98.34,116.29a8,8,0,0,0,1.38,12.42C117.23,139.9,141,139.13,160,120Z" opacity="0.2"></path>
            <path d="M254.3,107.91,228.78,56.85a16,16,0,0,0-21.47-7.15L182.44,62.13,130.05,48.27a8.14,8.14,0,0,0-4.1,0L73.56,62.13,48.69,49.7a16,16,0,0,0-21.47,7.15L1.7,107.9a16,16,0,0,0,7.15,21.47l27,13.51,55.49,39.63a8.06,8.06,0,0,0,2.71,1.25l64,16a8,8,0,0,0,7.6-2.1l55.07-55.08,26.42-13.21a16,16,0,0,0,7.15-21.46Zm-54.89,33.37L165,113.72a8,8,0,0,0-10.68.61C136.51,132.27,116.66,130,104,122L147.24,80h31.81l27.21,54.41ZM41.53,64,62,74.22,36.43,125.27,16,115.06Zm116,119.13L99.42,168.61l-49.2-35.14,28-56L128,64.28l9.8,2.59-45,43.68-.08.09a16,16,0,0,0,2.72,24.81c20.56,13.13,45.37,11,64.91-5L188,152.66Zm62-57.87-25.52-51L214.47,64,240,115.06Zm-87.75,92.67a8,8,0,0,1-7.75,6.06,8.13,8.13,0,0,1-1.95-.24L80.41,213.33a7.89,7.89,0,0,1-2.71-1.25L51.35,193.26a8,8,0,0,1,9.3-13l25.11,17.94L126,208.24A8,8,0,0,1,131.82,217.94Z"></path>
          </svg>
        );
      case 'Premium':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
            <path d="M240,104,128,224,80,104l48-64h56Z" opacity="0.2"></path>
            <path d="M246,98.73l-56-64A8,8,0,0,0,184,32H72a8,8,0,0,0-6,2.73l-56,64a8,8,0,0,0,.17,10.73l112,120a8,8,0,0,0,11.7,0l112-120A8,8,0,0,0,246,98.73ZM222.37,96H180L144,48h36.37ZM74.58,112l30.13,75.33L34.41,112Zm89.6,0L128,202.46,91.82,112ZM96,96l32-42.67L160,96Zm85.42,16h40.17l-70.3,75.33ZM75.63,48H112L76,96H33.63Z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  // planData가 배열인지 확인 후 처리
  const freePlan = Array.isArray(planData) && planData.length > 0
    ? (planData.find(plan => plan.planNm === 'Default') || planData[0])
    : null;
  
  const paidPlans = Array.isArray(planData)
    ? planData.filter(plan => plan.planNm !== 'Default')
    : [];

  // 기능 목록을 통합 및 변환하는 함수
  const transformFunctionList = (functionList) => {
    const mergedFunctions = {};
    let specialCountData = null;
    let specialTimeData = null;
    
    functionList.forEach(func => {
      const funcNm = func.funcNm;
      
      // "요금" 항목 처리
      if (funcNm === '요금') {
        if (func.usageLimit === 0) {
          mergedFunctions['요금'] = { funcNm: '요금', usageLimit: '무료', usageUnit: '' };
        } else {
          mergedFunctions['요금'] = func;
        }
      }
      // "특가 등록 횟수" 데이터 저장 (통합용)
      else if (funcNm === '할인 등록 횟수') {
        specialCountData = func;
      }
      // "네고 등록 횟수"는 무시 (특가 등록 횟수만 사용)
      else if (funcNm === '네고 등록 횟수') {
        // 무시
      }
      // "특가 등록 시간" 데이터 저장 (통합용)
      else if (funcNm === '할인 등록 시간') {
        specialTimeData = func;
      }
      // "네고 등록 시간"은 무시 (특가 등록 시간만 사용)
      else if (funcNm === '네고 등록 시간') {
        // 무시
      }
      // 나머지 항목은 그대로 유지
      else {
        mergedFunctions[funcNm] = func;
      }
    });
    
    // 통합된 항목 추가
    if (specialCountData) {
      mergedFunctions['할인/네고 등록 횟수'] = { 
        funcNm: '할인/네고 등록 횟수', 
        usageLimit: specialCountData.usageLimit, 
        usageUnit: specialCountData.usageUnit 
      };
    }
    
    if (specialTimeData) {
      mergedFunctions['할인/네고 등록 시간'] = { 
        funcNm: '할인/네고 등록 시간', 
        usageLimit: specialTimeData.usageLimit, 
        usageUnit: specialTimeData.usageUnit 
      };
    }
    
    // 원하는 순서대로 정렬
    const order = ['상품 등록', '할인/네고 등록 횟수', '할인/네고 등록 시간', '상품 노출 반경', '요금'];
    const sortedFunctions = [];
    
    order.forEach(key => {
      if (mergedFunctions[key]) {
        sortedFunctions.push(mergedFunctions[key]);
      }
    });
    
    return sortedFunctions;
  };

  return (
    <div className="container-fluid px-4 py-3">
      <div className="row gy-3">
        <div className="col-xl-12">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div className="d-flex align-items-center">
              <span className="subscriptionplans-title">요금제</span>
            </div>
          </div>
        </div>
        
        {/* Free Plan - 넓고 낮은 박스 */}
        {freePlan && (
          <div className="col-12 mb-4">
            <Card className="subscriptionplans-free-card">
              <Card.Body className="subscriptionplans-free-body">
                <div className="subscriptionplans-free-content">
                  <div className="subscriptionplans-free-left">
                    <span className="subscriptionplans-free-badge">기본</span>
                    <span className="subscriptionplans-free-title">
                      {freePlan.planNm === 'Default' ? '무료 플랜' : freePlan.planNm}
                    </span>
                    <span className="subscriptionplans-free-price">무료</span>
                  </div>
                  <div className="subscriptionplans-free-divider"></div>
                  <div className="subscriptionplans-free-features" style={{ padding: '10px 0' }}>
                    {transformFunctionList(freePlan.membershipPlanFunctionList || []).filter(func => func.funcNm === '상품 등록').map((planFunction, idx) => (
                      <div key={idx} className="subscriptionplans-free-feature" style={{ padding: '8px 0' }}>
                        <span className="subscriptionplans-free-feature-label">
                          {planFunction.funcNm}
                        </span>
                        <span className="subscriptionplans-free-feature-value">
                          무제한
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="subscriptionplans-change-btn" onClick={() => navigate("/store/membership-change")}>
                    변경
                  </button>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* 예상 다음 결제일 박스 */}
        <div className="col-12 mb-4">
          <Card style={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <Card.Body style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>
                예상 다음 결제일
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#212529' }}>
                {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('ko-KR')}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Paid Plans - 3개씩 정렬 */}
        <div className="col-xl-12">
          <div className="row d-flex align-items-stretch justify-content-center">
            {paidPlans.map((plan, index) => (
              <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <Card className="subscriptionplans-card">
                  <Card.Body className="subscriptionplans-card-body">
                    <span className="subscriptionplans-icon-wrapper">
                      {getPlanIcon(plan.planNm)}
                    </span>
                    <p className="subscriptionplans-plan-name">
                      {plan.planNm}
                    </p>
                    <div className="subscriptionplans-price-description-box">
                      <p className="subscriptionplans-price">
                        {plan.planPrice === 0 ? '최초 1회 무료 / 2Month' : `${plan.planPrice.toLocaleString()}원`}
                        {plan.planPrice !== 0 && <span className="subscriptionplans-price-unit">/ Month</span>}
                      </p>
                      <span className="subscriptionplans-description">
                        {plan.planDescription}
                      </span>
                    </div>
                    <ul className="subscriptionplans-features-list" style={{ padding: '10px 0' }}>
                      {transformFunctionList(plan.membershipPlanFunctionList || []).map((planFunction, idx) => (
                        <li key={idx} className="subscriptionplans-feature-item" style={{ padding: '8px 0' }}>
                          <div className="subscriptionplans-feature-content">
                            <span className="subscriptionplans-check-icon">
                              <i className="ri-check-double-line"></i>
                            </span>
                            <span className="subscriptionplans-feature-text">
                              <span>{planFunction.funcNm} </span>
                              <span className="subscriptionplans-feature-limit">
                                {planFunction.usageLimit === -1 ? '무제한' : planFunction.usageLimit}
                              </span>
                              <span>
                                {planFunction.usageLimit === -1 ? '' : planFunction.usageUnit}
                              </span>
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;