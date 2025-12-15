import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/membershipchange.css";
import { apiCall } from "../../utils/apiClient";
const MembershipChange = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [memberShipPlans, setmemberShipPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let userInfo = localStorage.getItem("user");
        const storeCode = JSON.parse(userInfo).storeCode;
        // 현재 멤버십 정보 가져오기
        const storeResponse = await fetch(
          `http://localhost:8080/api/store/view/${storeCode}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (storeResponse.ok) {
          const storeData = await storeResponse.json();
          setCurrentPlan({
            name: storeData.PlanNm,
            price: storeData.PlanPrice,
          });
        }
        // 구독 플랜 목록 가져오기
        const plansResponse = await fetch(
          `http://localhost:8080/api/member/membership-plans`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
  }, []);
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
        let userInfo = localStorage.getItem("user");
        const storeCode = JSON.parse(userInfo).storeCode;
        const requestBody = {
          storeCode: storeCode,
          memberShipPlanIdx: selectedPlan.memberShipPlanIdx,
        };
        const response = await apiCall("/store/changeMembership", {
          method: "POST",
          body: JSON.stringify(requestBody),
        });
        if (response.ok) {
          alert("멤버십이 성공적으로 변경되었습니다.");
          navigate("/mypage");
        } else {
          alert("멤버십 변경에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error changing membership:", error);
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
          onClick={() => navigate("/dashboard")}
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
                {currentPlan.name}
              </span>
              <span className="membership-change-current-price">
                월 {currentPlan.price?.toLocaleString()}원
              </span>
            </div>
          </div>
          <div className="membership-change-features-info">
            <div className="membership-change-features-title">
              :전구: 각 플랜의 기능을 확인하세요
            </div>
            <p className="membership-change-features-description">
              각 멤버쉽 플랜을 클릭하면 포함된 기능의 상세 정보를 확인할 수
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
                      {plan.memberShipPlanNm}
                    </span>
                    {currentPlan?.name === plan.memberShipPlanNm && (
                      <span className="membership-change-plan-box-current-badge">
                        현재 플랜
                      </span>
                    )}
                  </div>
                  <span className="membership-change-plan-box-price">
                    월 {plan.memberShipPlanPrice?.toLocaleString()}원
                  </span>
                </div>
                <div className="membership-change-plan-box-actions">
                  <button
                    className={`membership-change-plan-box-select-btn ${
                      selectedPlan?.memberShipPlanIdx === plan.memberShipPlanIdx
                        ? "selected"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(plan);
                    }}
                  >
                    {selectedPlan?.memberShipPlanIdx === plan.memberShipPlanIdx
                      ? "✓ 선택됨"
                      : "선택하기"}
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
                          {func.usageLimit}
                          {func.usageUnit}
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