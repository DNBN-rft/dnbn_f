import { useState, useEffect } from "react";
import "./css/adminemp.css";
import AdminEmpPw from "./modal/AdminEmpPw";
import AdminEmpRegister from "./modal/AdminEmpRegister";
import {
  getEmployeeList,
  changeEmployeeStatus,
  deleteEmployeeList,
  searchEmployees,
} from "../../utils/adminEmployeeService";

const AdminEmp = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 검색 여부 플래그
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 필터 상태
  const [filters, setFilters] = useState({
    empState: "",
    searchType: "all",
    searchTerm: "",
  });

  // 직원 목록 불러오기
  useEffect(() => {
    loadEmployeeList();
  }, []);

  const loadEmployeeList = async (page = 0) => {
    const result = await getEmployeeList(page, pageSize);
    if (result.success) {
      setEmployeeList(result.data.content);
      setCurrentPage(result.data.number);
      setTotalPages(result.data.totalPages);
      setTotalElements(result.data.totalElements);
      setIsSearchMode(false);
    }
  };

  // 검색 내부 함수
  const handleSearchInternal = async (page = 0) => {
    const searchParams = {
      empState: filters.empState === "statusall" ? "" : filters.empState,
      searchType:
        filters.searchType === "all"
          ? "all"
          : filters.searchType === "name"
          ? "employeenm"
          : filters.searchType === "id"
          ? "employeeid"
          : "all",
      searchTerm: filters.searchTerm,
    };

    const result = await searchEmployees(searchParams, page, pageSize);
    if (result.success) {
      setEmployeeList(result.data.content);
      setCurrentPage(result.data.number);
      setTotalPages(result.data.totalPages);
      setTotalElements(result.data.totalElements);
      setIsSearchMode(true);
    } else {
      alert(result.error);
    }
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setCurrentPage(0);
    handleSearchInternal(0);
  };

  // 필터 초기화
  const handleReset = () => {
    setFilters({
      empState: "",
      searchType: "all",
      searchTerm: "",
    });
    setCurrentPage(0);
    loadEmployeeList(0);
  };

  const handleOpenPasswordModal = (employee) => {
    setSelectedEmployee(employee);
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegisterSuccess = () => {
    if (isSearchMode) {
      handleSearchInternal(currentPage);
    } else {
      loadEmployeeList(currentPage);
    }
    handleCloseRegisterModal();
  };

  const handlePasswordChangeSuccess = () => {
    handleClosePasswordModal();
  };

  const handleStatusChange = async (employeeId, newStatus) => {
    if (
      window.confirm(
        `직원 상태를 ${getStatusText(newStatus)}(으)로 변경하시겠습니까?`
      )
    ) {
      try {
        await changeEmployeeStatus({
          empId: employeeId,
          empState: newStatus,
        });
        alert("상태가 성공적으로 변경되었습니다.");
        if (isSearchMode) {
          handleSearchInternal(currentPage);
        } else {
          loadEmployeeList(currentPage);
        }
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert(error.message || "상태 변경에 실패했습니다.");
      }
    }
  };

  const handleDeleteClick = () => {
    if (!isDeleteMode) {
      // 삭제 모드 활성화
      setIsDeleteMode(true);
      setSelectedEmployees([]);
    } else {
      // 삭제 실행
      if (selectedEmployees.length === 0) {
        alert("삭제할 직원을 선택해주세요.");
        return;
      }

      if (
        !window.confirm(
          `선택한 ${selectedEmployees.length}명의 직원을 삭제하시겠습니까?`
        )
      ) {
        return;
      }

      deleteEmployees();
    }
  };

  const deleteEmployees = async () => {
    const result = await deleteEmployeeList(
      {
        empIdList: selectedEmployees,
      },
      currentPage,
      pageSize
    );

    if (result.success) {
      alert("성공적으로 직원을 삭제하였습니다.");
      setSelectedEmployees([]);
      setIsDeleteMode(false);
      if (isSearchMode) {
        handleSearchInternal(currentPage);
      } else {
        loadEmployeeList(currentPage);
      }
    } else {
      alert(result.error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteMode(false);
    setSelectedEmployees([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmployees(employeeList.map((emp) => emp.employeeId));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  // 상태 텍스트 변환
  const getStatusText = (state) => {
    switch (state) {
      case "ACTIVE":
        return "재직";
      case "SUSPENDED":
        return "휴직";
      case "WITHDRWAL":
        return "퇴직";
      default:
        return state;
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
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
                value={filters.empState}
                onChange={(e) =>
                  setFilters({ ...filters, empState: e.target.value })
                }
              >
                <option value="">전체</option>
                <option value="ACTIVE">재직</option>
                <option value="SUSPENDED">휴직</option>
                <option value="WITHDRWAL">퇴직</option>
              </select>
            </div>
          </div>

          <div className="adminemp-filter-row adminemp-search-row">
            <div className="adminemp-search-group">
              <select
                name="type"
                id="type"
                className="adminemp-select-type"
                value={filters.searchType}
                onChange={(e) =>
                  setFilters({ ...filters, searchType: e.target.value })
                }
              >
                <option value="all">전체</option>
                <option value="name">이름</option>
                <option value="id">아이디</option>
              </select>
              <input
                type="text"
                className="adminemp-input"
                placeholder="검색어를 입력하세요"
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
              />
              <button className="adminemp-search-btn" onClick={handleSearch}>
                검색
              </button>
              <button className="adminemp-search-btn" onClick={handleReset}>
                초기화
              </button>
            </div>
          </div>
        </div>

        <div className="adminemp-table-wrap">
          <div className="adminemp-table-header">
            <div className="adminemp-table-info">
              총 <b>{totalElements}</b>명
            </div>

            <div className="adminemp-table-btn-group">
              {isDeleteMode ? (
                <>
                  <button
                    className="adminemp-confirm-btn"
                    onClick={handleDeleteClick}
                  >
                    확인
                  </button>
                  <button
                    className="adminemp-cancel-btn"
                    onClick={handleCancelDelete}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="adminemp-register-btn"
                    onClick={handleOpenRegisterModal}
                  >
                    직원 등록
                  </button>
                  <button
                    className="adminemp-delete-btn"
                    onClick={handleDeleteClick}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>

          <table className="adminemp-table">
            <thead>
              <tr>
                {isDeleteMode && (
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedEmployees.length === employeeList.length &&
                        employeeList.length > 0
                      }
                    />
                  </th>
                )}
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
              {employeeList.length === 0 ? (
                <tr>
                  <td
                    colSpan={isDeleteMode ? "8" : "7"}
                    className="adminemp-no-data"
                  >
                    등록된 직원이 없습니다.
                  </td>
                </tr>
              ) : (
                employeeList.map((employee, index) => (
                  <tr key={employee.employeeId}>
                    {isDeleteMode && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(
                            employee.employeeId
                          )}
                          onChange={() =>
                            handleSelectEmployee(employee.employeeId)
                          }
                        />
                      </td>
                    )}
                    <td>{currentPage * pageSize + index + 1}</td>
                    <td>{employee.employeeNm}</td>
                    <td>{employee.authNm}</td>
                    <td>{employee.employeeId}</td>
                    <td>
                      <button
                        className="adminemp-pw-btn"
                        onClick={() => handleOpenPasswordModal(employee)}
                      >
                        비밀번호 변경
                      </button>
                    </td>
                    <td>{formatDate(employee.empRegDate)}</td>
                    <td>
                      <select
                        className={`adminemp-status-select adminemp-status-${employee.empState.toLowerCase()}`}
                        value={employee.empState}
                        onChange={(e) =>
                          handleStatusChange(
                            employee.employeeId,
                            e.target.value
                          )
                        }
                      >
                        <option value="ACTIVE">재직</option>
                        <option value="SUSPENDED">휴직</option>
                        <option value="WITHDRWAL">퇴직</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="adminemp-pagination">
            <button
              className="adminemp-pagination-btn"
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  isSearchMode
                    ? handleSearchInternal(newPage)
                    : loadEmployeeList(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`adminemp-pagination-btn ${
                  currentPage === index ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentPage(index);
                  isSearchMode
                    ? handleSearchInternal(index)
                    : loadEmployeeList(index);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="adminemp-pagination-btn"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  isSearchMode
                    ? handleSearchInternal(newPage)
                    : loadEmployeeList(newPage);
                }
              }}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {isPasswordModalOpen && selectedEmployee && (
        <AdminEmpPw
          onClose={handleClosePasswordModal}
          employeeName={selectedEmployee.employeeNm}
          employeeId={selectedEmployee.employeeId}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}

      {isRegisterModalOpen && (
        <AdminEmpRegister
          onClose={handleCloseRegisterModal}
          onSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
};

export default AdminEmp;
