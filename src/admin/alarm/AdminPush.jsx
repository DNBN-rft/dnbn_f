import { useState, useEffect } from "react";
import "./css/adminpush.css";
import AdminAddPush from "./modal/AdminAddPush";
import { apiGet } from "../../utils/apiClient";

const AdminPush = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pushList, setPushList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 상태별 CSS 클래스
  const getStatusClass = (status) => {
    switch (status) {
      case "발송완료":
        return "adminpush-status-sent";
      case "대기":
        return "adminpush-status-pending";
      case "실패":
        return "adminpush-status-failed";
      default:
        return "";
    }
  };
  const fetchPushList = async (page = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("size", pageSize);

      const response = await apiGet(`/admin/push?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setPushList(data.content || []);
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        console.error("푸시 목록 조회 실패:", data);
        setPushList([]);
      }
    } catch (error) {
      console.error("푸시 목록 조회 중 오류:", error);
      setPushList([]);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchPushList(0);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePushSuccess = () => {
    fetchPushList(0);
  };

  const handlePageChange = (page) => {
    fetchPushList(page);
  };

  return (
    <div className="adminpush-container">
      <div className="adminpush-wrap">
        <div className="adminpush-filter-wrap">
          <div className="adminpush-filter-row">
            <div className="adminpush-filter-group">
              <label>발송상태</label>
              <select name="push-status" id="push-status" className="adminpush-select">
                <option value="all">전체</option>
                <option value="sent">발송 완료</option>
                <option value="pending">발송 대기</option>
                <option value="failed">발송 실패</option>
              </select>
            </div>

            <div className="adminpush-filter-group">
              <label>수신자</label>
              <select name="push-recipient" id="push-recipient" className="adminpush-select">
                <option value="all">전체</option>
                <option value="merchant">가맹점</option>
                <option value="customer">고객</option>
              </select>
            </div>
          </div>

          <div className="adminpush-filter-row adminpush-search-row">
            <div className="adminpush-search-group">
              <select name="push-option" id="push-option" className="adminpush-select-type">
                <option value="all">전체</option>
                <option value="sender">발신자</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
              </select>

              <input type="text" placeholder="검색어를 입력하세요." className="adminpush-input" />
              <button type="button" className="adminpush-search-btn">검색</button>
            </div>
          </div>
        </div>

        <div className="adminpush-table-wrap">
          <div className="adminpush-table-header">
            <div className="adminpush-table-info">
              총 <span className="adminpush-table-count">{totalElements}</span>건
            </div>
            <button className="adminpush-add-btn" onClick={handleOpenModal}>푸시등록</button>
          </div>

          <table className="adminpush-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>제목</th>
                <th>내용</th>
                <th>발신자</th>
                <th>수신자</th>
                <th>발송일시</th>
                <th>발송상태</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="adminpush-empty">로딩 중...</td>
                </tr>
              ) : pushList.length > 0 ? (
                pushList.map((push, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{push.title}</td>
                    <td className="adminpush-content">{push.content}</td>
                    <td>{push.regId || "관리자"}</td>
                    <td>{push.receiverType}</td>
                    <td>{push.pushSentDateTime ? new Date(push.pushSentDateTime).toLocaleString() : "-"}</td>
                    <td>
                      <span className={`adminpush-status ${getStatusClass(push.pushStatus)}`}>
                        {push.pushStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="adminpush-empty">조회된 데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="adminpush-pagination">
            <button 
              className="adminpush-pagination-btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              이전
            </button>
            <div className="adminpush-pagination-numbers">
              {[...Array(totalPages)].map((_, index) => (
                <button 
                  key={index}
                  className={`adminpush-page-number ${currentPage === index ? "adminpush-page-active" : ""}`}
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button 
              className="adminpush-pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || totalPages === 0}
            >
              다음
            </button>
          </div>
        </div>
      </div>

      <AdminAddPush 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSuccess={handlePushSuccess}
      />
    </div>
  );
};

export default AdminPush;
