import { useState, useEffect } from "react";
import "./css/authmodal.css";
import { apiPost, apiGet } from "../../../utils/apiClient";

const AuthModal = ({ onClose, onSave }) => {
    const [authName, setAuthName] = useState("");
    const [description, setDescription] = useState("");
    const [authType, setAuthType] = useState("ADMIN");
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [availableMenus, setAvailableMenus] = useState([]);

    // 사용 가능한 메뉴 목록 조회
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await apiGet("/admin/auth");
                if (response.ok) {
                    const data = await response.json();

                    // 모든 권한에서 메뉴를 추출해서 중복 제거
                    const menusMap = new Map();
                    data.forEach(auth => {
                        auth.menuAuth.forEach(menu => {
                            if (!menusMap.has(menu.code)) {
                                menusMap.set(menu.code, menu);
                            }
                        });
                    });
                    setAvailableMenus(Array.from(menusMap.values()));
                }
            } catch (error) {
                console.error("메뉴 목록 조회 실패:", error);
            }
        };
        fetchMenus();
    }, []);

    // authType별로 메뉴 필터링
    const getMenusByAuthType = (type) => {
        const authTypeMenuMap = {
            "ADMIN": "ADMIN_",
            "STORE": "STORE_",
            "CUST": "CUST_"
        };
        
        const prefix = authTypeMenuMap[type];
        return availableMenus.filter(menu => menu.code.startsWith(prefix));
    };

    // 카테고리별 전체 선택
    const handleSelectAllByType = (type) => {
        const menusByType = getMenusByAuthType(type);
        const menuCodesInType = menusByType.map(m => m.code);
        
        setSelectedMenus(prev => {
            const newMenus = new Set(prev);
            menuCodesInType.forEach(code => newMenus.add(code));
            return Array.from(newMenus);
        });
    };

    // 카테고리별 선택 해제
    const handleClearByType = (type) => {
        const menusByType = getMenusByAuthType(type);
        const menuCodesInType = menusByType.map(m => m.code);
        
        setSelectedMenus(prev => 
            prev.filter(code => !menuCodesInType.includes(code))
        );
    };

    const handleSubmit = async () => {
        if (!authName.trim()) {
            alert("권한명을 입력해주세요.");
            return;
        }
        if (!description.trim()) {
            alert("설명을 입력해주세요.");
            return;
        }
        if (selectedMenus.length === 0) {
            alert("최소 1개 이상의 메뉴를 선택해주세요.");
            return;
        }

        try {
            const response = await apiPost("/admin/auth", {
                authNm: authName,
                authDescription: description,
                authType: authType,
                menuAuth: selectedMenus,
                isUsed: true
            });

            if (response.ok) {
                alert("권한이 등록되었습니다.");
                onSave({
                    name: authName,
                    description: description,
                    menuCodes: selectedMenus
                });
                onClose();
            } else {
                alert("권한 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("권한 등록 실패:", error);
            alert("권한 등록 중 오류가 발생했습니다.");
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('authmodal-backdrop')) {
            e.stopPropagation();
        }
    };

    return (
        <div className="authmodal-backdrop" onClick={handleBackdropClick}>
            <div className="authmodal-wrap">
                <div className="authmodal-header">
                    <h2 className="authmodal-title">권한 추가</h2>
                    <button className="authmodal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="authmodal-content">
                    <div className="authmodal-form-group">
                        <label className="authmodal-label">권한명</label>
                        <input 
                            type="text" 
                            className="authmodal-input"
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            placeholder="권한명을 입력하세요"
                        />
                    </div>

                    <div className="authmodal-form-group">
                        <label className="authmodal-label">설명</label>
                        <textarea 
                            className="authmodal-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="권한 설명을 입력하세요"
                            rows="3"
                        />
                    </div>

                    <div className="authmodal-form-group">
                        <label className="authmodal-label">권한 타입</label>
                        <div className="authmodal-radio-group">
                            <label className="authmodal-radio-label">
                                <input 
                                    type="radio" 
                                    name="authType"
                                    value="ADMIN"
                                    checked={authType === "ADMIN"}
                                    onChange={(e) => setAuthType(e.target.value)}
                                />
                                <span>관리자</span>
                            </label>
                            <label className="authmodal-radio-label">
                                <input 
                                    type="radio" 
                                    name="authType"
                                    value="STORE"
                                    checked={authType === "STORE"}
                                    onChange={(e) => setAuthType(e.target.value)}
                                />
                                <span>가맹점</span>
                            </label>
                            <label className="authmodal-radio-label">
                                <input 
                                    type="radio" 
                                    name="authType"
                                    value="CUST"
                                    checked={authType === "CUST"}
                                    onChange={(e) => setAuthType(e.target.value)}
                                />
                                <span>일반 사용자</span>
                            </label>
                        </div>
                    </div>

                    <div className="authmodal-form-group">
                        <label className="authmodal-label">메뉴 선택</label>
                        
                        {/* 관리자 메뉴 */}
                        <div className="authmodal-menu-section">
                            <div className="authmodal-menu-category-header">
                                <h3 className="authmodal-menu-category-title">관리자 메뉴</h3>
                                <div className="authmodal-menu-btn-group">
                                    <button 
                                        type="button"
                                        className="authmodal-select-all-btn"
                                        onClick={() => handleSelectAllByType("ADMIN")}
                                    >
                                        전체 선택
                                    </button>
                                    <button 
                                        type="button"
                                        className="authmodal-reset-btn"
                                        onClick={() => handleClearByType("ADMIN")}
                                    >
                                        해제
                                    </button>
                                </div>
                            </div>
                            <div className="authmodal-menu-grid">
                                {getMenusByAuthType("ADMIN").map(menu => (
                                    <label key={menu.code} className="authmodal-checkbox-label">
                                        <input 
                                            type="checkbox"
                                            checked={selectedMenus.includes(menu.code)}
                                            onChange={() => {
                                                setSelectedMenus(prev => 
                                                    prev.includes(menu.code)
                                                        ? prev.filter(m => m !== menu.code)
                                                        : [...prev, menu.code]
                                                );
                                            }}
                                        />
                                        <span>{menu.displayName}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 가맹점 메뉴 */}
                        <div className="authmodal-menu-section">
                            <div className="authmodal-menu-category-header">
                                <h3 className="authmodal-menu-category-title">가맹점 메뉴</h3>
                                <div className="authmodal-menu-btn-group">
                                    <button 
                                        type="button"
                                        className="authmodal-select-all-btn"
                                        onClick={() => handleSelectAllByType("STORE")}
                                    >
                                        전체 선택
                                    </button>
                                    <button 
                                        type="button"
                                        className="authmodal-reset-btn"
                                        onClick={() => handleClearByType("STORE")}
                                    >
                                        해제
                                    </button>
                                </div>
                            </div>
                            <div className="authmodal-menu-grid">
                                {getMenusByAuthType("STORE").map(menu => (
                                    <label key={menu.code} className="authmodal-checkbox-label">
                                        <input 
                                            type="checkbox"
                                            checked={selectedMenus.includes(menu.code)}
                                            onChange={() => {
                                                setSelectedMenus(prev => 
                                                    prev.includes(menu.code)
                                                        ? prev.filter(m => m !== menu.code)
                                                        : [...prev, menu.code]
                                                );
                                            }}
                                        />
                                        <span>{menu.displayName}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 일반 사용자 메뉴 */}
                        <div className="authmodal-menu-section">
                            <div className="authmodal-menu-category-header">
                                <h3 className="authmodal-menu-category-title">일반 사용자 메뉴</h3>
                                <div className="authmodal-menu-btn-group">
                                    <button 
                                        type="button"
                                        className="authmodal-select-all-btn"
                                        onClick={() => handleSelectAllByType("CUST")}
                                    >
                                        전체 선택
                                    </button>
                                    <button 
                                        type="button"
                                        className="authmodal-reset-btn"
                                        onClick={() => handleClearByType("CUST")}
                                    >
                                        해제
                                    </button>
                                </div>
                            </div>
                            <div className="authmodal-menu-grid">
                                {getMenusByAuthType("CUST").map(menu => (
                                    <label key={menu.code} className="authmodal-checkbox-label">
                                        <input 
                                            type="checkbox"
                                            checked={selectedMenus.includes(menu.code)}
                                            onChange={() => {
                                                setSelectedMenus(prev => 
                                                    prev.includes(menu.code)
                                                        ? prev.filter(m => m !== menu.code)
                                                        : [...prev, menu.code]
                                                );
                                            }}
                                        />
                                        <span>{menu.displayName}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="authmodal-footer">
                    <button className="authmodal-submit-btn" onClick={handleSubmit}>
                        추가
                    </button>
                    <button className="authmodal-cancel-btn" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;