import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import { useAlarmList } from "../../../hooks/useAlarm";
import { markAlarmAsRead } from "../../../utils/alarmService";
import "./css/storealarmmodal.css";

const StoreAlarmModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState("전체");
    const panelRef = useRef(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { data: alarmData = [], isLoading: loading } = useAlarmList(user?.memberId);

    const tabs = ["전체", "상품", "네고", "리뷰", "신고", "문의"];

    const getCategoryFromAlarmType = (alarmType) => {
        if (!alarmType) return "알수없음";
        
        switch (alarmType) {
            case "ORDER":
                return "상품";
            case "NEGO":
                return "네고";
            case "REVIEW":
                return "리뷰";
            case "REPORT":
            case "REPORT_PRODUCT":
            case "REPORT_REVIEW":
            case "REPORT_STORE":
                return "신고";
            case "QUESTION":
                return "문의";
            default:
                return "알수없음";
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "";
        const date = new Date(dateTime);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\. /g, '-').replace('.', '');
    };

    const transformedAlarms = alarmData.map((alarm, index) => ({
        id: index + 1,
        alarmIdx: alarm.alarmIdx, // 백엔드에서 받은 alarmIdx
        category: getCategoryFromAlarmType(alarm.alarmType),
        content: alarm.content || "알림 내용이 없습니다.",
        time: formatDateTime(alarm.sendDateTime),
        sendDateTime: alarm.sendDateTime,
        alarmLink: alarm.alarmLink,
        alarmType: alarm.alarmType,
        isUnread: !alarm.readDateTime // readDateTime이 null이면 읽지 않은 알림
    }));

    const categoryFiltered = activeTab === "전체" 
        ? transformedAlarms 
        : transformedAlarms.filter(alarm => alarm.category === activeTab);

    const unreadAlarms = categoryFiltered
        .filter(alarm => alarm.isUnread)
        .sort((a, b) => new Date(b.sendDateTime) - new Date(a.sendDateTime));
    
    const readAlarms = categoryFiltered
        .filter(alarm => !alarm.isUnread)
        .sort((a, b) => new Date(b.sendDateTime) - new Date(a.sendDateTime));

    const handleAlarmClick = async (alarm) => {
        // 알림 읽음 처리 API 호출
        try {
            if (alarm.alarmIdx && alarm.isUnread) {
                await markAlarmAsRead(alarm.alarmIdx);
                console.log(`알림 ${alarm.alarmIdx} 읽음 처리 완료`);
            }
        } catch (error) {
            console.error("알림 읽음 처리 실패:", error);
        }
        
        onClose();
        
        // 알람 타입에 따라 페이지 이동 및 상태 전달
        switch (alarm.alarmType) {
            case "ORDER":
                // 주문 목록 페이지로 이동하고 orderCode 전달
                navigate("/store/orderlist", { 
                    state: { 
                        openModal: true, 
                        orderCode: alarm.alarmLink 
                    } 
                });
                break;
                
            case "REVIEW":
                // 리뷰 페이지로 이동하고 reviewIdx 전달
                navigate("/store/review", { 
                    state: { 
                        openModal: true, 
                        reviewIdx: alarm.alarmLink 
                    } 
                });
                break;
                
            case "REPORT_PRODUCT":
                // 상품관리 페이지로 이동하고 productCode 전달
                navigate("/store/productmanage", { 
                    state: { 
                        openModal: true, 
                        productCode: alarm.alarmLink,
                        reportType: "PRODUCT"
                    } 
                });
                break;
                
            case "REPORT_REVIEW":
                // 리뷰 페이지로 이동하고 reviewIdx 전달 (신고된 리뷰)
                navigate("/store/review", { 
                    state: { 
                        openModal: true, 
                        reviewIdx: alarm.alarmLink,
                        reportType: "REVIEW"
                    } 
                });
                break;
                
            case "REPORT_STORE":
                // 스토어 신고는 마이페이지나 대시보드로 이동 (필요에 따라 수정)
                navigate("/store/mypage", { 
                    state: { 
                        storeCode: alarm.alarmLink,
                        reportType: "STORE"
                    } 
                });
                break;
                
            case "NEGO":
                // 네고 페이지로 이동
                navigate("/store/negotiation", { 
                    state: { 
                        openModal: true, 
                        negoId: alarm.alarmLink 
                    } 

                });
                break;
                
            default:
                console.log("알 수 없는 알람 타입:", alarm.alarmType);
                break;
        }
    };

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

                <div className="storealarmmodal-list-container">
                    {loading ? (
                        <div className="storealarmmodal-empty">
                            로딩 중...
                        </div>
                    ) : (unreadAlarms.length === 0 && readAlarms.length === 0) ? (
                        <div className="storealarmmodal-empty">
                            알람이 없습니다.
                        </div>
                    ) : (
                        <>
                            {/* 읽지 않은 알람 */}
                            {unreadAlarms.length > 0 && (
                                <>
                                    {unreadAlarms.map((alarm) => (
                                        <div
                                            key={alarm.id}
                                            className="storealarmmodal-item"
                                            onClick={() => handleAlarmClick(alarm)}
                                        >
                                            <div className="storealarmmodal-item-header">
                                                <span className="storealarmmodal-item-category">{alarm.category}</span>
                                                <span 
                                                    className="storealarmmodal-item-time"
                                                    style={{ fontWeight: 'bold' }}
                                                >
                                                    {alarm.time}
                                                </span>
                                            </div>
                                            <div 
                                                className="storealarmmodal-item-content"
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                {alarm.content}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* 구분선 */}
                            {unreadAlarms.length > 0 && readAlarms.length > 0 && (
                                <div className="storealarmmodal-divider">
                                    <span className="storealarmmodal-divider-text">읽은 알람</span>
                                </div>
                            )}

                            {/* 읽은 알람 */}
                            {readAlarms.length > 0 && (
                                <>
                                    {readAlarms.map((alarm) => (
                                        <div
                                            key={alarm.id}
                                            className="storealarmmodal-item"
                                            onClick={() => handleAlarmClick(alarm)}
                                        >
                                            <div className="storealarmmodal-item-header">
                                                <span className="storealarmmodal-item-category">{alarm.category}</span>
                                                <span className="storealarmmodal-item-time">
                                                    {alarm.time}
                                                </span>
                                            </div>
                                            <div className="storealarmmodal-item-content">
                                                {alarm.content}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
        </div>
    );
};

export default StoreAlarmModal;
