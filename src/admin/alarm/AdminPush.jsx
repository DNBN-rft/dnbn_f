import { useState } from "react";
import "./css/adminpush.css";
import AdminAddPush from "./modal/AdminAddPush";

const AdminPush = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
              총 <span className="adminpush-table-count">3</span>건
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
              <tr>
                <td>1</td>
                <td>푸시 제목 1</td>
                <td className="adminpush-content">푸시 내용 1</td>
                <td>관리자</td>
                <td>가맹점</td>
                <td>2024-06-01 10:00</td>
                <td><span className="adminpush-status-sent">발송 완료</span></td>
              </tr>
            </tbody>
          </table>

          <div className="adminpush-pagination">
            <button className="adminpush-pagination-btn">이전</button>
            <div className="adminpush-pagination-numbers">
              <button className="adminpush-page-number adminpush-page-active">1</button>
              <button className="adminpush-page-number">2</button>
              <button className="adminpush-page-number">3</button>
              <button className="adminpush-page-number">4</button>
              <button className="adminpush-page-number">5</button>
            </div>
            <button className="adminpush-pagination-btn">다음</button>
          </div>
        </div>
      </div>

      <AdminAddPush isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default AdminPush;
