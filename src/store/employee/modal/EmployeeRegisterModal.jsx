import "./css/employeeregistermodal.css";
import { useState, useContext } from "react";
import { apiPost } from "../../../utils/apiClient";
import { AuthContext } from "../../../context/AuthContext";

const EmployeeRegisterModal = ({ onClose, refreshData }) => {
    const { user } = useContext(AuthContext);

    // 권한 메뉴 정의 (백엔드 Authority enum에 맞춤)
    const authMenus = [
        { key: "ROLE_PRODUCT", label: "상품관리" },
        { key: "ROLE_ORDER", label: "매출목록" },
        { key: "ROLE_REVIEW", label: "리뷰관리" },
        { key: "ROLE_EMPLOYEE", label: "직원관리" },
        { key: "ROLE_SALE", label: "할인목록" },
        { key: "ROLE_SERVICE", label: "공지사항" },
    ];

    const [formData, setFormData] = useState({
        memberId: "",
        memberPw: "",
        memberNm: "",
        memberTelNo: "",
        memberEmail: "",
        memberAuth: {},
    });

    const [idCheckStatus, setIdCheckStatus] = useState({
        checked: false,
        available: false,
        message: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        if (name === "memberId") {
            setIdCheckStatus({ checked: false, available: false, message: "" });
        }
    };

    const checkDuplicateId = async () => {
        if (!formData.memberId.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/store/check-loginId/${formData.memberId}`, {
                method: "GET",
                credentials: "include"
            });

            if (response.ok) {
                const message = await response.text();
                const isAvailable = message.includes("사용가능");
                
                setIdCheckStatus({
                    checked: true,
                    available: isAvailable,
                    message: message
                });
            }
        } catch (error) {
            alert("중복 체크 중 오류가 발생했습니다.");
        }
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

    return (
        <div className="emp-reg-backdrop">
            <div className="emp-reg-wrap">
                <div className="emp-reg-header">
                    새 직원 등록
                </div>

                <div className="emp-reg-contents">
                    <form className="emp-reg-form" onSubmit={handleSubmit}>
                        <div className="emp-reg-up">
                            <div className="emp-reg-left">
                                <label htmlFor="emp-reg-id">직원 아이디</label>
                                <div className="emp-reg-id-check-wrapper">
                                    <input 
                                        type="text" 
                                        name="memberId"
                                        value={formData.memberId}
                                        onChange={handleChange}
                                        className="emp-reg-id-input" 
                                        required 
                                        placeholder="직원 아이디를 입력하세요." 
                                    />
                                    <button
                                        type="button"
                                        onClick={checkDuplicateId}
                                        className="emp-reg-id-check-button"
                                    >
                                        중복확인
                                    </button>
                                </div>
                                {idCheckStatus.checked && (
                                    <div className={`emp-reg-id-check-message ${idCheckStatus.available ? 'emp-reg-id-check-success' : 'emp-reg-id-check-error'}`}>
                                        {idCheckStatus.message}
                                    </div>
                                )}
                                <label htmlFor="emp-reg-pwd">비밀번호</label>
                                <input 
                                    type="password" 
                                    name="memberPw"
                                    value={formData.memberPw}
                                    onChange={handleChange}
                                    className="emp-reg-pwd-input" 
                                    required 
                                    placeholder="직원 비밀번호를 입력하세요." 
                                />
                            </div>

                            <div className="emp-reg-right">
                                <label htmlFor="emp-reg-name">직원 이름</label>
                                <input 
                                    type="text" 
                                    name="memberNm"
                                    value={formData.memberNm}
                                    onChange={handleChange}
                                    className="emp-reg-name-input" 
                                    required 
                                    placeholder="직원 이름을 입력하세요." 
                                />
                                <label htmlFor="emp-reg-telno">전화번호</label>
                                <input 
                                    type="text" 
                                    name="memberTelNo"
                                    value={formatPhoneNumber(formData.memberTelNo)}
                                    onChange={handlePhoneChange}
                                    className="emp-reg-telno-input" 
                                    maxLength={13}
                                    required 
                                    placeholder="01000000000" 
                                />
                                <label htmlFor="emp-reg-email">이메일</label>
                                <input 
                                    type="email" 
                                    name="memberEmail"
                                    value={formData.memberEmail}
                                    onChange={handleChange}
                                    className="emp-reg-email-input" 
                                    required 
                                    placeholder="이메일을 입력하세요." 
                                />
                            </div>
                        </div>

                        <div className="emp-reg-down">
                            <div className="emp-reg-auth-wrap">
                                <label htmlFor="emp-reg-auth-label">권한 설정</label>
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
                            <button type="submit" className="emp-reg-submit-button">
                                등록
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

    async function handleSubmit(e) {
        e.preventDefault();

        let userInfo = localStorage.getItem("user");
        const storeCode = JSON.parse(userInfo).storeCode;

        if (!idCheckStatus.checked) {
            alert("아이디 중복확인을 해주세요.");
            return;
        }

        if (!idCheckStatus.available) {
            alert("사용 가능한 아이디로 변경해주세요.");
            return;
        }

        // 선택된 권한을 쉼표로 구분된 문자열로 변환
        const selectedAuths = Object.keys(formData.memberAuth)
            .filter(key => formData.memberAuth[key])
            .join(",");

        if (!selectedAuths) {
            alert("최소 하나 이상의 권한을 선택해주세요.");
            return;
        }

        const submitData = {
            storeCode: storeCode,
            memberId: formData.memberId,
            memberPw: formData.memberPw,
            memberNm: formData.memberNm,
            menuAuth: JSON.stringify(formData.memberAuth),
            memberTelNo: formData.memberTelNo,
            memberEmail: formData.memberEmail,
            approved: true,
            memberType: "MANAGER",
            marketAgreed: formData.marketAgreed,
        };

        try {
            const response = await apiPost("/member/register", submitData);

            if (response.ok) {
                alert("직원이 성공적으로 등록되었습니다.");

                if (refreshData) {
                    await refreshData();
                }

                onClose();
            } else {
                const errorText = await response.text();
                alert(`직원 등록에 실패했습니다: ${errorText}`);
            }
        } catch (error) {
            alert("직원 등록 중 오류가 발생했습니다.");
        }
    }
};

export default EmployeeRegisterModal;
