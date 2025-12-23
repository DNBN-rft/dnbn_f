import { apiPut } from "../../../utils/apiClient";
import "./css/employeeregistermodal.css";
import { useState } from "react";

const EmployeeModModal = ({ onClose, member, refreshData }) => {
  const storeCode = JSON.parse(localStorage.getItem("user")).storeCode;
  // 권한 메뉴 정의
  const authMenus = [
    { key: "product", label: "상품" },
    { key: "sale", label: "매출" },
    { key: "review", label: "리뷰" },
    { key: "employee", label: "직원" },
    { key: "order", label: "할인" },
    { key: "service", label: "고객센터" },
  ];

  // DB에서 받은 JSON 문자열을 파싱하여 초기값 설정
  const parseAuthData = (authString) => {
    if (!authString) return {};
    try {
      const parsed = typeof authString === 'string' ? JSON.parse(authString) : authString;
      return parsed;
    } catch (error) {
      return {};
    }
  };

  const [formData, setFormData] = useState({
    memberNm: member?.memberNm || "",
    memberTelNo: member?.memberTelNo || "",
    memberEmail: member?.memberEmail || "",
    memberPw: "",
    memberPwCheck: "",
    memberAuth: parseAuthData(member?.memberAuth),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPhoneNumber = (value) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    const numbersOnly = formatted.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, memberTelNo: numbersOnly }));
  };

  const handleCheckboxChange = (menuKey) => {
    setFormData((prev) => ({
      ...prev,
      memberAuth: {
        ...prev.memberAuth,
        [menuKey]: !prev.memberAuth[menuKey],
      },
    }));
  };

  const handleSelectAll = () => {
    const allAuth = {};
    authMenus.forEach((menu) => {
      allAuth[menu.key] = true;
    });
    setFormData((prev) => ({
      ...prev,
      memberAuth: allAuth,
    }));
  };

  const handleClearAll = () => {
    const noAuth = {};
    authMenus.forEach((menu) => {
      noAuth[menu.key] = false;
    });
    setFormData((prev) => ({
      ...prev,
      memberAuth: noAuth,
    }));
  };

  const isPasswordMatch =
    formData.memberPw === formData.memberPwCheck &&
    formData.memberPw !== "" &&
    formData.memberPwCheck !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      storeCode: storeCode,
      memberNm: formData.memberNm,
      memberTelNo: formData.memberTelNo,
      memberEmail: formData.memberEmail,
      memberPw: formData.memberPw,
      memberPwCheck: formData.memberPwCheck,
      memberAuth: JSON.stringify(formData.memberAuth), // JSON 문자열로 변환
    };
    
    try {
      const response = await apiPut(`/store/member/detail/${member.memberId}`, submitData);

      if (!response.ok) {
        throw new Error("직원 정보 수정에 실패했습니다.");
      }
      
      alert("직원 정보가 성공적으로 수정되었습니다.");
      
      // 데이터 새로고침
      if (refreshData) {
        await refreshData();
      }
      
      onClose();
    } catch (error) {
      alert("직원 정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="emp-reg-backdrop">
      <div className="emp-reg-wrap">
        <div className="emp-reg-header">직원 정보 수정</div>
        <div className="emp-reg-contents">
          <form className="emp-reg-form" onSubmit={handleSubmit}>
            <div className="emp-reg-up">
              <div className="emp-reg-left">
                <label>직원 아이디</label>
                <input type="text" value={member?.memberId || ""} readOnly disabled />
                <label>비밀번호</label>
                <input
                  type="password"
                  name="memberPw"
                  value={formData.memberPw}
                  onChange={handleChange}
                />
                <label>
                  비밀번호 확인
                  {formData.memberPwCheck && !isPasswordMatch && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginLeft: "8px",
                      }}
                    >
                      비밀번호가 일치하지 않습니다
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  name="memberPwCheck"
                  value={formData.memberPwCheck}
                  onChange={handleChange}
                />
              </div>

              <div className="emp-reg-right">
                <label>직원 이름</label>
                <input
                  type="text"
                  name="memberNm"
                  value={formData.memberNm}
                  onChange={handleChange}
                />
                <label>전화번호</label>
                <input
                  type="text"
                  name="memberTelNo"
                  maxLength={13}
                  value={formatPhoneNumber(formData.memberTelNo)}
                  onChange={handlePhoneChange}
                />
                <label>이메일</label>
                <input
                  type="email"
                  name="memberEmail"
                  value={formData.memberEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="emp-reg-down">
              <div className="emp-reg-auth-wrap">
                <label>권한 설정</label>
                <div className="emp-reg-auth-buttons">
                  <button
                    type="button"
                    className="emp-reg-auth-select"
                    onClick={handleSelectAll}
                  >
                    전체 선택
                  </button>
                  <span className="emp-reg-auth-divider">|</span>
                  <button
                    type="button"
                    className="emp-reg-auth-clear"
                    onClick={handleClearAll}
                  >
                    전체 해제
                  </button>
                </div>
              </div>

              <div className="emp-reg-checkbox">
                {authMenus.map((menu) => (
                  <label key={menu.key}>
                    <input
                      type="checkbox"
                      checked={formData.memberAuth[menu.key] || false}
                      onChange={() => handleCheckboxChange(menu.key)}
                    />
                    {menu.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="emp-reg-buttons">
              <button
                type="submit"
                className={
                  formData.memberPwCheck && !isPasswordMatch
                    ? "emp-reg-submit-button-not"
                    : "emp-reg-submit-button"
                }
                disabled={formData.memberPwCheck && !isPasswordMatch}
              >
                수정
              </button>
              <button
                type="button"
                className="emp-reg-cancel-button"
                onClick={onClose}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModModal;
