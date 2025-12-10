import { useState } from "react";
import "./css/adminemp.css";
import AdminEmpPw from "./modal/AdminEmpPw";

const AdminEmp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="adminemp-container">
      <div className="adminemp-wrap">
        <div className="adminemp-filter-wrap">
          <div className="adminemp-filter-row">
            <div className="adminemp-filter-group">
              <label htmlFor="emp-status">상태</label>
              <select
                name="emp-status"
                id="emp-status"
                className="adminemp-select"
              >
                <option value="statusall">전체</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
          </div>

          <div className="adminemp-filter-row adminemp-search-row">
            <div className="adminemp-search-group">
              <select name="type" id="type" className="adminemp-select-type">
                <option value="typeall">전체</option>
                <option value="name">이름</option>
                <option value="id">아이디</option>
              </select>
              <input
                type="text"
                className="adminemp-input"
                placeholder="검색어를 입력하세요"
              />
              <button className="adminemp-search-btn">검색</button>
            </div>
          </div>
        </div>

        <div className="adminemp-table-wrap">
          <div className="adminemp-table-header">
            <div className="adminemp-table-info">
              총 <b>1</b>명
            </div>
          </div>

          <table className="adminemp-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>이름</th>
                <th>권한</th>
                <th>아이디</th>
                <th>비밀번호</th>
                <th>등록일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>홍길동</td>
                <td>관리자</td>
                <td>hong123</td>
                <td>
                  <button 
                    className="adminemp-pw-btn"
                    onClick={() => handleOpenModal({ name: "홍길동", id: "hong123" })}
                  >
                    비밀번호 변경
                  </button>
                </td>
                <td>2024-06-15</td>
                <td>활성</td>
              </tr>
            </tbody>
          </table>

          <div className="adminemp-pagination">
            <button className="adminemp-pagination-btn">이전</button>
            <div className="adminemp-pagination-numbers">
              <button className="adminemp-page-number adminemp-page-active">
                1
              </button>
              <button className="adminemp-page-number">2</button>
              <button className="adminemp-page-number">3</button>
            </div>
            <button className="adminemp-pagination-btn">다음</button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedEmployee && (
        <AdminEmpPw
          onClose={handleCloseModal}
          employeeName={selectedEmployee.name}
          employeeId={selectedEmployee.id}
        />
      )}
    </div>
  );
};

export default AdminEmp;
