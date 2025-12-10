import { useState } from "react";
import "./css/admincust.css";
import CustInfoModal from "./modal/CustInfoModal";

// Mock 권한 데이터
const mockAuthList = [
  {
    id: "auth-001",
    name: "사용자 기본 권한",
    description: "일반 사용자용 기본 권한입니다.",
    menus: [
      "store-membership",
      "store-mypage",
      "store-order",
      "store-product",
      "store-review",
      "store-notice",
      "store-question"
    ]
  },
  {
    id: "auth-002",
    name: "프리미엄 사용자",
    description: "프리미엄 기능을 사용할 수 있는 사용자 권한입니다.",
    menus: [
      "store-membership",
      "store-mypage",
      "store-order",
      "store-negotiation",
      "store-static",
      "store-product",
      "store-sale",
      "store-review",
      "store-employee",
      "store-notice",
      "store-question",
      "store-subscription"
    ]
  },
  {
    id: "auth-003",
    name: "관리자",
    description: "모든 관리 기능에 접근할 수 있는 관리자 권한입니다.",
    menus: [
      "admin-main",
      "admin-manager",
      "admin-user",
      "admin-store",
      "admin-product",
      "admin-review",
      "admin-employee",
      "admin-notice",
      "admin-question",
      "admin-report",
      "admin-alarm",
      "admin-push",
      "admin-category",
      "admin-region",
      "admin-plan",
      "admin-accept",
      "admin-auth",
      "admin-category-manage"
    ]
  }
];

// Mock 고객 데이터
const mockCustomerData = [
  {
    id: 1,
    userId: "user123",
    userName: "홍길동",
    phone: "010-1234-5678",
    email: "hong@example.com",
    loginType: "카카오",
    joinDate: "2023-01-15",
    status: "정지",
    socialId: "kakao_123456",
    gender: "남",
    birthYear: "1990",
    userCode: "UC001",
    authId: "auth-001",
    accessibleMenus: [
      "store-membership",
      "store-mypage",
      "store-order",
      "store-product"
    ]
  },
  {
    id: 2,
    userId: "user456",
    userName: "김철수",
    phone: "010-2345-6789",
    email: "kim@example.com",
    loginType: "카카오",
    joinDate: "2023-02-20",
    status: "활성",
    socialId: "kakao_789012",
    gender: "남",
    birthYear: "1985",
    userCode: "UC002",
    authId: "auth-002",
    accessibleMenus: [
      "store-membership",
      "store-mypage",
      "store-order",
      "store-negotiation",
      "store-static",
      "store-product",
      "store-sale",
      "store-review"
    ]
  },
  {
    id: 3,
    userId: "user789",
    userName: "이영희",
    phone: "010-3456-7890",
    email: "lee@example.com",
    loginType: "네이버",
    joinDate: "2023-03-10",
    status: "휴면",
    socialId: "naver_345678",
    gender: "여",
    birthYear: "1995",
    userCode: "UC003",
    authId: "auth-003",
    accessibleMenus: [
      "admin-main",
      "admin-user",
      "admin-store",
      "admin-product",
      "admin-notice",
      "admin-question"
    ]
  },
];

const AdminCust = () => {
  const [searchType, setSearchType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleDetailClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleUpdateCustomer = (updatedData) => {
    console.log("고객 정보 업데이트:", updatedData);
    // 실제 업데이트 로직 구현
  };

  return (
    <div className="admincust-container">
      <div className="admincust-wrap">
        <div className="admincust-filter-wrap">
          <div className="admincust-filter-row">
            <div className="admincust-filter-group">
              <label htmlFor="cust-status">회원 상태</label>
              <select
                name="cust-status"
                id="cust-status"
                className="admincust-select"
              >
                <option value="all">전체</option>
                <option value="active">활성</option>
                <option value="dormant">휴면</option>
                <option value="suspended">정지</option>
              </select>
            </div>

            <div className="admincust-filter-group">
              <label htmlFor="login-type">로그인 타입</label>
              <select
                name="login-type"
                id="login-type"
                className="admincust-select"
              >
                <option value="all">전체</option>
                <option value="normal">일반</option>
                <option value="kakao">카카오</option>
                <option value="naver">네이버</option>
                <option value="google">구글</option>
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
                <option value="userId">아이디</option>
                <option value="userName">이름</option>
                <option value="phone">연락처</option>
                <option value="email">이메일</option>
              </select>
              <input
                type="text"
                className="admincust-input"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="admincust-search-btn">검색</button>
            </div>
          </div>
        </div>

        <div className="admincust-table-wrap">
          <div className="admincust-table-header">
            <div className="admincust-table-info">
              총 <span className="admincust-count">{mockCustomerData.length}</span>건
            </div>
          </div>

          <table className="admincust-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>아이디</th>
                <th>사용자코드</th>
                <th>이름</th>
                <th>연락처</th>
                <th>이메일</th>
                <th>로그인 타입</th>
                <th>가입일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomerData.map((customer) => {
                const getStatusClass = () => {
                  if (customer.status === "활성") return "admincust-status-active";
                  if (customer.status === "정지") return "admincust-status-suspended";
                  return "";
                };

                return (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.userId}</td>
                    <td>{customer.userCode}</td>
                    <td>{customer.userName}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.loginType}</td>
                    <td>{customer.joinDate}</td>
                    <td className={getStatusClass()}>
                      {customer.status}
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
              })}
            </tbody>
          </table>

          <div className="admincust-pagination">
            <button className="admincust-pagination-btn">이전</button>
            <div className="admincust-pagination-numbers">
              <button className="admincust-page-number admincust-page-active">
                1
              </button>
              <button className="admincust-page-number">2</button>
              <button className="admincust-page-number">3</button>
            </div>
            <button className="admincust-pagination-btn">다음</button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedCustomer && (
        <CustInfoModal
          customerData={selectedCustomer}
          authList={mockAuthList}
          onClose={handleCloseModal}
          onUpdate={handleUpdateCustomer}
        />
      )}
    </div>
  );
};

export default AdminCust;
