import "./css/memberinfo.css";
import StepButton from "../register/component/StepButton";
import { useState, useEffect } from "react";
import { 
  validateMemberInfo, 
  getPasswordCheckMessage,
  restrictLoginId,
  restrictPassword,
  restrictEmail
} from "../../utils/registerValidation";
import { apiGet } from "../../utils/apiClient";

const MemberInfo = ({ formData, setFormData, next, prev }) => {
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [idCheckStatus, setIdCheckStatus] = useState(null);
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");
  const [passwordCheckStatus, setPasswordCheckStatus] = useState(null);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);
  const [checkedLoginId, setCheckedLoginId] = useState(""); // 중복체크한 아이디 저장

  // 컴포넌트 마운트 시 이전 중복체크 결과 복원
  useEffect(() => {
    if (formData.idCheckStatus && formData.checkedLoginId === formData.loginId) {
      setIdCheckStatus(formData.idCheckStatus);
      setCheckedLoginId(formData.checkedLoginId);
      if (formData.idCheckStatus === "success") {
        setIdCheckMessage("사용 가능한 아이디입니다.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // loginId 변경 시 중복체크 초기화
  useEffect(() => {
    if (checkedLoginId && formData.loginId !== checkedLoginId) {
      setIdCheckStatus(null);
      setIdCheckMessage("");
      setCheckedLoginId("");
      setFormData(prev => ({
        ...prev,
        idCheckStatus: null,
        checkedLoginId: ""
      }));
    }
  }, [formData.loginId, checkedLoginId, setFormData]);

  const handleInputChange = (field, value) => {
    // 필드별 입력 제한 적용
    let restrictedValue = value;
    
    if (field === 'loginId') {
      restrictedValue = restrictLoginId(value);
    } else if (field === 'password') {
      restrictedValue = restrictPassword(value);
    }
    
    setFormData({
      ...formData,
      [field]: restrictedValue
    });

    // 비밀번호 입력 시 실시간 검증 (util 함수 사용)
    if (field === 'password') {
      const { message, status } = getPasswordCheckMessage(restrictedValue);
      setPasswordCheckMessage(message);
      setPasswordCheckStatus(status);
    }
  };

  const handleEmailChange = (type, value) => {
    // 이메일 입력 제한 적용
    const restrictedValue = restrictEmail(value);
    
    if (type === 'id') {
      const emailDomain = formData.email.split('@')[1] || '';
      const newEmail = emailDomain ? `${restrictedValue}@${emailDomain}` : restrictedValue;
      setFormData({
        ...formData,
        email: newEmail
      });
    } else if (type === 'domain') {
      const emailId = formData.email.split('@')[0] || '';
      const newEmail = `${emailId}@${restrictedValue}`;
      setFormData({
        ...formData,
        email: newEmail
      });
    }
  };

  const handleIdCheck = async () => {
    if (!formData.loginId.trim()) {
      setIdCheckMessage("아이디를 입력해주세요.");
      setIdCheckStatus("error");
      return;
    }

    try {
      const response = await apiGet(`/store/check-loginId/${formData.loginId}`);
      
      if (response.ok) {
        const data = await response.text();
        if (data.includes("사용가능")) {
          setIdCheckMessage("사용 가능한 아이디입니다.");
          setIdCheckStatus("success");
          setCheckedLoginId(formData.loginId);
          // formData에 저장하여 페이지 이동 후에도 유지
          setFormData({
            ...formData,
            idCheckStatus: "success",
            checkedLoginId: formData.loginId
          });
        } else {
          setIdCheckMessage("이미 사용 중인 아이디입니다.");
          setIdCheckStatus("error");
          setCheckedLoginId("");
          setFormData({
            ...formData,
            idCheckStatus: "error",
            checkedLoginId: ""
          });
        }
      }
    } catch (error) {
      console.error("ID 중복 체크 실패:", error);
      setIdCheckMessage("중복 체크 실패. 다시 시도해주세요.");
      setIdCheckStatus("error");
      setCheckedLoginId("");
    }
  };

  const handleNext = () => {
    const validation = validateMemberInfo(formData, idCheckStatus, passwordConfirm);
    
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    next();
  };
  return (
    <div className="memberinfo-container">
      <div className="memberinfo-wrap">
            <div className="memberinfo-header">
                <div className="memberinfo-header-title">회원가입</div>
                <div className="memberinfo-header-text">1/4</div>
                <progress className="memberinfo-progress" value="1" max="4">25%</progress>
            </div>

            <div className="memberinfo-middle-title">회원 정보 입력</div>
            <div className="memberinfo-middle-content">
                <div className="memberinfo-middle-subtitle">아이디</div>
                <div className="memberinfo-middle-id-div">
                    <input 
                      type="text" 
                      name="userid" 
                      className="memberinfo-middle-id-input" 
                      placeholder="로그인 아이디"
                      value={formData.loginId}
                      onChange={(e) => handleInputChange('loginId', e.target.value)}
                    />
                    <div className="memberinfo-middle-confirmid" onClick={handleIdCheck}>중복체크</div>
                </div>
                {idCheckMessage && (
                  <div style={{ color: idCheckStatus === "success" ? "green" : "red", fontSize: "12px", marginTop: "5px" }}>
                    {idCheckMessage}
                  </div>
                )}
                <div className="memberinfo-middle-subtitle">비밀번호</div>
                <div>
                  <input 
                    type="password" 
                    name="password" 
                    className="memberinfo-middle-pw-input" 
                    placeholder="비밀번호 입력"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                {passwordCheckMessage && (
                  <div style={{ color: passwordCheckStatus === "success" ? "green" : "red", fontSize: "12px", marginTop: "5px" }}>
                    {passwordCheckMessage}
                  </div>
                )}
                <div className="memberinfo-middle-subtitle">비밀번호 확인</div>
                <div>
                  <input 
                    type="password" 
                    name="password-confirm" 
                    className="memberinfo-middle-pw-input" 
                    placeholder="비밀번호 확인"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </div>

                <div className="memberinfo-middle-subtitle">이메일</div>
                <div className="memberinfo-middle-email-div">

                  <input 
                    type="text" 
                    name="email-username" 
                    className="memberinfo-middle-email-input" 
                    placeholder="이메일 아이디"
                    value={formData.email.split("@")[0] || ""}
                    onChange={(e) => handleEmailChange('id', e.target.value)}
                    autoComplete="off"
                  />
                  <div className="memberinfo-middle-email-icon">@</div>
                  <input 
                    type="text" 
                    name="email-domain" 
                    className="memberinfo-middle-email-detail-input" 
                    placeholder="이메일 주소"
                    value={formData.email.split("@")[1] || ""}
                    onChange={(e) => handleEmailChange('domain', e.target.value)}
                    disabled={isEmailDisabled}
                    autoComplete="off"
                  />
                </div>
                <div>
                    <select 
                      name="email-select" 
                      id="email" 
                      className="memberinfo-middle-email-select"
                      onChange={(e) => {
                        if (e.target.value !== "self") {
                          handleEmailChange('domain', e.target.value);
                          setIsEmailDisabled(true);
                        } else {
                          setIsEmailDisabled(false);
                        }
                      }}
                    >
                      <option value="self">직접입력</option>
                      <option value="naver.com">네이버</option>
                      <option value="daum.net">다음</option>
                      <option value="gmail.com">구글</option>
                      <option value="nate.com">네이트</option>
                    </select>
                </div>
                <StepButton prev={prev} next={handleNext} />
            </div>
      </div>
    </div>
  );
};

export default MemberInfo;
