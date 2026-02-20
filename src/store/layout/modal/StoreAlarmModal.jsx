import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlarmList } from "../../../hooks/useAlarm";
import { markAlarmAsRead } from "../../../utils/alarmService";
import "./css/storealarmmodal.css";
import { formatDateTime } from "../../../utils/commonService";

const StoreAlarmModal = ({ onClose, buttonRef }) => {
  const [activeTab, setActiveTab] = useState("전체");
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const { data: alarmData = [], isLoading: loading } = useAlarmList(
    JSON.parse(localStorage.getItem("user")).memberId
  );

  const tabs = ["전체", "상품", "네고", "리뷰", "고객센터", "기타"];
  
  const getCategoryFromAlarmType = (alarmType) => {
    if (!alarmType) return "알수없음";
    
    // 백엔드에서 이미 한글로 오는 경우
    if (alarmType === "주문" || alarmType === "할인" || alarmType === "네고")  return "상품";
    if (alarmType === "네고 요청") return "네고";
    if (alarmType === "리뷰") return "리뷰";
    if (alarmType === "상품신고" || alarmType === "리뷰신고" || alarmType === "가맹신고" || alarmType === "문의") return "고객센터";
    if (alarmType === "상품 제재" || alarmType === "리뷰 숨김") return "기타";
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
    isUnread: !alarm.readDateTime, // readDateTime이 null이면 읽지 않은 알림
  }));

  const categoryFiltered =
    activeTab === "전체"
      ? transformedAlarms
      : transformedAlarms.filter((alarm) => alarm.category === activeTab);

  const unreadAlarms = categoryFiltered
    .filter((alarm) => alarm.isUnread)
    .sort((a, b) => new Date(b.sendDateTime) - new Date(a.sendDateTime));

  const readAlarms = categoryFiltered
    .filter((alarm) => !alarm.isUnread)
    .sort((a, b) => new Date(b.sendDateTime) - new Date(a.sendDateTime));

  const handleAlarmClick = async (alarm) => {
    // 알림 읽음 처리 API 호출
    try {
      if (alarm.alarmIdx && alarm.isUnread) {
        await markAlarmAsRead(alarm.alarmIdx);
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
            orderCode: alarm.alarmLink,
          },
        });
        break;

      case "REVIEW":
        // 리뷰 페이지로 이동하고 reviewIdx 전달
        navigate("/store/review", {
          state: {
            openModal: true,
            reviewIdx: alarm.alarmLink,
          },
        });
        break;

      case "REPORT_PRODUCT":
        // 상품관리 페이지로 이동하고 productCode 전달
        navigate("/store/productmanage", {
          state: {
            openModal: true,
            productCode: alarm.alarmLink,
            reportType: "PRODUCT",
          },
        });
        break;

      case "REPORT_REVIEW":
        // 리뷰 페이지로 이동하고 reviewIdx 전달 (신고된 리뷰)
        navigate("/store/review", {
          state: {
            openModal: true,
            reviewIdx: alarm.alarmLink,
            reportType: "REVIEW",
          },
        });
        break;

      case "REPORT_STORE":
        // 스토어 신고는 마이페이지나 대시보드로 이동 (필요에 따라 수정)
        navigate("/store/mypage", {
          state: {
            storeCode: alarm.alarmLink,
            reportType: "STORE",
          },
        });
        break;

      case "NEGO":
        // 네고 페이지로 이동
        navigate("/store/negotiation", {
          state: {
            openModal: true,
            negoId: alarm.alarmLink,
          },
        });
        break;

      case "PRODUCT_RESTRICT":
        // 상품관리 페이지로 이동하고 productCode 전달
        navigate("/store/product", {
          state: {
            openModal: true,
            productCode: alarm.alarmLink,
            reportType: "PRODUCT_RESTRICT",
          },
        });
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        // 알람 버튼 클릭은 제외 (버튼 자체의 onClick이 토글을 처리)
        if (buttonRef?.current && buttonRef.current.contains(event.target)) {
          return;
        }
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, buttonRef]);

  return (
    <div className="storealarmmodal-panel" ref={panelRef}>
      <div className="storealarmmodal-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`storealarmmodal-tab-button ${
              activeTab === tab ? "storealarmmodal-tab-active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="storealarmmodal-list-container">
        {loading ? (
          <div className="storealarmmodal-empty">로딩 중...</div>
        ) : unreadAlarms.length === 0 && readAlarms.length === 0 ? (
          <div className="storealarmmodal-empty">알람이 없습니다.</div>
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
                      <span className="storealarmmodal-item-category">
                        {alarm.category}
                      </span>
                      <span
                        className="storealarmmodal-item-time"
                        style={{ fontWeight: "bold" }}
                      >
                        {alarm.time}
                      </span>
                    </div>
                    <div
                      className="storealarmmodal-item-content"
                      style={{ fontWeight: "bold" }}
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
                      <span className="storealarmmodal-item-category">
                        {alarm.category}
                      </span>
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
