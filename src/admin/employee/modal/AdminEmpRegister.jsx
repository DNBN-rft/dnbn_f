import { useState, useEffect } from "react";
import "./css/adminempregister.css";
import { registerEmployee, checkDuplicateLoginId } from "../../../utils/adminEmployeeService";
import { getAuthList } from "../../../utils/adminAuthService";

const AdminEmpRegister = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    empId: "",
    empPw: "",
    empPwConfirm: "",
    empTelNo: "",
    authIdx: "",
    empNm: ""
  });

  const [authList, setAuthList] = useState([]);
  const [errors, setErrors] = useState({});
  const [idCheckStatus, setIdCheckStatus] = useState(null); // null, 'available', 'duplicate'
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 권한 목록 불러오기
  useEffect(() => {
    fetchAuthList();
  }, []);

  const fetchAuthList = async () => {
    try {
      const result = await getAuthList();
      if (result.success && result.data) {
        setAuthList(result.data);
      } else {
        throw new Error(result.message || "권한 목록 조회 실패");
      }
    } catch (error) {
      console.error("권한 목록 조회 실패:", error);
      alert("권한 목록을 불러오는데 실패했습니다.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // 아이디 변경 시 중복 체크 상태 초기화
    if (name === "empId") {
      setIdCheckStatus(null);
      setIsIdChecked(false);
    }
  };

  const handleIdCheck = async () => {
    if (!formData.empId.trim()) {
      setErrors(prev => ({ ...prev, empId: "아이디를 입력하세요." }));
      return;
    }

    // 아이디 유효성 검사
    const idRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!idRegex.test(formData.empId)) {
      setErrors(prev => ({ 
        ...prev, 
        empId: "아이디는 4-20자의 영문, 숫자만 사용 가능합니다." 
      }));
      return;
    }

    try {
      const isDuplicate = await checkDuplicateLoginId(formData.empId);
      setIdCheckStatus(isDuplicate ? 'duplicate' : 'available');
      setIsIdChecked(true);
      
      if (isDuplicate) {
        setErrors(prev => ({ ...prev, empId: "이미 사용 중인 아이디입니다." }));
      } else {
        setErrors(prev => ({ ...prev, empId: "" }));
      }
    } catch (error) {
      console.error("아이디 중복 체크 실패:", error);
      alert("아이디 중복 체크에 실패했습니다.");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 아이디 검증
    if (!formData.empId.trim()) {
      newErrors.empId = "아이디를 입력하세요.";
    } else if (!isIdChecked) {
      newErrors.empId = "아이디 중복 확인을 해주세요.";
    } else if (idCheckStatus === 'duplicate') {
      newErrors.empId = "사용할 수 없는 아이디입니다.";
    }

    // 비밀번호 검증
    if (!formData.empPw) {
      newErrors.empPw = "비밀번호를 입력하세요.";
    } else if (formData.empPw.length < 8) {
      newErrors.empPw = "비밀번호는 최소 8자 이상이어야 합니다.";
    }

    // 비밀번호 확인 검증
    if (!formData.empPwConfirm) {
      newErrors.empPwConfirm = "비밀번호 확인을 입력하세요.";
    } else if (formData.empPw !== formData.empPwConfirm) {
      newErrors.empPwConfirm = "비밀번호가 일치하지 않습니다.";
    }

    // 전화번호 검증
    if (!formData.empTelNo.trim()) {
      newErrors.empTelNo = "전화번호를 입력하세요.";
    } else {
      const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
      if (!phoneRegex.test(formData.empTelNo.replace(/-/g, ''))) {
        newErrors.empTelNo = "올바른 전화번호 형식이 아닙니다.";
      }
    }

    // 권한 검증
    if (!formData.authIdx) {
      newErrors.authIdx = "권한을 선택하세요.";
    }

    // 이름 검증
    if (!formData.empNm.trim()) {
      newErrors.empNm = "이름을 입력하세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        empId: formData.empId,
        empPw: formData.empPw,
        empTelNo: formData.empTelNo.replace(/-/g, ''), // 하이픈 제거
        authIdx: parseInt(formData.authIdx),
        empNm: formData.empNm
      };

      await registerEmployee(requestData);
      alert("직원이 성공적으로 등록되었습니다.");
      onSuccess();
    } catch (error) {
      console.error("직원 등록 실패:", error);
      alert(error.message || "직원 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('adminempregister-backdrop')) {
      e.stopPropagation();
    }
  };

  return (
    <div className="adminempregister-backdrop" onClick={handleBackdropClick}>
      <div className="adminempregister-wrap">
        <div className="adminempregister-header">
          <h2 className="adminempregister-title">직원 등록</h2>
          <button className="adminempregister-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="adminempregister-content">
            <div className="adminempregister-form-group">
              <label className="adminempregister-label">
                이름 <span className="adminempregister-required">*</span>
              </label>
              <input 
                type="text" 
                name="empNm"
                className="adminempregister-input"
                value={formData.empNm}
                onChange={handleInputChange}
                placeholder="이름을 입력하세요"
              />
              {errors.empNm && (
                <div className="adminempregister-error">{errors.empNm}</div>
              )}
            </div>

            <div className="adminempregister-form-group">
              <label className="adminempregister-label">
                아이디 <span className="adminempregister-required">*</span>
              </label>
              <div className="adminempregister-input-group">
                <input 
                  type="text" 
                  name="empId"
                  className="adminempregister-input"
                  value={formData.empId}
                  onChange={handleInputChange}
                  placeholder="아이디 (4-20자 영문, 숫자)"
                />
                <button 
                  type="button"
                  className="adminempregister-check-btn"
                  onClick={handleIdCheck}
                >
                  중복확인
                </button>
              </div>
              {errors.empId && (
                <div className="adminempregister-error">{errors.empId}</div>
              )}
              {idCheckStatus === 'available' && (
                <div className="adminempregister-success">사용 가능한 아이디입니다.</div>
              )}
            </div>

            <div className="adminempregister-form-group">
              <label className="adminempregister-label">
                비밀번호 <span className="adminempregister-required">*</span>
              </label>
              <input 
                type="password" 
                name="empPw"
                className="adminempregister-input"
                value={formData.empPw}
                onChange={handleInputChange}
                placeholder="비밀번호 (최소 8자)"
              />
              {errors.empPw && (
                <div className="adminempregister-error">{errors.empPw}</div>
              )}
            </div>

            <div className="adminempregister-form-group">
              <label className="adminempregister-label">
                비밀번호 확인 <span className="adminempregister-required">*</span>
              </label>
              <input 
                type="password" 
                name="empPwConfirm"
                className={`adminempregister-input ${formData.empPwConfirm && formData.empPw && formData.empPw === formData.empPwConfirm ? 'adminempregister-input-success' : ''}`}
                value={formData.empPwConfirm}
                onChange={handleInputChange}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {formData.empPwConfirm && (
                formData.empPw === formData.empPwConfirm ? (
                  <div className="adminempregister-success">비밀번호가 일치합니다.</div>
                ) : (
                  <div className="adminempregister-error">비밀번호가 일치하지 않습니다.</div>
                )
              )}
              {!formData.empPwConfirm && errors.empPwConfirm && (
                <div className="adminempregister-error">{errors.empPwConfirm}</div>
              )}
            </div>

            <div className="adminempregister-form-group">
              <label className="adminempregister-label">
                전화번호 <span className="adminempregister-required">*</span>
              </label>
              <input 
                type="text" 
                name="empTelNo"
                className="adminempregister-input"
                value={formData.empTelNo}
                onChange={handleInputChange}
                placeholder="010-1234-5678"
              />
              {errors.empTelNo && (
                <div className="adminempregister-error">{errors.empTelNo}</div>
              )}
            </div>

            <div className="adminempregister-form-group">
              <label className="adminempregister-label">
                권한 <span className="adminempregister-required">*</span>
              </label>
              <select 
                name="authIdx"
                className="adminempregister-select"
                value={formData.authIdx}
                onChange={handleInputChange}
              >
                <option value="">권한을 선택하세요</option>
                {authList.map(auth => (
                  <option key={auth.authIdx} value={auth.authIdx}>
                    {auth.authNm}
                  </option>
                ))}
              </select>
              {errors.authIdx && (
                <div className="adminempregister-error">{errors.authIdx}</div>
              )}
              
              {formData.authIdx && authList.find(auth => auth.authIdx === parseInt(formData.authIdx))?.menuAuth && (
                <div className="adminempregister-menu-auth">
                  <div className="adminempregister-menu-auth-label">메뉴 권한</div>
                  <div className="adminempregister-menu-auth-tags">
                    {(() => {
                      try {
                        const menuAuth = authList.find(auth => auth.authIdx === parseInt(formData.authIdx))?.menuAuth;
                        const menuArray = Array.isArray(menuAuth) ? menuAuth : [];
                        return menuArray.length > 0 ? (
                          menuArray.map((menu, index) => (
                            <span key={index} className="adminempregister-menu-tag">
                              {menu.displayName}
                            </span>
                          ))
                        ) : (
                          <span className="adminempregister-menu-empty">설정된 메뉴 권한이 없습니다.</span>
                        );
                      } catch (error) {
                        return <span className="adminempregister-menu-empty">메뉴 권한 정보를 불러올 수 없습니다.</span>;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="adminempregister-footer">
            <button 
              type="submit" 
              className="adminempregister-submit-btn"
              disabled={loading}
            >
              {loading ? "등록 중..." : "등록"}
            </button>
            <button 
              type="button"
              className="adminempregister-cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEmpRegister;