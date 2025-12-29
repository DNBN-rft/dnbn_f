import "./css/memberinfo.css";
import StepButton from "../register/component/StepButton";
import { useState } from "react";
import { validateMemberInfo } from "../../utils/registerValidation";
import { apiGet } from "../../utils/apiClient";

const MemberInfo = ({ formData, setFormData, next, prev }) => {
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [idCheckStatus, setIdCheckStatus] = useState(null);
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");
  const [passwordCheckStatus, setPasswordCheckStatus] = useState(null);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);

  const getPasswordCheckMessage = (password) => {
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

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });

    // 비밀번호 입력 시 실시간 검증
    if (field === 'password') {
      const { message, status } = getPasswordCheckMessage(value);
      setPasswordCheckMessage(message);
      setPasswordCheckStatus(status);
    }
  };

  const handleEmailChange = (type, value) => {
    if (type === 'id') {
      const emailDomain = formData.email.split('@')[1] || '';
      const newEmail = emailDomain ? `${value}@${emailDomain}` : value;
      setFormData({
        ...formData,
        email: newEmail
      });
    } else if (type === 'domain') {
      const emailId = formData.email.split('@')[0] || '';
      const newEmail = `${emailId}@${value}`;
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
        } else {
          setIdCheckMessage("이미 사용 중인 아이디입니다.");
          setIdCheckStatus("error");
        }
      }
    } catch (error) {
      console.error("ID 중복 체크 실패:", error);
      setIdCheckMessage("중복 체크 실패. 다시 시도해주세요.");
      setIdCheckStatus("error");
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
                    name="email" 
                    className="memberinfo-middle-email-input" 
                    placeholder="이메일 아이디"
                    value={formData.email.split("@")[0] || ""}
                    onChange={(e) => handleEmailChange('id', e.target.value)}
                  />
                  <div className="memberinfo-middle-email-icon">@</div>
                  <input 
                    type="text" 
                    name="email-detail" 
                    className="memberinfo-middle-email-detail-input" 
                    placeholder="이메일 주소"
                    value={formData.email.split("@")[1] || ""}
                    onChange={(e) => handleEmailChange('domain', e.target.value)}
                    disabled={isEmailDisabled}
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
