import { useState } from "react";
import "./css/negotiation.css";
import NegotiationList from "./components/NegotiationList";
import BuyerRequestList from "./components/BuyerRequestList";

const Negotiation = () => {
  const [activeTab, setActiveTab] = useState("negotiation");

  return (
    <div className="negotiation-container">
      <div className="negotiation-header">
        <div className="negotiation-header-title">네고 관리</div>
      </div>

      {/* 탭 메뉴 */}
      <div className="negotiation-tabs">
        <button 
          className={`negotiation-tab ${activeTab === "negotiation" ? "active" : ""}`}
          onClick={() => setActiveTab("negotiation")}
        >
          네고 목록
        </button>
        <button 
          className={`negotiation-tab ${activeTab === "buyer-request" ? "active" : ""}`}
          onClick={() => setActiveTab("buyer-request")}
        >
          구매자 요청
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="negotiation-tab-content">
        {activeTab === "negotiation" && <NegotiationList />}
        {activeTab === "buyer-request" && <BuyerRequestList />}
      </div>
    </div>
  );
};

export default Negotiation;