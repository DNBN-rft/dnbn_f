import { useState, useRef, useEffect } from "react";
import "./css/storealarmmodal.css";

const StoreAlarmModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState("전체");
    const panelRef = useRef(null);

    // 임시 알람 데이터 (실제로는 API에서 가져옴)
    const alarmData = [
        { id: 1, category: "주문", content: "새로운 주문이 접수되었습니다.", time: "2025-11-27 14:30" },
        { id: 2, category: "네고", content: "네고 요청이 있습니다.", time: "2025-11-27 13:15" },
        { id: 3, category: "문의", content: "고객 문의가 등록되었습니다.", time: "2025-11-27 12:00" },
        { id: 4, category: "리뷰", content: "새로운 리뷰가 등록되었습니다.", time: "2025-11-27 11:45" },
        { id: 5, category: "주문", content: "주문이 취소되었습니다.", time: "2025-11-27 10:20" },
        { id: 6, category: "네고", content: "네고가 승인되었습니다.", time: "2025-11-27 09:30" },
        { id: 7, category: "신고", content: "신고가 접수되었습니다.", time: "2025-11-27 08:15" },
    ];

    const tabs = ["전체", "주문", "네고", "리뷰", "신고", "문의"];

    const filteredAlarms = activeTab === "전체" 
        ? alarmData 
        : alarmData.filter(alarm => alarm.category === activeTab);

    const handleAlarmClick = (alarmId) => {
        console.log("알람 클릭:", alarmId);
        // 추후 상세 페이지로 이동 로직 구현
    };

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="storealarmmodal-panel" ref={panelRef}>
            {/* 탭 영역 */}
            <div className="storealarmmodal-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`storealarmmodal-tab-button ${activeTab === tab ? "storealarmmodal-tab-active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 알람 리스트 영역 */}
                <div className="storealarmmodal-list-container">
                    {filteredAlarms.length > 0 ? (
                        filteredAlarms.map((alarm) => (
                            <div
                                key={alarm.id}
                                className="storealarmmodal-item"
                                onClick={() => handleAlarmClick(alarm.id)}
                            >
                                <div className="storealarmmodal-item-header">
                                    <span className="storealarmmodal-item-category">{alarm.category}</span>
                                    <span className="storealarmmodal-item-time">{alarm.time}</span>
                                </div>
                                <div className="storealarmmodal-item-content">
                                    {alarm.content}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="storealarmmodal-empty">
                            알람이 없습니다.
                        </div>
                    )}
                </div>
        </div>
    );
};

export default StoreAlarmModal;
