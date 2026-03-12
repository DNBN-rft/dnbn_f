import { useState } from "react";
import "./PersonalInformation.css";

const TABS = [
  {
    label: "소비자 개인정보 처리방침",
    src: "/assets/assignment/개인정보_처리방침_소비자_V2.html",
  },
  {
    label: "가맹점 개인정보 처리방침",
    src: "/assets/assignment/동네방네_가맹점_개인정보_처리방침_V2.html",
  },
];

function PersonalInformation() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="pi-page">
      <div className="pi-tab-bar">
        {TABS.map((tab, index) => (
          <button
            key={index}
            className={`pi-tab-btn${activeTab === index ? " active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pi-content">
        {TABS.map((tab, index) => (
          <iframe
            key={index}
            src={tab.src}
            title={tab.label}
            className={`pi-iframe${activeTab === index ? " visible" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PersonalInformation;
