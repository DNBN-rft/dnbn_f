import { useState } from "react";
import "./css/negotiationHistory.css";
import NegotiationHistoryList from "./components/NegotiationHistoryList";
import BuyerRequestHistoryList from "./components/BuyerRequestHistoryList";

const NegotiationHistory = () => {
  const [activeTab, setActiveTab] = useState("nego-history");

  return (
    <div className="negotiationHistory-container">
      <div className="negotiationHistory-header">
        <div className="negotiationHistory-header-title">네고 이력</div>
      </div>

      {/* 탭 메뉴 */}
      <div className="negotiationHistory-tabs">
        <button 
          className={`negotiationHistory-tab ${activeTab === "nego-history" ? "active" : ""}`}
          onClick={() => setActiveTab("nego-history")}
        >
          상품 이력
        </button>
        <button 
          className={`negotiationHistory-tab ${activeTab === "request-history" ? "active" : ""}`}
          onClick={() => setActiveTab("request-history")}
        >
          요청 이력
        </button>
      </div>

      <div className="negotiationHistory-tab-content">
        {activeTab === "nego-history" && <NegotiationHistoryList />}
        {activeTab === "request-history" && <BuyerRequestHistoryList />}
      </div>
    </div>
  );
};

export default NegotiationHistory;
