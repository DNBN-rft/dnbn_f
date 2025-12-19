import "./css/employeemanage.css";
import {useEffect, useState} from "react";
import EmployeeRegisterModal from "./modal/EmployeeRegisterModal";
import EmployeeModModal from "./modal/EmployeeModModal";

const EmployeeManage = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModModalOpen, setIsModModalOpen] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [lastModified, setLastModified] = useState(new Date());

  // 직원 데이터 새로고침 함수
  const fetchMemberData = async () => {
    try {
      const userInfo = localStorage.getItem("user");
      const storeCode = JSON.parse(userInfo).storeCode;

      const response = await fetch (`http://localhost:8080/api/store/member/view/${storeCode}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("네트워크 응답에 문제가 있습니다.");
      }
      const data = await response.json();
      setMemberData(data);
      setLastModified(new Date());
    } catch (error) {
      console.error("직원 데이터 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  // 등록 모달 열기
  const handleRegister = () => {
    setSelectedMember(null);
    setIsRegisterModalOpen(true);
  };

  // 수정 모달 열기
  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsModModalOpen(true);
  };

  // 삭제 처리
  const handleDelete = async (member) => {
    if (!window.confirm(`${member.memberNm} 직원을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/store/member/${member.memberId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("직원이 성공적으로 삭제되었습니다.");
        await fetchMemberData();
      } else {
        const errorText = await response.text();
        alert(`삭제 실패: ${errorText}`);
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("직원 삭제 중 오류가 발생했습니다.");
    }
  };

  // 권한 정보를 한글로 변환
  const formatAuthInfo = (authString) => {
    if (!authString) return "-";
    
    const authLabels = {
      "ROLE_PRODUCT": "상품관리",
      "ROLE_ORDER": "매출목록",
      "ROLE_REVIEW": "리뷰관리",
      "ROLE_EMPLOYEE": "직원관리",
      "ROLE_SALE": "할인목록",
      "ROLE_SERVICE": "공지사항",
      "ROLE_ALL": "전체권한"
    };
    
    try {
      // 쉼표로 구분된 문자열을 배열로 변환
      const authArray = authString.split(",").map(auth => auth.trim());
      const activeAuth = authArray
        .map(auth => authLabels[auth] || auth)
        .filter(Boolean);
      
      return activeAuth.length > 0 ? activeAuth.join(", ") : "권한 없음";
    } catch (error) {
      console.error("권한 파싱 오류:", error);
      return "-";
    }
  };

  // 직원 타입을 한글로 변환
  const formatMemberType = (memberType) => {
    const typeLabels = {
      "OWNER": "점주",
      "MANAGER": "매니저"
    };
    
    return typeLabels[memberType] || memberType;
  };

  // 직원 통계 계산
  const ownerCount = memberData.filter(m => m.memberType === "OWNER").length;
  const managerCount = memberData.filter(m => m.memberType === "MANAGER").length;

  // 최대 3명까지 카드 배열 생성 (기존 직원 + 빈 슬롯)
  const maxEmployees = 3;
  const emptySlots = maxEmployees - memberData.length;
  const allCards = [...memberData];
  
  // 빈 슬롯 추가
  for (let i = 0; i < emptySlots; i++) {
    allCards.push({ isEmpty: true, slotIndex: i });
  }

  return (
    <div className="empmanage-wrap">
      <div className="empmanage-header">
        <div className="empmanage-header-title">직원관리</div>
      </div>

      <div className="empmanage-card-container">
        {allCards.map((p, idx) => {
          // 빈 슬롯인 경우
          if (p.isEmpty) {
            return (
              <div 
                key={`empty-${p.slotIndex}`} 
                className="empmanage-card empmanage-card-empty"
                onClick={handleRegister}
              >
                <div className="empmanage-card-empty-content">
                  <div className="empmanage-card-empty-icon">+</div>
                  <div className="empmanage-card-empty-text">직원 등록</div>
                </div>
              </div>
            );
          }
          
          // 기존 직원 카드
          return (
            <div key={p.memberIdx} className="empmanage-card">
              <div className="empmanage-card-header">
                <div className="empmanage-card-name">{p.memberNm}</div>
                <div className="empmanage-card-type">{formatMemberType(p.memberType)}</div>
              </div>
              <div className="empmanage-card-body">
                <div className="empmanage-card-info">{p.memberTelNo}</div>
                <div className="empmanage-card-info">{p.memberId}</div>
                <div className="empmanage-card-auth">{formatAuthInfo(p.memberAuth)}</div>
              </div>
              {p.memberType !== "OWNER" && (
                <div className="empmanage-card-footer">
                  <button
                    className="empmanage-card-btn"
                    onClick={() => handleEdit(p)}
                  >정보수정</button>
                  <button 
                    className="empmanage-card-btn"
                    onClick={() => handleDelete(p)}
                  >삭제</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="empmanage-summary-section">
        <div className="empmanage-summary-box">
          <div className="empmanage-summary-title">직원 현황 요약</div>
          <div className="empmanage-summary-content">
            <div className="empmanage-summary-item">
              <span className="empmanage-summary-label">현재 등록된 직원:</span>
              <span className="empmanage-summary-value">{memberData.length}명 / 최대 3명</span>
            </div>
            <div className="empmanage-summary-item">
              <span className="empmanage-summary-label">점주:</span>
              <span className="empmanage-summary-value">{ownerCount}명</span>
              <span className="empmanage-summary-separator">|</span>
              <span className="empmanage-summary-label">매니저:</span>
              <span className="empmanage-summary-value">{managerCount}명</span>
            </div>
          </div>
        </div>

        <div className="empmanage-tips-box">
          <div className="empmanage-tips-title">직원 관리 팁</div>
          <div className="empmanage-tips-content">
            <div className="empmanage-tips-section">
              <div className="empmanage-tips-subtitle">권한 별 기능 요약</div>
              <ul className="empmanage-tips-list">
                <li>직원은 점주 포함 최대 3명까지 등록할 수 있습니다.</li>
                <li>매니저는 점주가 부여한 권한 내에서만 메뉴 접근이 가능합니다.</li>
                <li>직원 삭제 시 즉시 시스템에서 제외됩니다.</li>
                <li>점주 계정은 수정 및 삭제가 불가능합니다.</li>
              </ul>
            </div>
            <div className="empmanage-tips-section">
              <div className="empmanage-tips-subtitle">권한 설명</div>
              <ul className="empmanage-tips-list">
                <li>상품관리: 상품 등록, 수정, 삭제 권한</li>
                <li>매출목록: 주문 내역 및 매출 통계 조회 권한</li>
                <li>리뷰관리: 고객 리뷰 조회 및 답변 권한</li>
                <li>직원관리: 직원 등록 및 관리 권한</li>
                <li>할인목록: 할인 및 쿠폰 관리 권한</li>
                <li>공지사항: 고객 문의 및 공지사항 관리 권한</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="empmanage-modal-wrap">
        
        {/* 등록 모달 */}
        {isRegisterModalOpen && (
          <EmployeeRegisterModal
            onClose={() => setIsRegisterModalOpen(false)}
            refreshData={fetchMemberData}
          />
        )}

        {/* 수정 모달 */}
        {isModModalOpen && selectedMember && (
          <EmployeeModModal
            onClose={() => setIsModModalOpen(false)}
            member={selectedMember}
            refreshData={fetchMemberData}
          />
        )}
      </div>
    </div>
  );
}

export default EmployeeManage;
