import "./css/adminalarm.css";

const AdminAlarm = () => {
  return (
    <div className="adminalarm-container">
      <div className="adminalarm-wrap">
        <div className="adminalarm-filter-wrap">
          <div className="adminalarm-filter-row">
            <div className="adminalarm-filter-group">
              <label htmlFor="adminalarm-start-date">기간</label>
              <input type="date" id="adminalarm-start-date" className="adminalarm-filter-date"/>
              <span>~</span>
              <input type="date" className="adminalarm-filter-date"/>
            </div>

            <div className="adminalarm-filter-group">
              <label htmlFor="receiver-type">수신자타입</label>
              <select name="receiver-type" id="receiver-type" className="adminalarm-select">
                <option value="all">전체</option>
                <option value="general">일반사용자</option>
                <option value="store">가맹점</option>
              </select>
            </div>

            <div className="adminalarm-filter-group">
              <label htmlFor="alarm-type">알림타입</label>
              <select name="alarm-type" id="alarm-type" className="adminalarm-select">
                <option value="all">전체</option>
                <option value="nego">네고</option>
                <option value="report">신고</option>
                <option value="question">문의</option>
                <option value="etc">기타</option>
              </select>
            </div>
          </div>

          <div className="adminalarm-filter-row adminalarm-search-row">
            <div className="adminalarm-search-group">
              <select name="alarm-option" id="alarm-option" className="adminalarm-select-type">
                <option value="all">전체</option>
                <option value="sender">송신자</option>
                <option value="receiver">수신자</option>
              </select>
              <input type="text" className="adminalarm-input" placeholder="검색어를 입력하세요"/>
              <button className="adminalarm-search-btn">검색</button>
            </div>
          </div>
        </div>

        <div className="adminalarm-table-wrap">
          <div className="adminalarm-table-header">
            <div className="adminalarm-table-info">
              총 <b>1</b>건
            </div>
          </div>

          <table className="adminalarm-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>송신자</th>
                <th>수신자</th>
                <th>수신자타입</th>
                <th>알림타입</th>
                <th>전송시간</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>홍길동</td>
                <td>영희</td>
                <td>일반사용자</td>
                <td>네고</td>
                <td>2025-11-21 10:21</td>
                <td><button className="adminalarm-direct-btn">페이지 이동</button></td>
              </tr>
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
        </div>
      </div>
    </div>
  );
};

export default AdminAlarm;
