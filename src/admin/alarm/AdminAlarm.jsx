import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../utils/apiClient";
import "./css/adminalarm.css";
const AdminAlarm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("store"); // 'store' or 'cust'
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 필터 상태
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alarmType, setAlarmType] = useState("all");
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  // 알림 목록 조회
  useEffect(() => {
    fetchAlarms();
  }, [activeTab]);
  const fetchAlarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = (activeTab === "store"
        ? "/admin/alarm/store"
        : "/admin/alarm/cust"); // CustAlarm은 아직 없지만 준비
      const response = await apiGet(endpoint);
      if (!response.ok) {
        throw new Error("알림 목록을 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setAlarms(data);
    } catch (err) {
      setError(err.message);
      console.error("알림 목록 조회 실패:", err);
      setAlarms([]);
    } finally {
      setLoading(false);
    }
  };
  // 알림 타입 한글 변환
  const getAlarmTypeLabel = (type) => {
    const typeMap = {
      NEGO: "네고",
      REPORT_PRODUCT: "상품 신고",
      REPORT_STORE: "가맹점 신고",
      REPORT_REVIEW: "리뷰 신고",
      REVIEW: "리뷰",
      QUESTION: "문의",
      ORDER: "주문"
    };
    return typeMap[type] || type;
  };
  // 날짜 포맷팅
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // 검색 처리
  const handleSearch = () => {
    // TODO: 필터링 로직 구현
    fetchAlarms();
  };
  // 페이지 이동 - AlarmType에 따라 적절한 페이지로 이동
  const handleNavigate = (alarm) => {
    if (!alarm.alarmLink) return;
    // 알람 타입에 따라 관리자 페이지로 이동
    switch (alarm.alarmType) {
      case "ORDER":
        // 주문 관리 페이지로 이동
        navigate("/admin/order", {
          state: {
            openModal: true,
            orderCode: alarm.alarmLink
          }
        });
        break;
      case "REVIEW":
        // 리뷰 관리 페이지로 이동
        navigate("/admin/review", {
          state: {
            openModal: true,
            reviewIdx: alarm.alarmLink
          }
        });
        break;
      case "REPORT_PRODUCT":
        // 상품 신고 관리 페이지로 이동
        navigate("/admin/report", {
          state: {
            openModal: true,
            productCode: alarm.alarmLink,
            reportType: "PRODUCT"
          }
        });
        break;
      case "REPORT_REVIEW":
        // 리뷰 신고 관리 페이지로 이동
        navigate("/admin/report", {
          state: {
            openModal: true,
            reviewIdx: alarm.alarmLink,
            reportType: "REVIEW"
          }
        });
        break;
      case "REPORT_STORE":
        // 가맹점 신고 관리 페이지로 이동
        navigate("/admin/report", {
          state: {
            openModal: true,
            storeCode: alarm.alarmLink,
            reportType: "STORE"
          }
        });
        break;
      case "NEGO":
        // 네고 관리 페이지로 이동
        navigate("/admin/negotiation", {
          state: {
            openModal: true,
            negoId: alarm.alarmLink
          }
        });
        break;
      case "QUESTION":
        // 문의 관리 페이지로 이동
        navigate("/admin/question", {
          state: {
            openModal: true,
            questionIdx: alarm.alarmLink
          }
        });
        break;
      default:
        console.log("알 수 없는 알람 타입:", alarm.alarmType);
        break;
    }
  };
  // 필터링된 알림 목록
  const filteredAlarms = alarms.filter(alarm => {
    // 기간 필터
    if (startDate && new Date(alarm.sendDateTime) < new Date(startDate)) return false;
    if (endDate && new Date(alarm.sendDateTime) > new Date(endDate)) return false;
    // 알림 타입 필터
    if (alarmType !== "all" && alarm.alarmType !== alarmType) return false;
    // 검색어 필터
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      if (searchType === "all") {
        return alarm.content?.toLowerCase().includes(keyword);
      }
    }
    return true;
  });
  return (
    <div className="adminalarm-container">
      <div className="adminalarm-wrap">
        {/* 탭 네비게이션 */}
        <div className="adminalarm-tab-navigation">
          <button
            className={`adminalarm-tab-btn ${activeTab === "store" ? "adminalarm-tab-active" : ""}`}
            onClick={() => setActiveTab("store")}
          >
            가맹점 알림
          </button>
          <button
            className={`adminalarm-tab-btn ${activeTab === "cust" ? "adminalarm-tab-active" : ""}`}
            onClick={() => setActiveTab("cust")}
          >
            일반사용자 알림
          </button>
        </div>
        <div className="adminalarm-filter-wrap">
          <div className="adminalarm-filter-row">
            <div className="adminalarm-filter-group">
              <label htmlFor="adminalarm-start-date">기간</label>
              <input
                type="date"
                id="adminalarm-start-date"
                className="adminalarm-filter-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>~</span>
              <input
                type="date"
                className="adminalarm-filter-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="adminalarm-filter-group">
              <label htmlFor="alarm-type">알림타입</label>
              <select
                name="alarm-type"
                id="alarm-type"
                className="adminalarm-select"
                value={alarmType}
                onChange={(e) => setAlarmType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="NEGO">네고</option>
                <option value="REPORT_PRODUCT">상품 신고</option>
                <option value="REPORT_STORE">가맹점 신고</option>
                <option value="REPORT_REVIEW">리뷰 신고</option>
                <option value="REVIEW">리뷰</option>
                <option value="QUESTION">문의</option>
                <option value="ORDER">주문</option>
              </select>
            </div>
          </div>
          <div className="adminalarm-filter-row adminalarm-search-row">
            <div className="adminalarm-search-group">
              <select
                name="alarm-option"
                id="alarm-option"
                className="adminalarm-select-type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="content">내용</option>
              </select>
              <input
                type="text"
                className="adminalarm-input"
                placeholder="검색어를 입력하세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="adminalarm-search-btn" onClick={handleSearch}>검색</button>
            </div>
          </div>
        </div>
        <div className="adminalarm-table-wrap">
          <div className="adminalarm-table-header">
            <div className="adminalarm-table-info">
              총 <b>{filteredAlarms.length}</b>건
            </div>
          </div>
          {loading ? (
            <div className="adminalarm-loading">로딩 중...</div>
          ) : error ? (
            <div className="adminalarm-error">{error}</div>
          ) : (
            <>
              <table className="adminalarm-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>가맹점명</th>
                    <th>회원ID</th>
                    <th>알림타입</th>
                    <th>내용</th>
                    <th>전송시간</th>
                    <th>읽은시간</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlarms.length === 0 ? (
                    <tr>
                      <td colSpan="8">알림이 없습니다.</td>
                    </tr>
                  ) : (
                    filteredAlarms.map((alarm) => (
                      <tr key={alarm.alarmIdx}>
                        <td>{alarm.alarmIdx}</td>
                        <td>{alarm.storeNm || "-"}</td>
                        <td>{alarm.memberId || "-"}</td>
                        <td>{getAlarmTypeLabel(alarm.alarmType)}</td>
                        <td className="adminalarm-content-cell">{alarm.content}</td>
                        <td>{formatDateTime(alarm.sendDateTime)}</td>
                        <td>{formatDateTime(alarm.readDateTime)}</td>
                        <td>
                          <button
                            className="adminalarm-direct-btn"
                            onClick={() => handleNavigate(alarm)}
                            disabled={!alarm.alarmLink}
                          >
                            페이지 이동
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="adminalarm-pagination">
                <button className="adminalarm-pagination-btn">이전</button>
                <div className="adminalarm-pagination-numbers">
                  <button className="adminalarm-page-number adminalarm-page-active">
                    1
                  </button>
                  <button className="adminalarm-page-number">2</button>
                  <button className="adminalarm-page-number">3</button>
                </div>
                <button className="adminalarm-pagination-btn">다음</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminAlarm;