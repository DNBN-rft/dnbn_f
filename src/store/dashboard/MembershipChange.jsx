import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/membershipchange.css";
import { apiGet, apiPost } from "../../utils/apiClient";
const MembershipChange = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [memberShipPlans, setmemberShipPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const storeCode = JSON.parse(localStorage.getItem("user")).storeCode;
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 현재 멤버십 정보 가져오기
        const storeResponse = await apiGet(`/store/view/${storeCode}`);
        if (storeResponse.ok) {
          const storeData = await storeResponse.json();
          setCurrentPlan({
            name: storeData.planNm,
            price: storeData.planPrice,
          });
        }
        // 구독 플랜 목록 가져오기
        const plansResponse = await apiGet(`/store/member/membership-plans`);
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          setmemberShipPlans(plansData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeCode]);
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };
  const togglePlanExpand = (planIdx) => {
    setExpandedPlan(expandedPlan === planIdx ? null : planIdx);
  };
  const handlePlanChange = async () => {
    if (!selectedPlan) {
      alert("변경할 멤버십 플랜을 선택해주세요.");
      return;
    }
    if (
      window.confirm(`${selectedPlan.memberShipPlanNm}으로 변경하시겠습니까?`)
    ) {
      try {
        const requestBody = {
          storeCode: storeCode,
          memberShipPlanIdx: selectedPlan.memberShipPlanIdx,
        };
        const response = await apiPost("/store/changeMembership", requestBody);
        if (response.ok) {
          alert("멤버십이 성공적으로 변경되었습니다.");
          navigate("/store/mypage");
        } else {
          alert("멤버십 변경에 실패했습니다.");
        }
      } catch (error) {
        alert("멤버십 변경 중 오류가 발생했습니다.");
      }
    }
  };
  if (loading) {
    return <div className="membership-change-wrap">로딩 중...</div>;
  }
  return (
    <div className="membership-change-wrap">
      <div className="membership-change-header">
        <div className="membership-change-title">멤버쉽 변경</div>
        <button
          className="membership-change-back-btn"
          onClick={() => navigate("/store/dashboard")}
        >
          돌아가기
        </button>
      </div>
      {currentPlan && (
        <>
          <div className="membership-change-current">
            <div className="membership-change-current-title">현재 멤버쉽</div>
            <div className="membership-change-current-info">
              <span className="membership-change-current-name">
                {currentPlan.name === "Default" ? "기본" : currentPlan.name}
              </span>
              <span className="membership-change-current-price">
                {currentPlan.name === "Default" ? "무료" : currentPlan.name === "Free" ? "최초 1회 무료" : `월 ${currentPlan.price?.toLocaleString()}원`}
              </span>
            </div>
          </div>
          <div className="membership-change-features-info">
            <div className="membership-change-features-title">
              각 플랜의 기능을 확인하세요
            </div>
            <p className="membership-change-features-description">
              멤버쉽 플랜을 클릭하면 포함된 기능의 상세 정보를 확인할 수
              있습니다. 현재 사용 중인 플랜과 다른 플랜을 비교해보세요.
            </p>
          </div>
        </>
      )}
      <div className="membership-change-content">
        <div className="membership-change-plans-title">플랜 선택</div>
        <div className="membership-change-plans-list">
          {memberShipPlans.map((plan, index) => (
            <div
              key={index}
              className={`membership-change-plan-box ${
                selectedPlan?.memberShipPlanIdx === plan.memberShipPlanIdx
                  ? "membership-change-plan-box-selected"
                  : ""
              } ${
                currentPlan?.name === plan.memberShipPlanNm
                  ? "membership-change-plan-box-current"
                  : ""
              }`}
            >
              <div
                className="membership-change-plan-box-header"
                onClick={() => togglePlanExpand(plan.memberShipPlanIdx)}
              >
                <div className="membership-change-plan-box-info">
                  <div className="membership-change-plan-box-name-row">
                    <span className="membership-change-plan-box-name">
                      {plan.memberShipPlanNm === "Default" ? "기본" : plan.memberShipPlanNm}
                    </span>
                    {currentPlan?.name === plan.memberShipPlanNm && (
                      <span className="membership-change-plan-box-current-badge">
                        현재 플랜
                      </span>
                    )}
                  </div>
                  
                  <span className="membership-change-plan-box-price">
                    {plan.memberShipPlanNm === "Default" ? "무료" : plan.memberShipPlanNm === "Free" ? "최초 1회 무료" : `월 ${plan.memberShipPlanPrice?.toLocaleString()}원`}
                  </span>
                  
                  {selectedPlan?.memberShipPlanIdx === plan.memberShipPlanIdx && plan.memberShipPlanPrice > currentPlan?.price ? (
                    <div className="membership-change-plan-box-price-note">
                      즉시 변경된 멤버쉽 정보가 반영되고, 각 기능의 잔여 사용량에 멤버쉽 간 차이 만큼 추가 지급됩니다. 익월 요금에 추가 요금이 부과됩니다.
                    </div>
                  ) : selectedPlan?.memberShipPlanIdx === plan.memberShipPlanIdx && plan.memberShipPlanPrice < currentPlan?.price ? (
                    <div className="membership-change-plan-box-price-note">
                      익월부터 멤버쉽 정보가 반영됩니다.
                    </div>
                  ) : ""}
                </div>
                <div className="membership-change-plan-box-actions">
                  <button
                    className={`membership-change-plan-box-select-btn ${
                      selectedPlan?.memberShipPlanIdx === plan.memberShipPlanIdx
                        ? "selected"
                        : ""
                    } ${currentPlan?.name === plan.memberShipPlanNm ? "current" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(plan);
                    }}
                  >
                    {currentPlan?.name === plan.memberShipPlanNm
                      ? "사용 중"
                      : `${selectedPlan?.memberShipPlanIdx === plan.memberShipPlanIdx
                      ? "✓ 선택됨"
                      : "선택하기"}`}
                  </button>
                  <span className="membership-change-plan-box-toggle-icon">
                    {expandedPlan === plan.memberShipPlanIdx ? "▲" : "▼"}
                  </span>
                </div>
              </div>
              {expandedPlan === plan.memberShipPlanIdx && (
                <div className="membership-change-plan-box-details">
                  <div className="membership-change-plan-box-description">
                    {plan.memberShipPlanDescription}
                  </div>
                  <div className="membership-change-plan-box-features-title">
                    포함된 기능
                  </div>
                  <div className="membership-change-plan-box-features">
                    {plan.memberShipPlanFuncList?.map((func, idx) => (
                      <div
                        key={idx}
                        className="membership-change-plan-box-feature"
                      >
                        <span className="membership-change-plan-box-feature-icon">
                          ✓
                        </span>
                        <span className="membership-change-plan-box-feature-text">
                          <strong>{func.funcDescription}:</strong>{" "}
                          {func.usageLimit === -1 ? "무제한" : func.usageLimit}
                          {func.usageLimit === -1 ? "" : func.usageUnit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="membership-change-btn-wrap">
          <button
            className="membership-change-confirm-btn"
            onClick={handlePlanChange}
            disabled={
              !selectedPlan ||
              currentPlan?.name === selectedPlan?.memberShipPlanNm
            }
          >
            {selectedPlan &&
            currentPlan?.name === selectedPlan?.memberShipPlanNm
              ? "현재 사용 중인 플랜입니다"
              : "멤버쉽 변경하기"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default MembershipChange;