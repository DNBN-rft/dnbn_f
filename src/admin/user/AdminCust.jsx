import { useState, useEffect, useCallback } from "react";
import "./css/admincust.css";
import CustInfoModal from "./modal/CustInfoModal";
import { getCusts, getCustDetail, updateCust, deleteCusts, searchCusts } from "../../utils/adminCustService";
import { formatDate } from "../../utils/commonService";

const AdminCust = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [searchType, setSearchType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [custStatus, setCustStatus] = useState("all");
  const [loginType, setLoginType] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // 고객 목록 조회
  const fetchCustomers = useCallback(async (pageNum = 0) => {
  try {
    setLoading(true);
    setError(null);
    
    const data = await getCusts(pageNum, pageSize);
    
    setCustomers(data.content);
    setTotalElements(data.totalElements);
    setTotalPages(data.totalPages);
    setCurrentPage(pageNum);
  } catch (err) {
    setError(err.message || "고객 목록을 불러오는데 실패했습니다.");
    console.error("고객 목록 조회 오류:", err);
  } finally {
    setLoading(false);
  }
}, [pageSize]);


useEffect(() => {
  fetchCustomers(0);
}, [fetchCustomers]);

  const handleDetailClick = async (customer) => {
    try {
      setLoading(true);
      const detailData = await getCustDetail(customer.custCode);
      setSelectedCustomer(detailData);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
      console.error("고객 상세 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleUpdateCustomer = async (updatedData) => {
    try {
      setLoading(true);
      
      // 필수 필드 검증
      if (!updatedData.custGender) {
        alert("성별이 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      const modRequest = {
        custNm: updatedData.custNm || "",
        custGender: updatedData.custGender,
        custBirthYear: updatedData.custBirthYear || "",
        custTelNo: updatedData.custTelNo || "",
        custState: updatedData.custState || "ACTIVE",
        custMenuAuth: updatedData.custMenuAuth || "",
      };
            
      await updateCust(selectedCustomer.custCode, modRequest);
      setIsModalOpen(false);
      setSelectedCustomer(null);
      await fetchCustomers(currentPage);
      alert("고객 정보가 수정되었습니다.");
    } catch (err) {
      setError(err.message);
      alert("고객 정보 수정 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = (custCode) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(custCode)) {
      newSelectedIds.delete(custCode);
    } else {
      newSelectedIds.add(custCode);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(customers.map(c => c.custCode));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleDeleteCustomers = async () => {
    if (selectedIds.size === 0) {
      alert("삭제할 고객을 선택해주세요.");
      return;
    }

    if (!window.confirm(`선택된 ${selectedIds.size}명의 고객을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteCusts(Array.from(selectedIds));
      setSelectedIds(new Set());
      await fetchCustomers(0);
      alert("고객이 삭제되었습니다.");
    } catch (err) {
      setError(err.message);
      alert("고객 삭제 실패: " + err.message);
      console.error("고객 삭제 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsSearching(true);

      const searchParams = {
        custState: custStatus === "all" ? null : custStatus,
        loginType: loginType === "all" ? null : loginType,
        searchType: searchType === "all" ? "all" : searchType,
        searchTerm: searchTerm.trim(),
      };

      const results = await searchCusts(searchParams);
      setCustomers(results);
      setTotalElements(results.length);
      setTotalPages(1);
      setCurrentPage(0);
    } catch (err) {
      setError(err.message);
      alert("검색 실패: " + err.message);
      console.error("검색 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = async () => {
    setSearchTerm("");
    setSearchType("all");
    setCustStatus("all");
    setLoginType("all");
    setIsSearching(false);
    setSelectedIds(new Set());
    await fetchCustomers(0);
  };



  return (
    <div className="admincust-container">
      <div className="admincust-wrap">
        {error && <div className="admincust-error-message">{error}</div>}

        <div className="admincust-filter-wrap">
          <div className="admincust-filter-row">
            <div className="admincust-filter-group">
              <label htmlFor="cust-status">회원 상태</label>
              <select
                name="cust-status"
                id="cust-status"
                className="admincust-select"
                value={custStatus}
                onChange={(e) => setCustStatus(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="ACTIVE">활성</option>
                <option value="WITHDRAWAL">탈퇴</option>
                <option value="SUSPENDED">정지</option>
              </select>
            </div>

            <div className="admincust-filter-group">
              <label htmlFor="login-type">로그인 타입</label>
              <select
                name="login-type"
                id="login-type"
                className="admincust-select"
                value={loginType}
                onChange={(e) => setLoginType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="kakao">카카오</option>
                <option value="naver">네이버</option>
              </select>
            </div>
          </div>

          <div className="admincust-filter-row admincust-search-row">
            <div className="admincust-search-group">
              <select
                name="search-type"
                id="search-type"
                className="admincust-select-type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="custcode">사용자코드</option>
                <option value="custnm">이름</option>
                <option value="custtelno">연락처</option>
              </select>
              <input
                type="text"
                className="admincust-input"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="admincust-search-btn" onClick={handleSearch}>검색</button>
              {isSearching && (
                <button className="admincust-search-btn admincust-search-reset" onClick={handleResetSearch}>
                  초기화
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="admincust-table-wrap">
          <div className="admincust-table-header">
            <div className="admincust-table-info">
              총 <span className="admincust-count">{totalElements}</span>건
            </div>
            {selectedIds.size > 0 && (
              <button className="admincust-btn admincust-btn-delete" onClick={handleDeleteCustomers}>
                삭제 ({selectedIds.size})
              </button>
            )}
          </div>

          {loading ? (
            <div className="admincust-loading">로딩 중...</div>
          ) : (
            <table className="admincust-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === customers.length && customers.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>번호</th>
                  <th>아이디</th>
                  <th>사용자코드</th>
                  <th>이름</th>
                  <th>연락처</th>
                  <th>로그인 타입</th>
                  <th>가입일</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer, index) => {
                    const getStatusClass = (status) => {
                      if (status === "ACTIVE") return "admincust-status-active";
                      if (status === "SUSPENDED") return "admincust-status-suspended";
                      if (status === "WITHDRAWAL") return "admincust-status-withdrawal";
                      return "";
                    };

                    const getStatusLabel = (status) => {
                      if (status === "ACTIVE") return "활성";
                      if (status === "SUSPENDED") return "정지";
                      if (status === "WITHDRAWAL") return "탈퇴";
                      return status;
                    };

                    return (
                      <tr key={customer.custCode}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(customer.custCode)}
                            onChange={() => handleSelectCustomer(customer.custCode)}
                          />
                        </td>
                        <td>{currentPage * pageSize + index + 1}</td>
                        <td>{customer.custSocialId || "-"}</td>
                        <td>{customer.custCode}</td>
                        <td>{customer.custNm}</td>
                        <td>{customer.custTelNo}</td>
                        <td>{customer.custLoginType}</td>
                        <td>{formatDate(customer.custSignInDate)}</td>
                        <td className={getStatusClass(customer.custState)}>
                          {getStatusLabel(customer.custState)}
                        </td>
                        <td>
                          <button
                            className="admincust-btn admincust-btn-detail"
                            onClick={() => handleDetailClick(customer)}
                          >
                            상세
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="admincust-no-data">
                      고객 정보가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <div className="admincust-pagination">
            <button
              className="admincust-pagination-btn"
              onClick={() => {
                if (currentPage > 0) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  isSearching ? handleSearch() : fetchCustomers(newPage);
                }
              }}
              disabled={currentPage === 0}
            >
              이전
            </button>
            <div className="admincust-pagination-numbers">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`admincust-page-number ${currentPage === index ? "admincust-page-active" : ""}`}
                  onClick={() => {
                    setCurrentPage(index);
                    isSearching ? handleSearch() : fetchCustomers(index);
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              className="admincust-pagination-btn"
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  isSearching ? handleSearch() : fetchCustomers(newPage);
                }
              }}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedCustomer && (
        <CustInfoModal
          customerData={selectedCustomer}
          onClose={handleCloseModal}
          onUpdate={handleUpdateCustomer}
        />
      )}
    </div>
  );
};

export default AdminCust;