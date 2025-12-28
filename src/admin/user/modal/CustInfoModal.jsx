import { useState, useEffect } from "react";
import "./css/custinfomodal.css";
import { getAuthList } from "../../../utils/adminAuthService";
import { formatDate } from "../../../utils/commonService";

// 메뉴 매핑 (id: 영어, name: 한국어)
const MENU_MAP = {
  ADMIN_MAIN: "관리자 메인",
  ADMIN_MANAGER: "관리자 관리",
  ADMIN_CUST: "회원 관리",
  ADMIN_STORE: "가게 정보",
  ADMIN_PRODUCT: "상품 관리",
  ADMIN_REVIEW: "리뷰 관리",
  ADMIN_EMPLOYEE: "직원 관리",
  ADMIN_NOTICE: "공지사항",
  ADMIN_QUESTION: "문의 관리",
  ADMIN_MEMBERSHIP: "멤버십 관리",
  ADMIN_REPORT: "신고 관리",
  ADMIN_ALARM: "알림 관리",
  ADMIN_PUSH: "푸시 알림",
  ADMIN_CATEGORY: "카테고리 관리",
  ADMIN_REGION: "지역 관리",
  ADMIN_PLAN: "요금제 관리",
  ADMIN_ACCEPT: "가입 승인",
  ADMIN_AUTH: "권한 관리",
  ADMIN_CATEGORY_MANAGE: "카테고리 설정",
  STORE_MEMBERSHIP: "멤버십 정보",
  STORE_MYPAGE: "마이페이지",
  STORE_ORDER: "주문 관리",
  STORE_NEGOTIATION: "흥정 관리",
  STORE_STATIC: "주문 통계",
  STORE_PRODUCT: "상품 관리",
  STORE_SALE: "판매 관리",
  STORE_REVIEW: "리뷰 관리",
  STORE_EMPLOYEE: "직원 관리",
  STORE_NOTICE: "공지사항",
  STORE_QUESTION: "문의하기",
  STORE_SUBSCRIPTION: "구독 플랜",
};

