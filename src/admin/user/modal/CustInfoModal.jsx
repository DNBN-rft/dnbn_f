import { useState } from "react";
import "./css/custinfomodal.css";

const CustInfoModal = ({ customerData, onClose, onUpdate, authList = [] }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    socialId: customerData?.socialId || "",
    loginType: customerData?.loginType || "카카오",
    userName: customerData?.userName || "",
    gender: customerData?.gender || "남",
    birthYear: customerData?.birthYear || "",
    userCode: customerData?.userCode || "",
    phone: customerData?.phone || "",
    joinDate: customerData?.joinDate || "",
    status: customerData?.status || "활성",
  });

  // 권한 관련 상태
  const [selectedAuthId, setSelectedAuthId] = useState(customerData?.authId || "");
  const [selectedMenus, setSelectedMenus] = useState(customerData?.accessibleMenus || []);

  // 선택된 권한의 메뉴 목록 가져오기
  const getAvailableMenus = () => {
    if (!selectedAuthId) return [];
    const auth = authList.find(a => a.id === selectedAuthId);
    return auth?.menus || [];
  };

  // 선택된 권한 정보 가져오기
  const getSelectedAuth = () => {
    if (!selectedAuthId) return null;
    return authList.find(a => a.id === selectedAuthId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 권한 선택 변경
  const handleAuthChange = (e) => {
    const newAuthId = e.target.value;
    setSelectedAuthId(newAuthId);
    
    // 권한 변경 시 해당 권한의 모든 메뉴를 선택된 상태로 초기화
    if (newAuthId) {
      const auth = authList.find(a => a.id === newAuthId);
      setSelectedMenus(auth?.menus || []);
    } else {
      setSelectedMenus([]);
    }
  };

  // 메뉴 토글 (권한에서 허용된 메뉴만 체크/해제 가능)
  const handleMenuToggle = (menuId) => {
    setSelectedMenus(prev => {
      if (prev.includes(menuId)) {
        return prev.filter(id => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (!selectedAuthId) {
      alert("권한을 선택해주세요.");
      return;
    }

    if (onUpdate) {
      onUpdate({
        ...formData,
        authId: selectedAuthId,
        accessibleMenus: selectedMenus
      });
    }
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      socialId: customerData?.socialId || "",
      loginType: customerData?.loginType || "카카오",
      userName: customerData?.userName || "",
      gender: customerData?.gender || "남",
      birthYear: customerData?.birthYear || "",
      userCode: customerData?.userCode || "",
      phone: customerData?.phone || "",
      joinDate: customerData?.joinDate || "",
      status: customerData?.status || "활성",
    });
    setSelectedAuthId(customerData?.authId || "");
    setSelectedMenus(customerData?.accessibleMenus || []);
    setIsEditMode(false);
  };

  return (
    <div className="custinfomodal-backdrop" onClick={onClose}>
      <div className="custinfomodal-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="custinfomodal-header">
          <h2 className="custinfomodal-title">고객 상세 정보</h2>
          <button className="custinfomodal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="custinfomodal-content">
          <section className="custinfomodal-section">
            <h3 className="custinfomodal-section-title">회원 정보</h3>
            <div className="custinfomodal-grid">
              <div className="custinfomodal-field">
                <label className="custinfomodal-label">소셜 아이디</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="socialId"
                    value={formData.socialId}
                    onChange={handleInputChange}
                    className="custinfomodal-input"
                    disabled
                  />
                ) : (
                  <span className="custinfomodal-value">{formData.socialId}</span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">로그인 타입</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="loginType"
                    value={formData.loginType}
                    className="custinfomodal-input"
                    disabled
                  />
                ) : (
                  <span className="custinfomodal-value">{formData.loginType}</span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">이름 / 성별</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="userName"
                    value={`${formData.userName} / ${formData.gender}`}
                    className="custinfomodal-input"
                    disabled
                  />
                ) : (
                  <span className="custinfomodal-value">
                    {formData.userName} / {formData.gender}
                  </span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">생년</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleInputChange}
                    className="custinfomodal-input"
                    placeholder="예: 1990"
                    disabled
                  />
                ) : (
                  <span className="custinfomodal-value">{formData.birthYear}</span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">사용자 코드</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="userCode"
                    value={formData.userCode}
                    onChange={handleInputChange}
                    className="custinfomodal-input"
                  />
                ) : (
                  <span className="custinfomodal-value">{formData.userCode}</span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">연락처</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="custinfomodal-input"
                  />
                ) : (
                  <span className="custinfomodal-value">{formData.phone}</span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">가입일</label>
                {isEditMode ? (
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className="custinfomodal-input"
                  />
                ) : (
                  <span className="custinfomodal-value">{formData.joinDate}</span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">상태</label>
                {isEditMode ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="custinfomodal-select"
                  >
                    <option value="활성">활성</option>
                    <option value="휴면">휴면</option>
                    <option value="정지">정지</option>
                  </select>
                ) : (
                  <span className="custinfomodal-value">{formData.status}</span>
                )}
              </div>
            </div>
          </section>

          <section className="custinfomodal-section">
            <h3 className="custinfomodal-section-title">권한 정보</h3>
            
            <div className="custinfomodal-auth-row">
              <div className="custinfomodal-auth-field">
                <label className="custinfomodal-label">권한명</label>
                {isEditMode ? (
                  <select
                    value={selectedAuthId}
                    onChange={handleAuthChange}
                    className="custinfomodal-select"
                  >
                    <option value="">권한을 선택하세요</option>
                    {authList.map(auth => (
                      <option key={auth.id} value={auth.id}>
                        {auth.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="custinfomodal-value">
                    {getSelectedAuth()?.name || "권한이 설정되지 않았습니다"}
                  </span>
                )}
              </div>

              {selectedAuthId && (
                <div className="custinfomodal-auth-field">
                  <label className="custinfomodal-label">권한 설명</label>
                  <span className="custinfomodal-value custinfomodal-auth-description">
                    {getSelectedAuth()?.description || "-"}
                  </span>
                </div>
              )}
            </div>

            {selectedAuthId && (
              <>

                <div className="custinfomodal-menu-section">
                  <h4 className="custinfomodal-menu-title">메뉴</h4>
                  {isEditMode ? (
                    <div className="custinfomodal-menu-grid">
                      {getAvailableMenus().map(menuId => {
                        // 메뉴 이름 매핑 (실제로는 authList에 메뉴 이름도 포함되어야 함)
                        const allMenus = [
                          { id: "admin-main", name: "관리자 메인" },
                          { id: "admin-manager", name: "관리자 관리" },
                          { id: "admin-user", name: "회원 관리" },
                          { id: "admin-store", name: "가게 정보" },
                          { id: "admin-product", name: "상품 관리" },
                          { id: "admin-review", name: "리뷰 관리" },
                          { id: "admin-employee", name: "직원 관리" },
                          { id: "admin-notice", name: "공지사항" },
                          { id: "admin-question", name: "문의 관리" },
                          { id: "admin-report", name: "신고 관리" },
                          { id: "admin-alarm", name: "알림 관리" },
                          { id: "admin-push", name: "푸시 알림" },
                          { id: "admin-category", name: "카테고리 관리" },
                          { id: "admin-region", name: "지역 관리" },
                          { id: "admin-plan", name: "요금제 관리" },
                          { id: "admin-accept", name: "가입 승인" },
                          { id: "admin-auth", name: "권한 관리" },
                          { id: "admin-category-manage", name: "카테고리 설정" },
                          { id: "store-membership", name: "멤버십 정보" },
                          { id: "store-mypage", name: "마이페이지" },
                          { id: "store-order", name: "주문 관리" },
                          { id: "store-negotiation", name: "흥정 관리" },
                          { id: "store-static", name: "주문 통계" },
                          { id: "store-product", name: "상품 관리" },
                          { id: "store-sale", name: "판매 관리" },
                          { id: "store-review", name: "리뷰 관리" },
                          { id: "store-employee", name: "직원 관리" },
                          { id: "store-notice", name: "공지사항" },
                          { id: "store-question", name: "문의하기" },
                          { id: "store-subscription", name: "구독 플랜" },
                        ];
                        const menu = allMenus.find(m => m.id === menuId);
                        if (!menu) return null;

                        return (
                          <label key={menuId} className="custinfomodal-checkbox-label">
                            <input 
                              type="checkbox"
                              checked={selectedMenus.includes(menuId)}
                              onChange={() => handleMenuToggle(menuId)}
                            />
                            <span>{menu.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="custinfomodal-permission-list">
                      {selectedMenus.length > 0 ? (
                        selectedMenus.map(menuId => {
                          const allMenus = [
                            { id: "admin-main", name: "관리자 메인" },
                            { id: "admin-manager", name: "관리자 관리" },
                            { id: "admin-user", name: "회원 관리" },
                            { id: "admin-store", name: "가게 정보" },
                            { id: "admin-product", name: "상품 관리" },
                            { id: "admin-review", name: "리뷰 관리" },
                            { id: "admin-employee", name: "직원 관리" },
                            { id: "admin-notice", name: "공지사항" },
                            { id: "admin-question", name: "문의 관리" },
                            { id: "admin-report", name: "신고 관리" },
                            { id: "admin-alarm", name: "알림 관리" },
                            { id: "admin-push", name: "푸시 알림" },
                            { id: "admin-category", name: "카테고리 관리" },
                            { id: "admin-region", name: "지역 관리" },
                            { id: "admin-plan", name: "요금제 관리" },
                            { id: "admin-accept", name: "가입 승인" },
                            { id: "admin-auth", name: "권한 관리" },
                            { id: "admin-category-manage", name: "카테고리 설정" },
                            { id: "store-membership", name: "멤버십 정보" },
                            { id: "store-mypage", name: "마이페이지" },
                            { id: "store-order", name: "주문 관리" },
                            { id: "store-negotiation", name: "흥정 관리" },
                            { id: "store-static", name: "주문 통계" },
                            { id: "store-product", name: "상품 관리" },
                            { id: "store-sale", name: "판매 관리" },
                            { id: "store-review", name: "리뷰 관리" },
                            { id: "store-employee", name: "직원 관리" },
                            { id: "store-notice", name: "공지사항" },
                            { id: "store-question", name: "문의하기" },
                            { id: "store-subscription", name: "구독 플랜" },
                          ];
                          const menu = allMenus.find(m => m.id === menuId);
                          if (!menu) return null;

                          return (
                            <span key={menuId} className="custinfomodal-permission-tag">
                              {menu.name}
                            </span>
                          );
                        })
                      ) : (
                        <span className="custinfomodal-no-permission">접근 가능한 메뉴가 없습니다</span>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>

        <div className="custinfomodal-footer">
          {isEditMode ? (
            <>
              <button className="custinfomodal-btn custinfomodal-save-btn" onClick={handleSave}>
                저장
              </button>
              <button className="custinfomodal-btn custinfomodal-cancel-btn" onClick={handleCancel}>
                취소
              </button>
            </>
          ) : (
            <>
              <button className="custinfomodal-btn custinfomodal-edit-btn" onClick={handleEdit}>
                수정
              </button>
              <button className="custinfomodal-btn custinfomodal-close-footer-btn" onClick={onClose}>
                닫기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustInfoModal;