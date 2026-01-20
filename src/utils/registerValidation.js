/**
 * 회원가입 각 단계별 Validation 함수들
 */

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}$/;

const phoneRegex = /^[0-9]+$/;

// Input 제한 함수들 (실시간 입력 제어)

export const restrictLoginId = (value) => {
  return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15);
};

export const restrictPassword = (value) => {
  return value.replace(/\s/g, '').slice(0, 16);
};

export const restrictEmail = (value) => {
  return value.replace(/\s/g, '');
};

export const restrictPhone = (value) => {
  return value.replace(/[^0-9]/g, '').slice(0, 11);
};

export const restrictAccountNumber = (value) => {
  return value.replace(/[^0-9]/g, '').slice(0, 15);
};

export const restrictBusinessNumber = (value) => {
  return value.replace(/[^0-9]/g, '').slice(0, 10);
};

export const restrictName = (value) => {
  return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]/g, '');
};

export const restrictBusinessName = (value) => {
  return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/g, '');
};

export const restrictBusinessType = (value) => {
  return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9()\s/\-,]/g, '');
};

// 기존 검증 함수들

export const getPasswordCheckMessage = (password) => {
  if (!password) {
    return { message: "", status: null };
  }

  const hasLength = password.length >= 8 && password.length <= 16;
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecial = /\W/.test(password);

  const errors = [];
  if (!hasLength) errors.push("8~16자");
  if (!hasNumber) errors.push("숫자");
  if (!hasLetter) errors.push("영문");
  if (!hasSpecial) errors.push("특수문자");

  if (errors.length === 0) {
    return { message: "사용 가능한 비밀번호입니다.", status: "success" };
  } else {
    return { message: `비밀번호는 ${errors.join(", ")}을(를) 포함해야 합니다.`, status: "error" };
  }
};

