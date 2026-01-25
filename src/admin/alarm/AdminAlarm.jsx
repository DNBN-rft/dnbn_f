import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStoreAlarms, searchAlrams } from "../../utils/alarmService";
import { formatDateTime } from "../../utils/commonService";
import "./css/adminalarm.css";

const AdminAlarm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("store");
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 오늘 날짜 구하기
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(getTodayDate());
  const [alarmType, setAlarmType] = useState("all");
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  // content에서 ISO 형식의 datetime을 한국식으로 포맷팅
  const formatContentDateTime = (content) => {
    if (!content) return content;
    
    // ISO 형식의 datetime 패턴 (예: 2026-01-23T10:30:00)
    const isoDateTimePattern = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/g;
    
    return content.replace(isoDateTimePattern, (match) => {
      const date = new Date(match);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    });
  };

  // const [isSearchMode, setIsSearchMode] = useState(false);

  const fetchAlarms = useCallback(async (page = 0) => {
  setLoading(true);
  setError(null);

  try {
    if (activeTab !== "store") {
      setAlarms([]);
      setTotalElements(0);
      setTotalPages(0);
      return;
    }

    const data = await getAdminStoreAlarms(page, pageSize);
    
    setAlarms(data.content || []);
    setCurrentPage(data.number || 0);
    setTotalPages(data.totalPages || 0);
    setTotalElements(data.totalElements || 0);
  } catch (err) {
    setError(err.message || "알림 목록 조회에 실패했습니다.");
    console.error("알림 목록 조회 실패:", err);
    setAlarms([]);
  } finally {
    setLoading(false);
  }
}, [activeTab, pageSize]);


useEffect(() => {
  fetchAlarms(0);
}, [fetchAlarms]);


  const handleSearchInternal = async (page = 0) => {
    const searchParams = {
      startDate: startDate,
      endDate: endDate,
      alarmType: alarmType,
      searchTerm: searchKeyword,
      searchType: searchType === "content" ? "content" : "all",
    };

    setLoading(true);
    setError(null);

    try {
      const result = await searchAlrams(searchParams, page, pageSize);
      if (result.success) {
        setAlarms(result.data.content);
        setCurrentPage(result.data.number);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
        // setIsSearchMode(true);
      } else {
        setError(result.error);
        alert(result.error);
      }
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 검색 버튼
  const handleSearch = () => {
    setCurrentPage(0);
    handleSearchInternal(0);
  };
  // 페이지 이동 - AlarmType에 따라 적절한 페이지로 이동
  const handleNavigate = (alarm) => {
    if (!alarm.alarmLink) return;
    // 알람 타입에 따라 관리자 페이지로 이동
    switch (alarm.alarmType) {
      case "주문":
        // 주문 관리 페이지로 이동
        navigate("/admin/order", {
          state: {
            openModal: true,
            orderCode: alarm.alarmLink,
          },
        });
        break;
      case "리뷰":
        // 리뷰 관리 페이지로 이동
        navigate("/admin/review", {
          state: {
            openModal: true,
            reviewIdx: alarm.alarmLink,
          },
        });
        break;
      case "상품신고":
        // 상품 신고 관리 페이지로 이동
        navigate("/admin/report", {
          state: {
            openModal: true,
            productCode: alarm.alarmLink,
            reportType: "PRODUCT",
          },
        });
        break;
      case "리뷰신고":
        // 리뷰 신고 관리 페이지로 이동
        navigate("/admin/report", {
          state: {
            openModal: true,
            reviewIdx: alarm.alarmLink,
            reportType: "REVIEW",
          },
        });
        break;
      case "가맹신고":
        // 가맹점 신고 관리 페이지로 이동
        navigate("/admin/report", {
          state: {
            openModal: true,
            storeCode: alarm.alarmLink,
            reportType: "STORE",
          },
        });
        break;
      case "네고":
        // 네고 관리 페이지로 이동
        navigate("/admin/negotiation", {
          state: {
            openModal: true,
            negoId: alarm.alarmLink,
          },
        });
        break;
      case "문의":
        // 문의 관리 페이지로 이동
        navigate("/admin/question", {
          state: {
            openModal: true,
            questionIdx: alarm.alarmLink,
          },
        });
        break;
        case "상품 제재":
        // 상품 제재 관리 페이지로 이동
        navigate("/admin/product", {
          state: {
            openModal: true,
            productCode: alarm.alarmLink,
          },
        });
        console.log("Navigating to product restrict page with productCode:", alarm.alarmLink);
        break;
      default:
        break;
    }
  };

  return (
    <div className="adminalarm-container">
      <div className="adminalarm-wrap">
        {/* 탭 네비게이션 */}
        <div className="adminalarm-tab-navigation">
          <button
            className={`adminalarm-tab-btn ${
              activeTab === "store" ? "adminalarm-tab-active" : ""
            }`}
            onClick={() => setActiveTab("store")}
          >
            가맹점 알림
          </button>
          <button
            className={`adminalarm-tab-btn ${
              activeTab === "cust" ? "adminalarm-tab-active" : ""
            }`}
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
                <option value="">전체</option>
                <option value="NEGO">네고</option>
                <option value="REPORT_PRODUCT">상품 신고</option>
                <option value="REPORT_STORE">가맹점 신고</option>
                <option value="REPORT_REVIEW">리뷰 신고</option>
                <option value="REVIEW">리뷰</option>
                <option value="QUESTION">문의</option>
                <option value="ORDER">주문</option>
                <option value="PRODUCT_RESTRICT">상품 제재</option>
                <option value="SALE">할인</option>
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
                <option value="storeCode">가맹코드</option>
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
              <button className="adminalarm-search-btn" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </div>
        <div className="adminalarm-table-wrap">
          <div className="adminalarm-table-header">
            <div className="adminalarm-table-info">
              총 <b>{totalElements}</b>건
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
                    <th>가맹코드</th>
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
                  {alarms.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "#6b7280",
                        }}
                      >
                        조회된 알림이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    alarms.map((alarm, index) => (
                      <tr key={alarm.alarmIdx}>
                        <td>{currentPage * pageSize + index + 1}</td>
                        <td>{alarm.storeCode || "-"}</td>
                        <td>{alarm.storeNm || "-"}</td>
                        <td>{alarm.memberId || "-"}</td>
                        <td>{alarm.alarmType}</td>
                        <td className="adminalarm-content-cell">
                          {formatContentDateTime(alarm.content)}
                        </td>
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
                <button
                  className="adminalarm-page-btn"
                  onClick={() => {
                    if (currentPage > 0) {
                      const newPage = currentPage - 1;
                      setCurrentPage(newPage);
                      fetchAlarms(newPage);
                    }
                  }}
                  disabled={currentPage === 0 || totalPages === 0}
                >
                  이전
                </button>
                {totalPages > 0 ? (
                  [...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`adminalarm-page-btn ${
                        currentPage === index ? "active" : ""
                      }`}
                      onClick={() => {
                        setCurrentPage(index);
                        fetchAlarms(index);
                      }}
                    >
                      {index + 1}
                    </button>
                  ))
                ) : (
                  <button className="adminalarm-page-btn active">1</button>
                )}
                <button
                  className="adminalarm-page-btn"
                  onClick={() => {
                    if (currentPage < totalPages - 1) {
                      const newPage = currentPage + 1;
                      setCurrentPage(newPage);
                      fetchAlarms(newPage);
                    }
                  }}
                  disabled={currentPage === totalPages - 1 || totalPages === 0}
                >
                  다음
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminAlarm;
