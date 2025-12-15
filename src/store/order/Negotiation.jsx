import { useState } from "react";
import "./css/negotiation.css";

const Negotiation = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchField, setSearchField] = useState("판매번호");
    const [searchText, setSearchText] = useState("");
    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setSearchField("판매번호");
        setSearchText("");
    }

  return (
  <div className="nego-wrap">

    <div className="nego-header">
        <div className="nego-header-title">네고목록</div>
    </div>

    <div className="nego-filter">
        <div className="nego-date-range">
          <div className="nego-date-range-inner">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="nego-date-input"
            />
            <span className="nego-date-sep">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="nego-date-input"
            />
          </div>
          <div className="nego-recent-btn-group">
            <button type="button" className="nego-recent-btn">
              최근 1개월
            </button>
            <button type="button" className="nego-recent-btn">
              최근 3개월
            </button>
            <button type="button" className="nego-recent-btn">
              최근 6개월
            </button>
            <button type="button" className="nego-recent-btn">
              최근 12개월
            </button>
          </div>
        </div>
        <div className="nego-search">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="nego-search-select"
          >
            <option>판매번호</option>
            <option>상품명</option>
            <option>상품코드</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="nego-search-input"
          />
          <div className="nego-search-btn">
            <button className="nego-btn">검색</button>
            <button className="nego-btn" onClick={handleReset}>
              초기화
            </button>
          </div>
        </div>
      </div>

    <div>
        <table className="nego-table">
            <thead>
                <tr>
                    <th className="nego-th1">번호</th>
                    <th className="nego-th2">상품명</th>
                    <th className="nego-th3">구매자 성명</th>
                    <th className="nego-th4">구매자 연락처</th>
                    <th className="nego-th5">기존가격</th>
                    <th className="nego-th6">네고가격</th>
                    <th className="nego-th7">상태</th>
                    <th className="nego-th8">신청일</th>
                    <th className="nego-th9">처리일</th>
                    <th className="nego-th10">승인여부</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="nego-td1">1</td>
                    <td className="nego-td2">상품A</td>
                    <td className="nego-td3">길동친구</td>
                    <td className="nego-td4">010-1234-5678</td>
                    <td className="nego-td5">100,000원</td>
                    <td className="nego-td6">90,000원</td>
                    <td className="nego-td7">승인</td>
                    <td className="nego-td8">2024-01-10</td>
                    <td className="nego-td9">2024-01-12</td>
                    <td className="nego-td10">
                        <button className="nego-confirm-btn">승인</button>
                        <button className="nego-reject-btn">거절</button>
                    </td>
                </tr>
                <tr>
                    <td className="nego-td1">2</td>
                    <td className="nego-td2">상품B</td>
                    <td className="nego-td3">영희</td>
                    <td className="nego-td4">010-5678-1234</td>
                    <td className="nego-td5">200,000원</td>
                    <td className="nego-td6">180,000원</td>
                    <td className="nego-td7">대기</td>
                    <td className="nego-td8">2024-01-11</td>
                    <td className="nego-td9">처리 대기중</td>
                    <td className="nego-td10">
                        <button className="nego-confirm-btn">승인</button>
                        <button className="nego-reject-btn">거절</button>
                    </td>
                </tr>
                <tr>
                    <td className="nego-td1">3</td>
                    <td className="nego-td2">상품B</td>
                    <td className="nego-td3">영희</td>
                    <td className="nego-td4">010-5678-1234</td>
                    <td className="nego-td5">200,000원</td>
                    <td className="nego-td6">180,000원</td>
                    <td className="nego-td7">거절</td>
                    <td className="nego-td8">2024-01-11</td>
                    <td className="nego-td9">-</td>
                    <td className="nego-td10">
                        <button className="nego-confirm-btn">승인</button>
                        <button className="nego-reject-btn">거절</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    {/* 페이지네이션 */}
        <div className="nego-footer">
          <div className="nego-footer-left">전체 30개 상품 중 1-10개 표시</div>
          <div className="nego-pagination">
            <button className="nego-page">이전</button>
            <button className="nego-page active">1</button>
            <button className="nego-page">2</button>
            <button className="nego-page">3</button>
            <button className="nego-page">다음</button>
          </div>
        </div>
  </div>
  );
};

export default Negotiation;