/**
 * Step 0: 약관 동의 (Agreement) 검증
 * @param {Object} agreement - 약관 동의 객체
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateAgreement = (agreement = {}) => {
  // 필수 약관 체크 (marketing은 선택사항)
  if (!agreement.terms || !agreement.privacy || !agreement.seller) {
    return { isValid: false, message: "필수 약관에 모두 동의해주세요." };
  }

  return { isValid: true, message: "" };
};

/**
 * Step 1: 회원 정보 (MemberInfo) 검증
 * @param {Object} formData - 폼 데이터
 * @param {string} idCheckStatus - 아이디 중복 체크 상태
 * @param {string} passwordConfirm - 비밀번호 확인 값
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateMemberInfo = (formData, idCheckStatus, passwordConfirm) => {
  if (!formData.loginId || !formData.loginId.trim()) {
    return { isValid: false, message: "아이디를 입력해주세요." };
  }

  if (idCheckStatus !== "success") {
    return { isValid: false, message: "아이디 중복 체크를 해주세요." };
  }

  if (!formData.password || !formData.password.trim()) {
    return { isValid: false, message: "비밀번호를 입력해주세요." };
  }

  if (!passwordRegex.test(formData.password)) {
    return { isValid: false, message: "비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요." };
  }

  if (!passwordConfirm || !passwordConfirm.trim()) {
    return { isValid: false, message: "비밀번호 확인을 입력해주세요." };
  }

  if (formData.password !== passwordConfirm) {
    return { isValid: false, message: "비밀번호가 일치하지 않습니다." };
  }

  if (!formData.email || !formData.email.trim()) {
    return { isValid: false, message: "이메일을 입력해주세요." };
  }

  if (!emailRegex.test(formData.email)) {
    return { isValid: false, message: "유효한 이메일 형식이 아닙니다. (예: user@example.com)" };
  }

  return { isValid: true, message: "" };
};

/**
 * Step 2: 사업자 정보 (BizInfo) 검증
 * @param {Object} formData - 폼 데이터
 * @param {boolean} bizNoDuplicate - 사업자번호 중복 여부 (false: 사용가능, true: 중복, null: 미확인)
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateBizInfo = (formData, bizNoDuplicate = null) => {
  if (!formData.bizType || !formData.bizType.trim()) {
    return { isValid: false, message: "업종/업태를 입력해주세요." };
  }

  if (!formData.storeAccNo || !formData.storeAccNo.trim()) {
    return { isValid: false, message: "계좌번호를 입력해주세요." };
  }

  if (bizNoDuplicate !== false) {
    return { isValid: false, message: "사업자번호 중복 확인을 해주세요." };
  }

  if (!formData.ownerNm || !formData.ownerNm.trim()) {
    return { isValid: false, message: "대표 이름을 입력해주세요." };
  }

  if (!formData.ownerTelNo || !formData.ownerTelNo.trim()) {
    return { isValid: false, message: "대표 전화번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.ownerTelNo)) {
    return { isValid: false, message: "대표 전화번호는 숫자만 입력해주세요." };
  }

  if (!formData.bizNm || !formData.bizNm.trim()) {
    return { isValid: false, message: "사업명을 입력해주세요." };
  }

  if (!formData.bizNo || !formData.bizNo.trim()) {
    return { isValid: false, message: "사업자 번호를 입력해주세요." };
  }

  if (!formData.bizRegDate) {
    return { isValid: false, message: "개업일을 입력해주세요." };
  }

  return { isValid: true, message: "" };
};

/**
 * Step 3: 가맹점 정보 (StoreInfo) 검증
 * @param {Object} formData - 폼 데이터
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateStoreInfo = (formData) => {
  if (!formData.storeNm || !formData.storeNm.trim()) {
    return { isValid: false, message: "가게 이름을 입력해주세요." };
  }

  if (!formData.storeTelNo || !formData.storeTelNo.trim()) {
    return { isValid: false, message: "가게 전화번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.storeTelNo)) {
    return { isValid: false, message: "가게 전화번호는 숫자만 입력해주시기 바랍니다." };
  }

  // 주소 검증
  // if (!formData.storeZipCode || !formData.storeAddr) {
  //   return { isValid: false, message: "주소를 입력해주세요." };
  // }

  if (!formData.storeOpenDate || formData.storeOpenDate.length === 0) {
    return { isValid: false, message: "영업일을 선택해주세요." };
  }

  if (!formData.storeOpenTime || !formData.storeCloseTime) {
    return { isValid: false, message: "영업시간을 입력해주세요." };
  }

  return { isValid: true, message: "" };
};

/**
 * Step 4: 파일 정보 및 전체 검증 (FileInfo) 검증
 * @param {Object} formData - 폼 데이터
 * @param {File} storeImage - 가게 대표 이미지
 * @param {Array<File>} businessDocs - 사업자 증명 문서들
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateFileInfo = (formData, storeImage, businessDocs) => {
  // Step 1 검증 (회원 정보)
  if (!formData.loginId || !formData.loginId.trim()) {
    return { isValid: false, message: "아이디가 누락되었습니다." };
  }

  if (formData.loginId.length > 15) {
    return { isValid: false, message: "아이디는 최대 15자까지 가능합니다." };
  }

  if (!formData.password || !formData.password.trim()) {
    return { isValid: false, message: "비밀번호가 누락되었습니다." };
  }

  if (!passwordRegex.test(formData.password)) {
    return { isValid: false, message: "비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요." };
  }

  if (!formData.email || !formData.email.trim()) {
    return { isValid: false, message: "이메일이 누락되었습니다." };
  }

  if (!emailRegex.test(formData.email)) {
    return { isValid: false, message: "이메일 형식에 맞지 않습니다." };
  }

  // Step 2 검증 (사업자 정보)
  if (!formData.ownerNm || !formData.ownerNm.trim()) {
    return { isValid: false, message: "대표 이름을 입력해주세요." };
  }

  if (!formData.ownerTelNo || !formData.ownerTelNo.trim()) {
    return { isValid: false, message: "대표 전화번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.ownerTelNo)) {
    return { isValid: false, message: "대표 전화번호는 숫자만 입력해주세요." };
  }

  if (!formData.bizNm || !formData.bizNm.trim()) {
    return { isValid: false, message: "사업명을 입력해주세요." };
  }

  if (!formData.bizNo || !formData.bizNo.trim()) {
    return { isValid: false, message: "사업자 번호를 입력해주세요." };
  }

  if (!formData.bizRegDate) {
    return { isValid: false, message: "개업일을 입력해주세요." };
  }

  // Step 3 검증 (가맹점 정보)
  if (!formData.bankId) {
    return { isValid: false, message: "은행을 선택해주세요." };
  }

  if (!formData.storeNm || !formData.storeNm.trim()) {
    return { isValid: false, message: "가게 이름을 입력해주세요." };
  }

  if (!formData.storeTelNo || !formData.storeTelNo.trim()) {
    return { isValid: false, message: "가게 전화번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.storeTelNo)) {
    return { isValid: false, message: "가게 전화번호는 숫자만 입력해주시기 바랍니다." };
  }

  if (!formData.storeZipCode || !formData.storeAddr) {
    return { isValid: false, message: "주소를 입력해주세요." };
  }

  if (!formData.storeAccNo || !formData.storeAccNo.trim()) {
    return { isValid: false, message: "계좌번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.storeAccNo)) {
    return { isValid: false, message: "계좌번호는 숫자만 입력해주세요." };
  }

  if (!formData.storeOpenDate || formData.storeOpenDate.length === 0) {
    return { isValid: false, message: "영업일을 선택해주세요." };
  }

  if (!formData.storeOpenTime || !formData.storeCloseTime) {
    return { isValid: false, message: "영업시간을 입력해주세요." };
  }

  if (!formData.storeType || !formData.storeType.trim()) {
    return { isValid: false, message: "사업유형을 선택해주세요." };
  }

  // Step 4 검증 (파일)
  if (!storeImage) {
    return { isValid: false, message: "가게 대표 이미지를 등록해주세요." };
  }

  if (businessDocs.length === 0) {
    return { isValid: false, message: "사업자 증명 문서를 최소 1개 이상 등록해주세요." };
  }

  return { isValid: true, message: "" };
};