const CustInfoModal = ({ customerData, onClose, onUpdate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    custNm: "",
    custGender: "M",
    custBirthYear: "",
    custTelNo: "",
    custState: "ACTIVE",
  });

  const [authList, setAuthList] = useState([]);
  const [selectedAuthIdx, setSelectedAuthIdx] = useState("");
  const [selectedAuthNm, setSelectedAuthNm] = useState("");
  const [selectedMenuAuth, setSelectedMenuAuth] = useState([]);
  const [authNmToDisplay, setAuthNmToDisplay] = useState("");
  const [availableMenus, setAvailableMenus] = useState([]);

  // customerData 변경 시 formData 업데이트
  useEffect(() => {
    if (customerData) {
      setFormData({
        custNm: customerData?.custNm || "",
        custGender: customerData?.custGender || "M",
        custBirthYear: customerData?.custYearBirth || "",
        custTelNo: customerData?.custTelNo || "",
        custState: customerData?.custState || "ACTIVE",
      });
      const parsedMenus = parseMenuAuth(customerData?.menuAuth || "");
      setSelectedMenuAuth(parsedMenus);
      setAuthNmToDisplay(customerData?.authNm || "");
    }
  }, [customerData]);

  // 권한 목록 조회
  useEffect(() => {
    const fetchAuthList = async () => {
      try {
        const result = await getAuthList();
        if (result.success) {
          setAuthList(result.data || []);
        }
      } catch (error) {
        console.error("권한 목록 조회 실패:", error);
      }
    };

    fetchAuthList();
  }, []);

  // authNm 선택 시 menuAuth 업데이트
  const handleAuthChange = (e) => {
    const selectedIdx = e.target.value;
    const selectedAuth = authList.find(auth => auth.authIdx === parseInt(selectedIdx));

    if (selectedAuth) {
      setSelectedAuthIdx(selectedIdx);
      setSelectedAuthNm(selectedAuth.authNm);
      // menuAuth를 배열로 파싱
      const parsedMenus = parseMenuAuth(selectedAuth.menuAuth || "");
      setAvailableMenus(parsedMenus);
      setSelectedMenuAuth(parsedMenus);
      setAuthNmToDisplay(selectedAuth.authNm);
    }
  };

  // 메뉴 권한 체크박스 핸들러
  const handleMenuAuthCheckbox = (menuId) => {
    setSelectedMenuAuth((prev) => {
      if (prev.includes(menuId)) {
        return prev.filter(id => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    // 기존 권한 정보 초기화
    if (customerData?.authNm && authList.length > 0) {
      // authNm으로 권한 찾기
      const foundAuth = authList.find(auth => auth.authNm === customerData.authNm);
      if (foundAuth) {
        setSelectedAuthIdx(foundAuth.authIdx.toString());
        setSelectedAuthNm(foundAuth.authNm);
        const parsedMenus = parseMenuAuth(customerData?.menuAuth || "");
        setAvailableMenus(parsedMenus);
        setSelectedMenuAuth(parsedMenus);
        setAuthNmToDisplay(foundAuth.authNm);
      }
    }
    setIsEditMode(true);
  };

  const handleSave = () => {
    // custGender 필수 검증
    if (!formData.custGender || (formData.custGender !== "M" && formData.custGender !== "F")) {
      alert("성별을 올바르게 선택해주세요.");
      return;
    }

    // custNm 필수 검증
    if (!formData.custNm || formData.custNm.trim() === "") {
      alert("이름을 입력해주세요.");
      return;
    }

    // custState 필수 검증
    if (!formData.custState) {
      alert("상태를 선택해주세요.");
      return;
    }

    if (onUpdate) {
      const updateData = {
        custNm: formData.custNm.trim(),
        custGender: formData.custGender,
        custBirthYear: formData.custBirthYear || "",
        custTelNo: formData.custTelNo || "",
        custState: formData.custState,
        custMenuAuth: JSON.stringify(selectedMenuAuth),
      };
      onUpdate(updateData);
    }
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      custNm: customerData?.custNm || "",
      custGender: customerData?.custGender || "M",
      custBirthYear: customerData?.custYearBirth || "",
      custTelNo: customerData?.custTelNo || "",
      custState: customerData?.custState || "ACTIVE",
    });
    const parsedMenus = parseMenuAuth(customerData?.menuAuth || "");
    setSelectedMenuAuth(parsedMenus);
    setAuthNmToDisplay(customerData?.authNm || "");
    setSelectedAuthIdx("");
    setAvailableMenus([]);
    setIsEditMode(false);
  };

  const getStatusLabel = (status) => {
    if (status === "ACTIVE") return "활성";
    if (status === "SUSPENDED") return "정지";
    if (status === "WITHDRAWAL") return "탈퇴";
    return status;
  };


  // 메뉴 권한 파싱 함수
  const parseMenuAuth = (menuAuthStr) => {
    try {
      if (!menuAuthStr) return [];
      // 문자열이 JSON 배열 형태인지 확인
      if (typeof menuAuthStr === "string" && menuAuthStr.startsWith("[")) {
        return JSON.parse(menuAuthStr);
      }
      // 문자열이면 쉼표로 분리
      if (typeof menuAuthStr === "string") {
        return menuAuthStr.split(",").map(item => item.trim()).filter(item => item);
      }
      // 이미 배열이면 그대로 반환
      return Array.isArray(menuAuthStr) ? menuAuthStr : [];
    } catch (error) {
      console.error("메뉴 권한 파싱 오류:", error);
      return [];
    }
  };

  // 메뉴 id를 한국어 이름으로 변환
  const getMenuNameById = (menuId) => {
    return MENU_MAP[menuId] || menuId;
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
                <span className="custinfomodal-value">{customerData?.socialId || "-"}</span>
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">로그인 타입</label>
                <span className="custinfomodal-value">{customerData?.custLoginType || "-"}</span>
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">이름</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="custNm"
                    value={formData.custNm}
                    onChange={handleInputChange}
                    className="custinfomodal-input"
                  />
                ) : (
                  <span className="custinfomodal-value">{formData.custNm}</span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">성별</label>
                {isEditMode ? (
                  <select
                    name="custGender"
                    value={formData.custGender || "M"}
                    onChange={handleInputChange}
                    className="custinfomodal-select"
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="M">남</option>
                    <option value="F">여</option>
                  </select>
                ) : (
                  <span className="custinfomodal-value">
                    {formData.custGender === "M" ? "남" : formData.custGender === "F" ? "여" : "-"}
                  </span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">생년</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="custBirthYear"
                    value={formData.custBirthYear}
                    onChange={handleInputChange}
                    className="custinfomodal-input"
                    placeholder="예: 1990"
                  />
                ) : (
                  <span className="custinfomodal-value">{formData.custBirthYear || "-"}</span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">사용자 코드</label>
                <span className="custinfomodal-value">{customerData?.custCode}</span>
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">연락처</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="custTelNo"
                    value={formData.custTelNo}
                    onChange={handleInputChange}
                    className="custinfomodal-input"
                  />
                ) : (
                  <span className="custinfomodal-value">{formData.custTelNo}</span>
                )}
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">가입일</label>
                <span className="custinfomodal-value">
                  {formatDate(customerData?.custSignInDate)}
                </span>
              </div>

              <div className="custinfomodal-field">
                <label className="custinfomodal-label">상태</label>
                {isEditMode ? (
                  <select
                    name="custState"
                    value={formData.custState}
                    onChange={handleInputChange}
                    className="custinfomodal-select"
                  >
                    <option value="ACTIVE">활성</option>
                    <option value="WITHDRAWAL">탈퇴</option>
                    <option value="SUSPENDED">정지</option>
                  </select>
                ) : (
                  <span className="custinfomodal-value">
                    {getStatusLabel(formData.custState)}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="custinfomodal-section">
            <h3 className="custinfomodal-section-title">권한 정보</h3>

            <div className="custinfomodal-auth-field-full">
              <label className="custinfomodal-label">권한명</label>
              {isEditMode ? (
                <select
                  value={selectedAuthIdx}
                  onChange={handleAuthChange}
                  className="custinfomodal-select"
                >
                  <option value="">권한을 선택하세요</option>
                  {authList.map((auth) => (
                    <option key={auth.authIdx} value={auth.authIdx}>
                      {auth.authNm}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="custinfomodal-value">
                  {authNmToDisplay || "권한이 설정되지 않았습니다"}
                </span>
              )}

              {(isEditMode || selectedMenuAuth.length > 0) && (
                <div className="custinfomodal-menu-auth-wrapper">
                  <label className="custinfomodal-label custinfomodal-label-submenu">메뉴 권한</label>
                  {isEditMode ? (
                    <div className="custinfomodal-menu-auth-checkboxes">
                      {availableMenus.length > 0 ? (
                        availableMenus.map((menuId) => (
                          <label key={menuId} className="custinfomodal-menu-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedMenuAuth.includes(menuId)}
                              onChange={() => handleMenuAuthCheckbox(menuId)}
                            />
                            <span className="custinfomodal-checkbox-label">{getMenuNameById(menuId)}</span>
                          </label>
                        ))
                      ) : (
                        <p className="custinfomodal-no-auth">선택된 권한의 메뉴가 없습니다</p>
                      )}
                    </div>
                  ) : (
                    <div className="custinfomodal-menu-auth-tags-clean">
                      {selectedMenuAuth.length > 0 ? (
                        selectedMenuAuth.map((auth, index) => (
                          <span key={index} className="custinfomodal-auth-tag-clean">
                            {getMenuNameById(auth)}
                          </span>
                        ))
                      ) : (
                        <p className="custinfomodal-no-auth">메뉴 권한이 없습니다</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
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