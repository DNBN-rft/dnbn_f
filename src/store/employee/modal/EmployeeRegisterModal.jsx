import { apiPost, apiGet } from "../../../utils/apiClient";
import "./css/employeeregistermodal.css";
import { useState, useEffect } from "react";

const EmployeeRegisterModal = ({ onClose, refreshData }) => {

    const [authMenus, setAuthMenus] = useState([]);
    const [selectedAuthCodes, setSelectedAuthCodes] = useState([]);

    const [formData, setFormData] = useState({
        memberId: "",
        memberPw: "",
        memberNm: "",
        memberTelNo: "",
        memberEmail: "",
    });

    // 권한 목록 조회
    useEffect(() => {
        const fetchAuthList = async () => {
            try {
                const response = await apiGet("/store/member/auth");
                if (response.ok) {
                    const data = await response.json();
                    setAuthMenus(data);
                }
            } catch (error) {
                console.error("권한 목록 조회 실패:", error);
            }
        };
        fetchAuthList();
    }, []);

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

    const handleCheckboxChange = (code) => {
        setSelectedAuthCodes((prev) => {
            if (prev.includes(code)) {
                return prev.filter((c) => c !== code);
            } else {
                return [...prev, code];
            }
        });
    };

    const handleSelectAll = () => {
        setSelectedAuthCodes(authMenus.map(menu => menu.code));
    };

    const handleClearAll = () => {
        setSelectedAuthCodes([]);
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
                                <input 
                                    type="text" 
                                    name="memberId"
                                    value={formData.memberId}
                                    onChange={handleChange}
                                    className="emp-reg-id-input" 
                                    required 
                                    placeholder="직원 아이디를 입력하세요." 
                                />
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
                                    <label key={menu.code}>
                                        <input
                                            type="checkbox"
                                            checked={selectedAuthCodes.includes(menu.code)}
                                            onChange={() => handleCheckboxChange(menu.code)}
                                        />
                                        {menu.displayName}
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

        const submitData = {
            storeCode: storeCode,
            memberId: formData.memberId,
            memberPw: formData.memberPw,
            memberNm: formData.memberNm,
            menuAuth: selectedAuthCodes,
            memberTelNo: formData.memberTelNo,
            memberEmail: formData.memberEmail,
            approved: false,
            memberType: "MANAGER",
            marketAgreed: false
        };

        try {
            const response = await apiPost("/store/member/register", submitData);

            if (!response.ok) {
                throw new Error("직원 등록에 실패했습니다.");
            }

            alert("직원이 성공적으로 등록되었습니다.");

            // 데이터 새로고침
            if (refreshData) {
                await refreshData();
            }

            onClose();
        } catch (error) {
            alert("직원 등록에 실패했습니다. 다시 시도해주세요.");
        }
    }
};

export default EmployeeRegisterModal;
