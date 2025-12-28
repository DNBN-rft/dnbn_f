import { useState, useEffect } from "react";
import "./css/storeinfomodal.css";
import {
  modStoreInfo,
  modSubsInfo,
  modMemberInfo,
  modBizInfo,
  modAuthInfo,
  modMemberPassword,
  approveStore,
  getStoreDetail
} from "../../../utils/adminStoreService";
import { getBankList, getMembershipList, getAuthList } from "../../../utils/commonService";

const StoreInfoModal = ({ storeCode, onClose }) => {
  // 가맹점 상세 데이터
  const [storeData, setStoreData] = useState(null);

  // 은행 및 멤버십 목록
  const [bankList, setBankList] = useState([]);
  const [membershipList, setMembershipList] = useState([]);
  const [authList, setAuthList] = useState([]);
  const [selectedAuthIdx, setSelectedAuthIdx] = useState(null);

  // 영업일 옵션
  const openDayOptions = [
    { value: "월", label: "월" },
    { value: "화", label: "화" },
    { value: "수", label: "수" },
    { value: "목", label: "목" },
    { value: "금", label: "금" },
    { value: "토", label: "토" },
    { value: "일", label: "일" },
  ];

  // 한글 요일을 enum으로 변환
  const convertDayToEnum = (day) => {
    const dayMap = { "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI", "토": "SAT", "일": "SUN" };
    return dayMap[day] || day;
  };

  // enum을 한글 요일로 변환
  const convertEnumToDay = (enumDay) => {
    const dayMap = { "MON": "월", "TUE": "화", "WED": "수", "THU": "목", "FRI": "금", "SAT": "토", "SUN": "일" };
    return dayMap[enumDay] || enumDay;
  };

  // 각 섹션별 수정 모드 상태
  const [editModes, setEditModes] = useState({
    store: false,
    subscription: false,
    member: false,
    business: false,
    auth: false,
  });

  // 은행 및 멤버십 목록 조회 및 가맹점 상세 정보 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 가맹점 상세 정보 조회
        const storeResult = await getStoreDetail(storeCode);

        if (storeResult.success) {
          setStoreData(storeResult.data);
        } else {
          console.error("가맹점 상세 정보 조회 실패:", storeResult.error);
        }

        // 은행 목록 조회
        const bankResult = await getBankList();
        if (bankResult.success) {
          setBankList(bankResult.data);
        }

        // 멤버십 목록 조회
        const membershipResult = await getMembershipList();
        if (membershipResult.success) {
          setMembershipList(membershipResult.data);
        }

        // 권한 목록 조회
        const authResult = await getAuthList();
        if (authResult.success) {
          setAuthList(authResult.data);
        }
      } catch (error) {
      }
    };

    if (storeCode) {
      fetchData();
    }
  }, [storeCode]);

  // storeData가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    // bankNm으로부터 bankIdx 찾기
    const selectedBank = bankList.find(bank => bank.bankNm === storeData?.bankNm);

    // storeOpenDate가 enum 배열이면 한글로 변환
    const openDaysKorean = Array.isArray(storeData?.storeOpenDate)
      ? storeData.storeOpenDate.map(day => convertEnumToDay(day))
      : [];

    setStoreForm({
      storeNm: storeData?.storeNm || "",
      storeAddr: storeData?.storeAddr || "",
      storeAddrDetail: storeData?.storeAddrDetail || "",
      bankIdx: selectedBank?.bankIdx || "",
      storeAccNo: storeData?.storeAccNo || "",
      storeTelNo: storeData?.storeTelNo || "",
      storeOpenDate: openDaysKorean,
      storeOpenTime: storeData?.storeOpenTime || "",
      storeCloseTime: storeData?.storeCloseTime || "",
    });

    // membershipPlanIdx를 찾기 위해 membershipList에서 현재 선택된 플랜 검색
    const selectedPlan = membershipList.find(plan => plan.planNm === storeData?.membershipNm);

    setSubscriptionForm({
      membershipPlanIdx: selectedPlan?.planIdx ? selectedPlan.planIdx.toString() : "",
      isRenew: storeData?.isRenew || false,
      nextBillingDate: storeData?.nextBillingDate ? new Date(storeData.nextBillingDate).toISOString().split('T')[0] : "",
    });

    setMemberForm({
      memberLoginId: storeData?.memberLoginId || "",
      ownerNm: storeData?.ownerNm || "",
      ownerTelNo: storeData?.ownerTelNo || "",
      newPassword: "",
    });

    setBusinessForm({
      bizNm: storeData?.bizNm || "",
      bizType: storeData?.bizType || "",
      bizRegDate: storeData?.bizRegDate || "",
      bizNo: storeData?.bizNo || "",
      ownerTelNo: storeData?.ownerTelNo || "",
    });

    setSelectedMenus(
      Array.isArray(storeData?.menuAuth) ? storeData.menuAuth.map(m => m.code) : []
    );
  }, [storeData, bankList, membershipList]);

  // 각 섹션별 폼 데이터
  const [storeForm, setStoreForm] = useState({
    storeNm: "",
    storeAddr: "",
    storeAddrDetail: "",
    bankIdx: "",
    storeAccNo: "",
    storeTelNo: "",
    storeOpenDate: [],
    storeOpenTime: "",
    storeCloseTime: "",
  });

  const [subscriptionForm, setSubscriptionForm] = useState({
    membershipPlanIdx: "",
    isRenew: false,
    nextBillingDate: "",
  });

  // 선택된 플랜 가져오기
  const getSelectedPlan = () => {
    const plan = membershipList.find(p => p.planIdx === parseInt(subscriptionForm.membershipPlanIdx));
    return plan || { planNm: "", planPrice: 0 };
  };

  // 선택된 권한 가져오기
  const getSelectedAuth = () => {
    const auth = authList.find(a => a.authIdx === parseInt(selectedAuthIdx));
    return auth || null;
  };

  const [memberForm, setMemberForm] = useState({
    memberLoginId: "",
    ownerTelNo: "",
    newPassword: "",
  });

  const [businessForm, setBusinessForm] = useState({
    bizNm: "",
    bizType: "",
    bizRegDate: "",
    bizNo: "",
    ownerNm: "",
    ownerTelNo: "",
  });

  // 권한 관련 상태 - menuAuth를 배열로 변환
  const [selectedMenus, setSelectedMenus] = useState(
    Array.isArray(storeData?.menuAuth) ? storeData.menuAuth.map(m => m.code) : []
  );

  // 메뉴 토글
  const handleMenuToggle = (code) => {
    setSelectedMenus(prev => {
      if (prev.includes(code)) {
        return prev.filter(id => id !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  // 권한명 변경 시 해당 권한의 menuAuth로 selectedMenus 업데이트
  const handleAuthChange = (authIdx) => {
    const selectedAuth = authList.find(a => a.authIdx === parseInt(authIdx));
    if (selectedAuth) {
      setSelectedAuthIdx(authIdx);
      // menuAuth에서 code만 추출
      const menuCodes = selectedAuth.menuAuth.map(m => m.code);
      setSelectedMenus(menuCodes);
    }
  };

  // 현재 선택된 권한의 메뉴 목록
  const getAvailableMenus = () => {
    const selectedAuth = getSelectedAuth();
    if (selectedAuth) {
      return selectedAuth.menuAuth;
    }
    return storeData?.menuAuth || [];
  };

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
      const selectedBank = bankList.find(bank => bank.bankNm === storeData?.bankNm);
      const openDaysKorean = Array.isArray(storeData?.storeOpenDate)
        ? storeData.storeOpenDate.map(day => convertEnumToDay(day))
        : [];
      setStoreForm({
        storeNm: storeData?.storeNm || "",
        storeAddr: storeData?.storeAddr || "",
        storeAddrDetail: storeData?.storeAddrDetail || "",
        bankIdx: selectedBank?.bankIdx || "",
        storeAccNo: storeData?.storeAccNo || "",
        storeTelNo: storeData?.storeTelNo || "",
        storeOpenDate: openDaysKorean,
        storeOpenTime: storeData?.storeOpenTime || "",
        storeCloseTime: storeData?.storeCloseTime || "",
      });
    } else if (section === "subscription") {
      const selectedPlan = membershipList.find(plan => plan.planNm === storeData?.membershipNm);
      setSubscriptionForm({
        membershipPlanIdx: selectedPlan?.planIdx ? selectedPlan.planIdx.toString() : "",
        isRenew: storeData?.isRenew || false,
        nextBillingDate: storeData?.nextBillingDate ? new Date(storeData.nextBillingDate).toISOString().split('T')[0] : "",
      });
    } else if (section === "member") {
      setMemberForm({
        memberLoginId: storeData?.memberLoginId || "",
        ownerTelNo: storeData?.ownerTelNo || "",
        newPassword: "",
      });
    } else if (section === "business") {
      setBusinessForm({
        bizNm: storeData?.bizNm || "",
        bizType: storeData?.bizType || "",
        bizRegDate: storeData?.bizRegDate || "",
        bizNo: storeData?.bizNo || "",
        ownerNm: storeData?.ownerNm || "",
        ownerTelNo: storeData?.ownerTelNo || "",
      });
    } else if (section === "auth") {
      setSelectedMenus(
        Array.isArray(storeData?.menuAuth) ? storeData.menuAuth.map(m => m.code) : []
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

    // storeOpenDate는 한글을 enum으로 변환하여 각 요소를 개별적으로 추가
    storeForm.storeOpenDate.forEach(day => {
      formData.append("storeOpenDate", convertDayToEnum(day));
    });

    const result = await modStoreInfo(storeData.storeCode, formData);
    if (result.success) {
      alert("가맹점 정보가 수정되었습니다.");
      toggleEditMode("store");
      // 데이터 재로드
      const refreshResult = await getStoreDetail(storeCode);
      if (refreshResult.success) {
        setStoreData(refreshResult.data);
      }
    } else {
      alert(result.error);
    }
  };

  // 구독 정보 저장
  const handleSaveSubscriptionInfo = async () => {
    // membershipPlanIdx를 Long으로 변환하고 검증
    if (!subscriptionForm.membershipPlanIdx) {
      alert("플랜을 선택해주세요.");
      return;
    }

    const subsData = {
      membershipPlanIdx: parseInt(subscriptionForm.membershipPlanIdx), // Long으로 변환
      isRenew: subscriptionForm.isRenew === true || subscriptionForm.isRenew === 'true',
    };


    const result = await modSubsInfo(storeData.storeCode, subsData);
    if (result.success) {
      alert("구독 정보가 수정되었습니다.");
      toggleEditMode("subscription");
      // 데이터 재로드
      const refreshResult = await getStoreDetail(storeCode);
      if (refreshResult.success) {
        setStoreData(refreshResult.data);
      }
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
      // 데이터 재로드
      const refreshResult = await getStoreDetail(storeCode);
      if (refreshResult.success) {
        setStoreData(refreshResult.data);
      }
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
      // 데이터 재로드
      const refreshResult = await getStoreDetail(storeCode);
      if (refreshResult.success) {
        setStoreData(refreshResult.data);
      }
    } else {
      alert(result.error);
    }
  };

  // 권한 정보 저장
  const handleSaveAuthInfo = async () => {
    // 메뉴 배열을 JSON 배열 형식으로 전송
    const result = await modAuthInfo(storeData.storeCode, { menuAuth: selectedMenus });
    if (result.success) {
      alert("권한 정보가 수정되었습니다.");
      toggleEditMode("auth");
      // 데이터 재로드
      const refreshResult = await getStoreDetail(storeCode);
      if (refreshResult.success) {
        setStoreData(refreshResult.data);
      }
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
      // 데이터 재로드
      const refreshResult = await getStoreDetail(storeCode);
      if (refreshResult.success) {
        setStoreData(refreshResult.data);
      }
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
                  <span className={`storeinfomodal-approval-status ${storeData?.approvalStatus === 'APPROVED' ? 'storeinfomodal-approval-approved' : 'storeinfomodal-approval-pending'}`}>
                    {storeData?.approvalStatus === 'APPROVED' ? "승인" : storeData?.approvalStatus === 'PENDING' ? "대기 중" : "거절"}
                  </span>
                  {storeData?.approvalStatus !== 'APPROVED' && (
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
                  <div className="storeinfomodal-plan-wrapper">
                    <select
                      value={subscriptionForm.membershipPlanIdx?.toString() || ""}
                      onChange={(e) => {
                        setSubscriptionForm({ ...subscriptionForm, membershipPlanIdx: e.target.value });
                      }}
                      className="storeinfomodal-select"
                    >
                      <option value="">플랜 선택</option>
                      {membershipList.map((plan) => (
                        <option key={plan.planIdx} value={plan.planIdx?.toString()}>
                          {plan.planNm}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="storeinfomodal-value">{storeData?.membershipNm}</span>
                )}
              </div>

              <div className="storeinfomodal-field">
                <label className="storeinfomodal-label">플랜 가격</label>
                <span className="storeinfomodal-value">
                  {editModes.subscription && subscriptionForm.membershipPlanIdx
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
                    disabled
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
                    disabled
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
                  <span className="storeinfomodal-value">{storeData?.ownerNm}</span>
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
                {editModes.auth ? (
                  <select
                    value={selectedAuthIdx || ""}
                    onChange={(e) => handleAuthChange(e.target.value)}
                    className="storeinfomodal-select"
                  >
                    <option value="">권한 선택</option>
                    {authList.map((auth) => (
                      <option key={auth.authIdx} value={auth.authIdx}>
                        {auth.authNm}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="storeinfomodal-value">{storeData?.authNm}</span>
                )}
              </div>

              <div className="storeinfomodal-auth-field">
                <label className="storeinfomodal-label">권한 설명</label>
                {editModes.auth && selectedAuthIdx ? (
                  <span className="storeinfomodal-value storeinfomodal-auth-description">
                    {getSelectedAuth()?.authDescription || "-"}
                  </span>
                ) : (
                  <span className="storeinfomodal-value storeinfomodal-auth-description">
                    {storeData?.authDescription || "-"}
                  </span>
                )}
              </div>
            </div>

            <div className="storeinfomodal-menu-section">
              <h4 className="storeinfomodal-menu-title">메뉴 권한</h4>
              {editModes.auth ? (
                <div className="storeinfomodal-menu-grid">
                  {getAvailableMenus().map(menu => (
                    <label key={menu.code} className="storeinfomodal-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedMenus.includes(menu.code)}
                        onChange={() => handleMenuToggle(menu.code)}
                      />
                      <span>{menu.displayName}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="storeinfomodal-permission-list">
                  {Array.isArray(storeData?.menuAuth) ? (
                    storeData.menuAuth.map((menu, index) => (
                      <span key={index} className="storeinfomodal-permission-tag">
                        {menu.displayName}
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
