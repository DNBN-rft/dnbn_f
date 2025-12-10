import { Card } from 'react-bootstrap';
import './css/subscription.css';

const SubscriptionPlans = () => {
  // 임시 데이터 (실제로는 API에서 받아와야 함)
  const subscriptionPlanList = [
    {
      subscriptionPlanNm: "Free Plan",
      subscriptionPlanPrice: 0,
      subscriptionPlanDescription: "최초 사용자를 위한 플랜",
      subscriptionPlanFunctionList: [
        {
          function: {
            functionDescription: "최대 할인 등록 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 2
        },
        {
          function: {
            functionDescription: "할인 노출 시간",
            usageLimitUnit: { value: "시간" }
          },
          usageLimit: 5
        },
        {
          function: {
            functionDescription: "홍보 발송 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 2
        },
        {
          function: {
            functionDescription: "홍보 반경",
            usageLimitUnit: { value: "m" }
          },
          usageLimit: 300
        }
      ]
    },
    {
      subscriptionPlanNm: "Basic Plan",
      subscriptionPlanPrice: 29900,
      subscriptionPlanDescription: "기본 플랜",
      subscriptionPlanFunctionList: [
        {
          function: {
            functionDescription: "최대 할인 등록 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 3
        },
        {
          function: {
            functionDescription: "할인 노출 시간",
            usageLimitUnit: { value: "시간" }
          },
          usageLimit: 10
        },
        {
          function: {
            functionDescription: "홍보 발송 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 2
        },
        {
          function: {
            functionDescription: "홍보 반경",
            usageLimitUnit: { value: "m" }
          },
          usageLimit: 300
        }
      ]
    },
    {
      subscriptionPlanNm: "Standard Plan",
      subscriptionPlanPrice: 39900,
      subscriptionPlanDescription: "합리적인 가격의 멤버쉽",
      subscriptionPlanFunctionList: [
        {
          function: {
            functionDescription: "최대 할인 등록 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 7
        },
        {
          function: {
            functionDescription: "할인 노출 시간",
            usageLimitUnit: { value: "시간" }
          },
          usageLimit: 24
        },
        {
          function: {
            functionDescription: "홍보 발송 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 6
        },
        {
          function: {
            functionDescription: "홍보 반경",
            usageLimitUnit: { value: "km" }
          },
          usageLimit: 3
        }
      ]
    },
        {
      subscriptionPlanNm: "Premium Plan",
      subscriptionPlanPrice: 49900,
      subscriptionPlanDescription: "모든 기능을 제공하는 멤버쉽",
      subscriptionPlanFunctionList: [
        {
          function: {
            functionDescription: "최대 할인 등록 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 10
        },
        {
          function: {
            functionDescription: "할인 노출 시간",
            usageLimitUnit: { value: "시간" }
          },
          usageLimit: 50
        },
        {
          function: {
            functionDescription: "홍보 발송 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 7
        },
        {
          function: {
            functionDescription: "홍보 반경",
            usageLimitUnit: { value: "km" }
          },
          usageLimit: 5
        }
      ]
    },
    {
      subscriptionPlanNm: "Specific Plan",
      subscriptionPlanPrice: 59900,
      subscriptionPlanDescription: "가전, 가구, 렌탈 사업자를 위한 플랜",
      subscriptionPlanFunctionList: [
        {
          function: {
            functionDescription: "최대 할인 등록 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 14
        },
        {
          function: {
            functionDescription: "할인 노출 시간",
            usageLimitUnit: { value: "시간" }
          },
          usageLimit: 48
        },
        {
          function: {
            functionDescription: "홍보 발송 횟수",
            usageLimitUnit: { value: "건" }
          },
          usageLimit: 12
        },
        {
          function: {
            functionDescription: "홍보 반경",
            usageLimitUnit: { value: "km" }
          },
          usageLimit: 3
        }
      ]
    }
  ];

  const getPlanIcon = (planName) => {
    switch (planName) {
      case 'Basic Plan':
      case 'Standard Plan':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
            <path d="M237.66,153,153,237.66a8,8,0,0,1-11.31,0L42.34,138.34A8,8,0,0,1,40,132.69V40h92.69a8,8,0,0,1,5.65,2.34l99.32,99.32A8,8,0,0,1,237.66,153Z" opacity="0.2"></path>
            <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path>
          </svg>
        );
      case 'Specific Plan':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
            <path d="M200,152l-40,40L96,176,40,136,72.68,70.63,128,56l55.32,14.63L183.6,72H144L98.34,116.29a8,8,0,0,0,1.38,12.42C117.23,139.9,141,139.13,160,120Z" opacity="0.2"></path>
            <path d="M254.3,107.91,228.78,56.85a16,16,0,0,0-21.47-7.15L182.44,62.13,130.05,48.27a8.14,8.14,0,0,0-4.1,0L73.56,62.13,48.69,49.7a16,16,0,0,0-21.47,7.15L1.7,107.9a16,16,0,0,0,7.15,21.47l27,13.51,55.49,39.63a8.06,8.06,0,0,0,2.71,1.25l64,16a8,8,0,0,0,7.6-2.1l55.07-55.08,26.42-13.21a16,16,0,0,0,7.15-21.46Zm-54.89,33.37L165,113.72a8,8,0,0,0-10.68.61C136.51,132.27,116.66,130,104,122L147.24,80h31.81l27.21,54.41ZM41.53,64,62,74.22,36.43,125.27,16,115.06Zm116,119.13L99.42,168.61l-49.2-35.14,28-56L128,64.28l9.8,2.59-45,43.68-.08.09a16,16,0,0,0,2.72,24.81c20.56,13.13,45.37,11,64.91-5L188,152.66Zm62-57.87-25.52-51L214.47,64,240,115.06Zm-87.75,92.67a8,8,0,0,1-7.75,6.06,8.13,8.13,0,0,1-1.95-.24L80.41,213.33a7.89,7.89,0,0,1-2.71-1.25L51.35,193.26a8,8,0,0,1,9.3-13l25.11,17.94L126,208.24A8,8,0,0,1,131.82,217.94Z"></path>
          </svg>
        );
      case 'Premium Plan':
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

  return (
    <div className="container-fluid px-4 py-3">
      <div className="row gy-3">
        <div className="col-xl-12">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div className="d-flex align-items-center">
              <span className="fs-16 fw-semibold me-1">요금제</span>
            </div>
          </div>
        </div>
        <div className="col-xl-12">
          <div className="row d-flex align-items-stretch justify-content-center">
            {subscriptionPlanList.map((plan, index) => (
              <div key={index} className="col-lg-6 col-xl-4 col-md-6 col-sm-12 mb-4">
                <Card className="custom-card pricing-card h-100">
                  <Card.Body className="p-4">
                    <span className="avatar avatar-md bg-info-transparent avatar-rounded mb-3 svg-primary">
                      {getPlanIcon(plan.subscriptionPlanNm)}
                    </span>
                    <p className="fs-16 mb-0 plan-text">{plan.subscriptionPlanNm}</p>
                    <p className="fs-16 fw-semibold mb-1 op-5">
                      {plan.subscriptionPlanPrice.toLocaleString()}원
                      <span className="fs-16 ms-1">/ Month</span>
                    </p>
                    <span className="text-dark opacity-75 d-block">
                      {plan.subscriptionPlanDescription}
                    </span>
                    <span className="badge bg-info-transparent mt-3 mb-3">
                      다음 결제일 :
                    </span>
                    <ul className="list-unstyled pricing-body">
                      {plan.subscriptionPlanFunctionList.map((planFunction, idx) => (
                        <li key={idx}>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-xs svg-primary">
                              <i className="ri-check-double-line text-info fs-14"></i>
                            </span>
                            <span className="ms-2 my-auto flex-fill">
                              <span>{planFunction.function.functionDescription} </span>
                              <span className="fs-16 fw-semibold">
                                {planFunction.usageLimit}
                              </span>
                              <span>
                                {planFunction.function.usageLimitUnit.value}
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