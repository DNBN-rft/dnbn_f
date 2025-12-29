import { useState, useRef, useEffect } from "react";
import "./css/adminalarmmodal.css";

const AdminAlarmModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState("전체");
    const panelRef = useRef(null);

    // 임시 알람 데이터 (실제로는 API에서 가져옴)
    const alarmData = [
        { id: 1, category: "승인요청", content: "새로운 매장 승인 요청이 있습니다.", time: "2025-11-27 14:30" },
        { id: 2, category: "신고", content: "상품 신고가 접수되었습니다.", time: "2025-11-27 13:15" },
        { id: 3, category: "문의", content: "고객 문의가 등록되었습니다.", time: "2025-11-27 12:00" },
        { id: 4, category: "정산", content: "정산 처리가 완료되었습니다.", time: "2025-11-27 11:45" },
        { id: 5, category: "승인요청", content: "상품 등록 승인 요청이 있습니다.", time: "2025-11-27 10:20" },
        { id: 6, category: "신고", content: "리뷰 신고가 접수되었습니다.", time: "2025-11-27 09:30" },
        { id: 7, category: "문의", content: "매장 문의가 등록되었습니다.", time: "2025-11-27 08:15" },
        { id: 8, category: "정산", content: "월별 정산 내역이 생성되었습니다.", time: "2025-11-26 18:00" },
    ];

    const tabs = ["전체", "승인요청", "신고", "문의", "정산"];

    const filteredAlarms = activeTab === "전체" 
        ? alarmData 
        : alarmData.filter(alarm => alarm.category === activeTab);

    const handleAlarmClick = (alarmId) => {
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
        <div className="adminalarmmodal-panel" ref={panelRef}>
            {/* 탭 영역 */}
            <div className="adminalarmmodal-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`adminalarmmodal-tab-button ${activeTab === tab ? "adminalarmmodal-tab-active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 알람 리스트 영역 */}
                <div className="adminalarmmodal-list-container">
                    {filteredAlarms.length > 0 ? (
                        filteredAlarms.map((alarm) => (
                            <div
                                key={alarm.id}
                                className="adminalarmmodal-item"
                                onClick={() => handleAlarmClick(alarm.id)}
                            >
                                <div className="adminalarmmodal-item-header">
                                    <span className="adminalarmmodal-item-category">{alarm.category}</span>
                                    <span className="adminalarmmodal-item-time">{alarm.time}</span>
                                </div>
                                <div className="adminalarmmodal-item-content">
                                    {alarm.content}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="adminalarmmodal-empty">
                            알람이 없습니다.
                        </div>
                    )}
                </div>
        </div>
    );
};

export default AdminAlarmModal;