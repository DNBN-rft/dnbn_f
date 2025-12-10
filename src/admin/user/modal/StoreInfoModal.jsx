import { useState, useEffect } from "react";
import "./css/storeinfomodal.css";
import {
  modStoreInfo,
  modSubsInfo,
  modMemberInfo,
  modBizInfo,
  modAuthInfo,
  modMemberPassword,
  approveStore
} from "../../../utils/adminStoreService";
import { getBankList, getMembershipList } from "../../../utils/commonService";

const StoreInfoModal = ({ storeData, onClose, onUpdate }) => {
  // 은행 및 멤버십 목록
  const [bankList, setBankList] = useState([]);
  const [membershipList, setMembershipList] = useState([]);

  // 영업일 옵션
  const openDayOptions = [
    { value: "MON", label: "월" },
    { value: "TUE", label: "화" },
    { value: "WED", label: "수" },
    { value: "THU", label: "목" },
    { value: "FRI", label: "금" },
    { value: "SAT", label: "토" },
    { value: "SUN", label: "일" },
  ];

  // 각 섹션별 수정 모드 상태
  const [editModes, setEditModes] = useState({
    store: false,
    subscription: false,
    member: false,
    business: false,
    auth: false,
  });

  // 은행 및 멤버십 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      const bankResult = await getBankList();
      if (bankResult.success) {
        setBankList(bankResult.data);
      }

      const membershipResult = await getMembershipList();
      if (membershipResult.success) {
        setMembershipList(membershipResult.data);
      }
    };

    fetchData();
  }, []);

  // 각 섹션별 폼 데이터
  const [storeForm, setStoreForm] = useState({
    storeNm: storeData?.storeNm || "",
    storeAddr: storeData?.storeAddr || "",
    storeAddrDetail: storeData?.storeAddrDetail || "",
    zipCode: storeData?.zipCode || "",
    bankIdx: storeData?.bankIdx || "",
    storeAccNo: storeData?.storeAccNo || "",
    storeTelNo: storeData?.storeTelNo || "",
    storeOpenDate: storeData?.storeOpenDate || [],
    storeOpenTime: storeData?.storeOpenTime || "",
    storeCloseTime: storeData?.storeCloseTime || "",
  });

  const [subscriptionForm, setSubscriptionForm] = useState({
    membershipPlanIdx: storeData?.membershipPlanIdx || "",
    isRenew: storeData?.isRenew || false,
    nextBillingDate: storeData?.nextBillingDate ? new Date(storeData.nextBillingDate).toISOString().split('T')[0] : "",
  });

  // 선택된 플랜 가져오기
  const getSelectedPlan = () => {
    if (!subscriptionForm.membershipPlanIdx && subscriptionForm.membershipPlanIdx !== 0) {
      return null;
    }
    return membershipList[subscriptionForm.membershipPlanIdx];
  };

  const [memberForm, setMemberForm] = useState({
    memberLoginId: storeData?.memberLoginId || "",
    ownerNm: storeData?.ownerNm || "",
    ownerTelNo: storeData?.ownerTelNo || "",
    newPassword: "",
  });

  const [businessForm, setBusinessForm] = useState({
    bizNm: storeData?.bizNm || "",
    bizType: storeData?.bizType || "",
    ownerNm: storeData?.ownerNm || "",
    bizRegDate: storeData?.bizRegDate || "",
    bizNo: storeData?.bizNo || "",
    ownerTelNo: storeData?.ownerTelNo || "",
  });

  // 권한 관련 상태 - menuAuth를 배열로 변환
  const [selectedMenus, setSelectedMenus] = useState(
    storeData?.menuAuth ? storeData.menuAuth.split(',').map(m => m.trim()) : []
  );

  // 메뉴 토글
  const handleMenuToggle = (menuId) => {
    setSelectedMenus(prev => {
      if (prev.includes(menuId)) {
        return prev.filter(id => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  };

  // 모든 메뉴 목록
  const allMenus = [
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

  // 섹션별 수정 모드 토글
  const toggleEditMode = (section) => {
    setEditModes(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 섹션별 취소
  const handleCancel = (section) => {
    if (section === "store") {
      setStoreForm({
        storeNm: storeData?.storeNm || "",
        storeAddr: storeData?.storeAddr || "",
        storeAddrDetail: storeData?.storeAddrDetail || "",
        zipCode: storeData?.zipCode || "",
        bankIdx: storeData?.bankIdx || "",
        storeAccNo: storeData?.storeAccNo || "",
        storeTelNo: storeData?.storeTelNo || "",
        storeOpenDate: storeData?.storeOpenDate || [],
        storeOpenTime: storeData?.storeOpenTime || "",
        storeCloseTime: storeData?.storeCloseTime || "",
      });
    } else if (section === "subscription") {
      setSubscriptionForm({
        membershipPlanIdx: storeData?.membershipPlanIdx || "",
        isRenew: storeData?.isRenew || false,
        nextBillingDate: storeData?.nextBillingDate ? new Date(storeData.nextBillingDate).toISOString().split('T')[0] : "",
      });
    } else if (section === "member") {
      setMemberForm({
        memberLoginId: storeData?.memberLoginId || "",
        ownerNm: storeData?.ownerNm || "",
        ownerTelNo: storeData?.ownerTelNo || "",
        newPassword: "",
      });
    } else if (section === "business") {
      setBusinessForm({
        bizNm: storeData?.bizNm || "",
        bizType: storeData?.bizType || "",
        ownerNm: storeData?.ownerNm || "",
        bizRegDate: storeData?.bizRegDate || "",
        bizNo: storeData?.bizNo || "",
        ownerTelNo: storeData?.ownerTelNo || "",
      });
    } else if (section === "auth") {
      setSelectedMenus(
        storeData?.menuAuth ? storeData.menuAuth.split(',').map(m => m.trim()) : []
      );
    }
    toggleEditMode(section);
  };

  // 가맹점 정보 저장
  const handleSaveStoreInfo = async () => {
    const formData = new FormData();
    formData.append("storeNm", storeForm.storeNm);
    formData.append("storeAddr", storeForm.storeAddr);
    formData.append("storeAddrDetail", storeForm.storeAddrDetail);
    formData.append("zipCode", storeForm.zipCode);
    formData.append("bankIdx", storeForm.bankIdx);
    formData.append("storeAccNo", storeForm.storeAccNo);
    formData.append("storeTelNo", storeForm.storeTelNo);
    formData.append("storeOpenTime", storeForm.storeOpenTime);
    formData.append("storeCloseTime", storeForm.storeCloseTime);

    // storeOpenDate는 배열이므로 JSON 문자열로 변환
    formData.append("storeOpenDate", JSON.stringify(storeForm.storeOpenDate));

    const result = await modStoreInfo(storeData.storeCode, formData);
    if (result.success) {
      alert("가맹점 정보가 수정되었습니다.");
      toggleEditMode("store");
      onUpdate();
    } else {
      alert(result.error);
    }
  };

  // 구독 정보 저장
  const handleSaveSubscriptionInfo = async () => {
    const result = await modSubsInfo(storeData.storeCode, subscriptionForm);
    if (result.success) {
      alert("구독 정보가 수정되었습니다.");
      toggleEditMode("subscription");
      onUpdate();
    } else {
      alert(result.error);
    }
  };

  // 사용자 정보 저장
  const handleSaveMemberInfo = async () => {
    const result = await modMemberInfo(storeData.storeCode, {
      memberLoginId: memberForm.memberLoginId,
      ownerNm: memberForm.ownerNm,
      ownerTelNo: memberForm.ownerTelNo,
    });
    if (result.success) {
      alert("사용자 정보가 수정되었습니다.");

      // 비밀번호가 입력된 경우 비밀번호도 변경
      if (memberForm.newPassword) {
        const pwResult = await modMemberPassword(storeData.storeCode, {
          newPassword: memberForm.newPassword,
        });
        if (pwResult.success) {
          alert("비밀번호도 변경되었습니다.");
        } else {
          alert("비밀번호 변경 실패: " + pwResult.error);
        }
      }

      toggleEditMode("member");
      onUpdate();
    } else {
      alert(result.error);
    }
  };

  // 사업자 정보 저장
  const handleSaveBusinessInfo = async () => {
    const result = await modBizInfo(storeData.storeCode, businessForm);
    if (result.success) {
      alert("사업자 정보가 수정되었습니다.");
      toggleEditMode("business");
      onUpdate();
    } else {
      alert(result.error);
    }
  };

  // 권한 정보 저장
  const handleSaveAuthInfo = async () => {
    // 메뉴 배열을 콤마로 구분된 문자열로 변환
    const menuAuthString = selectedMenus.join(',');
    const result = await modAuthInfo(storeData.storeCode, { menuAuth: menuAuthString });
    if (result.success) {
      alert("권한 정보가 수정되었습니다.");
      toggleEditMode("auth");
      onUpdate();
    } else {
      alert(result.error);
    }
  };

  // 가맹점 승인 처리
  const handleApprove = async () => {
    if (!window.confirm("가맹점을 승인하시겠습니까?")) {
      return;
    }

    const result = await approveStore(storeData.storeCode);
    if (result.success) {
      alert("승인되었습니다.");
      onUpdate();
      onClose();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="storeinfomodal-backdrop" onClick={onClose}>
      <div className="storeinfomodal-wrap" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="storeinfomodal-header">
          <h2 className="storeinfomodal-title">가맹점 상세 정보</h2>
          <div className="storeinfomodal-header-actions">
            <button className="storeinfomodal-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="storeinfomodal-content">
          {/* 1. 가맹점 정보 섹션 */}
          <section className="storeinfomodal-section">
            <div className="storeinfomodal-section-header">
              <h3 className="storeinfomodal-section-title">가맹점 정보</h3>
              {editModes.store ? (
                <div className="storeinfomodal-section-actions">
                  <button
                    className="storeinfomodal-btn storeinfomodal-save-btn"
                    onClick={handleSaveStoreInfo}
                  >
                    저장
                  </button>
                  <button
                    className="storeinfomodal-btn storeinfomodal-cancel-btn"
                    onClick={() => handleCancel("store")}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  className="storeinfomodal-btn storeinfomodal-edit-btn"
                  onClick={() => toggleEditMode("store")}
                >
                  수정
                </button>
              )}
            </div>
            <div className="storeinfomodal-grid">
              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">가맹점 이름</label>
                {editModes.store ? (
                  <input
                    type="text"
                    value={storeForm.storeNm}
                    onChange={(e) => setStoreForm({ ...storeForm, storeNm: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.storeNm}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">가맹점 코드</label>
                <span className="storeinfomodal-value">{storeData?.storeCode}</span>
              </div>

              <div className="storeinfomodal-field storeinfomodal-field-full">
                <label className="storeinfomodal-label">주소</label>
                {editModes.store ? (
                  <div className="storeinfomodal-combined-input">
                    <input
                      type="text"
                      value={storeForm.storeAddr}
                      onChange={(e) => setStoreForm({ ...storeForm, storeAddr: e.target.value })}
                      className="storeinfomodal-input"
                      placeholder="주소"
                    />
                    <input
                      type="text"
                      value={storeForm.storeAddrDetail}
                      onChange={(e) => setStoreForm({ ...storeForm, storeAddrDetail: e.target.value })}
                      className="storeinfomodal-input"
                      placeholder="상세주소"
                    />
                  </div>
                ) : (
                  <span className="storeinfomodal-value">
                    {storeData?.storeAddr} {storeData?.storeAddrDetail}
                  </span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">연락처</label>
                {editModes.store ? (
                  <input
                    type="text"
                    value={storeForm.storeTelNo}
                    onChange={(e) => setStoreForm({ ...storeForm, storeTelNo: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.storeTelNo}</span>
                )}
              </div>

              <div className="storeinfomodal-field storeinfomodal-field-full">
                <label className="storeinfomodal-label">영업일</label>
                {editModes.store ? (
                  <div className="storeinfomodal-checkbox-group">
                    {openDayOptions.map(day => (
                      <label key={day.value} className="storeinfomodal-checkbox-label">
                        <input
                          type="checkbox"
                          checked={storeForm.storeOpenDate.includes(day.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStoreForm({
                                ...storeForm,
                                storeOpenDate: [...storeForm.storeOpenDate, day.value]
                              });
                            } else {
                              setStoreForm({
                                ...storeForm,
                                storeOpenDate: storeForm.storeOpenDate.filter(d => d !== day.value)
                              });
                            }
                          }}
                        />
                        <span>{day.label}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <span className="storeinfomodal-value">
                    {storeData?.storeOpenDate?.join(", ") || "-"}
                  </span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">영업 시간</label>
                {editModes.store ? (
                  <div className="storeinfomodal-combined-input">
                    <input
                      type="time"
                      value={storeForm.storeOpenTime}
                      onChange={(e) => setStoreForm({ ...storeForm, storeOpenTime: e.target.value })}
                      className="storeinfomodal-input"
                    />
                    <span>~</span>
                    <input
                      type="time"
                      value={storeForm.storeCloseTime}
                      onChange={(e) => setStoreForm({ ...storeForm, storeCloseTime: e.target.value })}
                      className="storeinfomodal-input"
                    />
                  </div>
                ) : (
                  <span className="storeinfomodal-value">
                    {storeData?.storeOpenTime} ~ {storeData?.storeCloseTime}
                  </span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">은행</label>
                {editModes.store ? (
                  <select
                    value={storeForm.bankIdx}
                    onChange={(e) => setStoreForm({ ...storeForm, bankIdx: e.target.value })}
                    className="storeinfomodal-select"
                  >
                    <option value="">은행 선택</option>
                    {bankList.map(bank => (
                      <option key={bank.bankIdx} value={bank.bankIdx}>
                        {bank.bankNm}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="storeinfomodal-value">{storeData?.bankNm}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">계좌번호</label>
                {editModes.store ? (
                  <input
                    type="text"
                    value={storeForm.storeAccNo}
                    onChange={(e) => setStoreForm({ ...storeForm, storeAccNo: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.storeAccNo}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">승인 상태</label>
                <div className="storeinfomodal-approval-container">
                  <span className={`storeinfomodal-approval-status ${storeData?.isApproved ? 'storeinfomodal-approval-approved' : 'storeinfomodal-approval-pending'}`}>
                    {storeData?.isApproved ? "승인" : "대기중"}
                  </span>
                  {!storeData?.isApproved && (
                    <button
                      className="storeinfomodal-approval-btn storeinfomodal-approve-btn"
                      onClick={handleApprove}
                    >
                      승인하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 2. 구독 정보 섹션 */}
          <section className="storeinfomodal-section">
            <div className="storeinfomodal-section-header">
              <h3 className="storeinfomodal-section-title">구독 정보</h3>
              {editModes.subscription ? (
                <div className="storeinfomodal-section-actions">
                  <button
                    className="storeinfomodal-btn storeinfomodal-save-btn"
                    onClick={handleSaveSubscriptionInfo}
                  >
                    저장
                  </button>
                  <button
                    className="storeinfomodal-btn storeinfomodal-cancel-btn"
                    onClick={() => handleCancel("subscription")}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  className="storeinfomodal-btn storeinfomodal-edit-btn"
                  onClick={() => toggleEditMode("subscription")}
                >
                  수정
                </button>
              )}
            </div>
            <div className="storeinfomodal-grid">
              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">플랜명</label>
                {editModes.subscription ? (
                  <select
                    value={subscriptionForm.membershipPlanIdx}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, membershipPlanIdx: e.target.value })}
                    className="storeinfomodal-select"
                  >
                    <option value="">플랜 선택</option>
                    {membershipList.map((plan, index) => (
                      <option key={index} value={index}>
                        {plan.planNm}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="storeinfomodal-value">{storeData?.membershipNm}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">플랜 가격</label>
                <span className="storeinfomodal-value">
                  {editModes.subscription && getSelectedPlan()
                    ? getSelectedPlan().planPrice?.toLocaleString() + "원"
                    : storeData?.membershipPrice?.toLocaleString() + "원"
                  }
                </span>
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">구독 상태</label>
                {editModes.subscription ? (
                  <select
                    value={subscriptionForm.isRenew}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, isRenew: e.target.value === 'true' })}
                    className="storeinfomodal-select"
                  >
                    <option value="true">유지</option>
                    <option value="false">해지</option>
                  </select>
                ) : (
                  <span className="storeinfomodal-value">
                    {storeData?.isRenew ? "유지" : "해지"}
                  </span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">다음 결제일</label>
                {editModes.subscription ? (
                  <input
                    type="date"
                    value={subscriptionForm.nextBillingDate}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, nextBillingDate: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">
                    {storeData?.nextBillingDate ? new Date(storeData.nextBillingDate).toLocaleDateString() : "-"}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* 3. 사용자 정보 섹션 */}
          <section className="storeinfomodal-section">
            <div className="storeinfomodal-section-header">
              <h3 className="storeinfomodal-section-title">사용자 정보</h3>
              {editModes.member ? (
                <div className="storeinfomodal-section-actions">
                  <button
                    className="storeinfomodal-btn storeinfomodal-save-btn"
                    onClick={handleSaveMemberInfo}
                  >
                    저장
                  </button>
                  <button
                    className="storeinfomodal-btn storeinfomodal-cancel-btn"
                    onClick={() => handleCancel("member")}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  className="storeinfomodal-btn storeinfomodal-edit-btn"
                  onClick={() => toggleEditMode("member")}
                >
                  수정
                </button>
              )}
            </div>
            <div className="storeinfomodal-grid">
              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">아이디</label>
                {editModes.member ? (
                  <input
                    type="text"
                    value={memberForm.memberLoginId}
                    onChange={(e) => setMemberForm({ ...memberForm, memberLoginId: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.memberLoginId}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">이름</label>
                {editModes.member ? (
                  <input
                    type="text"
                    value={memberForm.ownerNm}
                    onChange={(e) => setMemberForm({ ...memberForm, ownerNm: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.ownerNm}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">연락처</label>
                {editModes.member ? (
                  <input
                    type="text"
                    value={memberForm.ownerTelNo}
                    onChange={(e) => setMemberForm({ ...memberForm, ownerTelNo: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.ownerTelNo}</span>
                )}
              </div>

              {editModes.member && (
                <div className="storeinfomodal-field">
                  <label className="storeinfomodal-label">비밀번호 변경</label>
                  <input
                    type="password"
                    value={memberForm.newPassword}
                    onChange={(e) => setMemberForm({ ...memberForm, newPassword: e.target.value })}
                    className="storeinfomodal-input"
                    placeholder="새 비밀번호 (변경 시에만 입력)"
                  />
                </div>
              )}
            </div>
          </section>

          {/* 4. 사업자 정보 섹션 */}
          <section className="storeinfomodal-section">
            <div className="storeinfomodal-section-header">
              <h3 className="storeinfomodal-section-title">사업자 정보</h3>
              {editModes.business ? (
                <div className="storeinfomodal-section-actions">
                  <button
                    className="storeinfomodal-btn storeinfomodal-save-btn"
                    onClick={handleSaveBusinessInfo}
                  >
                    저장
                  </button>
                  <button
                    className="storeinfomodal-btn storeinfomodal-cancel-btn"
                    onClick={() => handleCancel("business")}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  className="storeinfomodal-btn storeinfomodal-edit-btn"
                  onClick={() => toggleEditMode("business")}
                >
                  수정
                </button>
              )}
            </div>
            <div className="storeinfomodal-grid">
              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">상호명</label>
                {editModes.business ? (
                  <input
                    type="text"
                    value={businessForm.bizNm}
                    onChange={(e) => setBusinessForm({ ...businessForm, bizNm: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.bizNm}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">사업자 구분</label>
                {editModes.business ? (
                  <select
                    value={businessForm.bizType}
                    onChange={(e) => setBusinessForm({ ...businessForm, bizType: e.target.value })}
                    className="storeinfomodal-select"
                  >
                    <option value="개인">개인</option>
                    <option value="법인">법인</option>
                  </select>
                ) : (
                  <span className="storeinfomodal-value">{storeData?.bizType}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">대표자명</label>
                {editModes.business ? (
                  <input
                    type="text"
                    value={businessForm.ownerNm}
                    onChange={(e) => setBusinessForm({ ...businessForm, ownerNm: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.ownerNm}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">사업자 등록일</label>
                {editModes.business ? (
                  <input
                    type="date"
                    value={businessForm.bizRegDate}
                    onChange={(e) => setBusinessForm({ ...businessForm, bizRegDate: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">
                    {storeData?.bizRegDate ? new Date(storeData.bizRegDate).toLocaleDateString() : "-"}
                  </span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">사업자 번호</label>
                {editModes.business ? (
                  <input
                    type="text"
                    value={businessForm.bizNo}
                    onChange={(e) => setBusinessForm({ ...businessForm, bizNo: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.bizNo}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">대표 연락처</label>
                {editModes.business ? (
                  <input
                    type="text"
                    value={businessForm.ownerTelNo}
                    onChange={(e) => setBusinessForm({ ...businessForm, ownerTelNo: e.target.value })}
                    className="storeinfomodal-input"
                  />
                ) : (
                  <span className="storeinfomodal-value">{storeData?.ownerTelNo}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">승인일시</label>
                <span className="storeinfomodal-value">
                  {storeData?.approvedDateTime ? new Date(storeData.approvedDateTime).toLocaleString() : "-"}
                </span>
              </div>
            </div>
          </section>

          {/* 5. 권한 정보 섹션 */}
          <section className="storeinfomodal-section">
            <div className="storeinfomodal-section-header">
              <h3 className="storeinfomodal-section-title">권한 정보</h3>
              {editModes.auth ? (
                <div className="storeinfomodal-section-actions">
                  <button
                    className="storeinfomodal-btn storeinfomodal-save-btn"
                    onClick={handleSaveAuthInfo}
                  >
                    저장
                  </button>
                  <button
                    className="storeinfomodal-btn storeinfomodal-cancel-btn"
                    onClick={() => handleCancel("auth")}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  className="storeinfomodal-btn storeinfomodal-edit-btn"
                  onClick={() => toggleEditMode("auth")}
                >
                  수정
                </button>
              )}
            </div>

            <div className="storeinfomodal-auth-row">
              <div className="storeinfomodal-auth-field">
                <label className="storeinfomodal-label">권한명</label>
                <span className="storeinfomodal-value">{storeData?.authNm}</span>
              </div>

              <div className="storeinfomodal-auth-field">
                <label className="storeinfomodal-label">권한 설명</label>
                <span className="storeinfomodal-value storeinfomodal-auth-description">
                  {storeData?.authDescription || "-"}
                </span>
              </div>
            </div>

            <div className="storeinfomodal-menu-section">
              <h4 className="storeinfomodal-menu-title">메뉴 권한</h4>
              {editModes.auth ? (
                <div className="storeinfomodal-menu-grid">
                  {allMenus.map(menu => (
                    <label key={menu.id} className="storeinfomodal-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedMenus.includes(menu.id)}
                        onChange={() => handleMenuToggle(menu.id)}
                      />
                      <span>{menu.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="storeinfomodal-permission-list">
                  {storeData?.menuAuth ? (
                    storeData.menuAuth.split(',').map((menuAuth, index) => (
                      <span key={index} className="storeinfomodal-permission-tag">
                        {menuAuth.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="storeinfomodal-no-permission">접근 가능한 메뉴가 없습니다</span>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 푸터 */}
        <div className="storeinfomodal-footer">
          <button className="storeinfomodal-btn storeinfomodal-download-btn" onClick={onClose}>
            다운로드
          </button>
          <button className="storeinfomodal-btn storeinfomodal-close-footer-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoModal;
