import { useState } from "react";
import "./css/authmodal.css";

const AuthModal = ({ onClose, onSave }) => {
    const [authName, setAuthName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [selectedMenus, setSelectedMenus] = useState([]);

    // Admin 메뉴 목록
    const adminMenus = [
        { id: "admin-main", name: "관리자 메인", category: "admin" },
        { id: "admin-manager", name: "관리자 관리", category: "admin" },
        { id: "admin-user", name: "회원 관리", category: "admin" },
        { id: "admin-store", name: "가게 정보", category: "admin" },
        { id: "admin-product", name: "상품 관리", category: "admin" },
        { id: "admin-review", name: "리뷰 관리", category: "admin" },
        { id: "admin-employee", name: "직원 관리", category: "admin" },
        { id: "admin-notice", name: "공지사항", category: "admin" },
        { id: "admin-question", name: "문의 관리", category: "admin" },
        { id: "admin-report", name: "신고 관리", category: "admin" },
        { id: "admin-alarm", name: "알림 관리", category: "admin" },
        { id: "admin-push", name: "푸시 알림", category: "admin" },
        { id: "admin-category", name: "카테고리 관리", category: "admin" },
        { id: "admin-region", name: "지역 관리", category: "admin" },
        { id: "admin-plan", name: "요금제 관리", category: "admin" },
        { id: "admin-accept", name: "가입 승인", category: "admin" },
        { id: "admin-auth", name: "권한 관리", category: "admin" },
        { id: "admin-category-manage", name: "카테고리 설정", category: "admin" },
    ];

    // Store 메뉴 목록
    const storeMenus = [
        { id: "store-membership", name: "멤버십 정보", category: "store" },
        { id: "store-mypage", name: "마이페이지", category: "store" },
        { id: "store-order", name: "주문 관리", category: "store" },
        { id: "store-negotiation", name: "흥정 관리", category: "store" },
        { id: "store-static", name: "주문 통계", category: "store" },
        { id: "store-product", name: "상품 관리", category: "store" },
        { id: "store-sale", name: "판매 관리", category: "store" },
        { id: "store-review", name: "리뷰 관리", category: "store" },
        { id: "store-employee", name: "직원 관리", category: "store" },
        { id: "store-notice", name: "공지사항", category: "store" },
        { id: "store-question", name: "문의하기", category: "store" },
        { id: "store-subscription", name: "구독 플랜", category: "store" },
    ];

    const handleMenuToggle = (menuId) => {
        setSelectedMenus(prev => {
            if (prev.includes(menuId)) {
                return prev.filter(id => id !== menuId);
            } else {
                return [...prev, menuId];
            }
        });
    };

    // Admin 메뉴 전체선택
    const handleSelectAllAdmin = () => {
        const adminMenuIds = adminMenus.map(m => m.id);
        setSelectedMenus(prev => {
            const newMenus = [...prev];
            adminMenuIds.forEach(id => {
                if (!newMenus.includes(id)) {
                    newMenus.push(id);
                }
            });
            return newMenus;
        });
    };

    // Store 메뉴 전체선택
    const handleSelectAllStore = () => {
        const storeMenuIds = storeMenus.map(m => m.id);
        setSelectedMenus(prev => {
            const newMenus = [...prev];
            storeMenuIds.forEach(id => {
                if (!newMenus.includes(id)) {
                    newMenus.push(id);
                }
            });
            return newMenus;
        });
    };

    // Admin 메뉴 초기화
    const handleResetAdmin = () => {
        const adminMenuIds = adminMenus.map(m => m.id);
        setSelectedMenus(prev => prev.filter(id => !adminMenuIds.includes(id)));
    };

    // Store 메뉴 초기화
    const handleResetStore = () => {
        const storeMenuIds = storeMenus.map(m => m.id);
        setSelectedMenus(prev => prev.filter(id => !storeMenuIds.includes(id)));
    };

    const handleSubmit = () => {
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

        const newAuth = {
            name: authName,
            description: description,
            menus: selectedMenus,
            isActive: isActive
        };

        onSave(newAuth);
        onClose();
    };

    const handleBackdropClick = (e) => {
        // 백드롭 클릭 시 아무 동작 안함 (모달 내부 닫기 버튼만 동작)
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
                        <label className="authmodal-label">사용여부</label>
                        <div className="authmodal-radio-group">
                            <label className="authmodal-radio-label">
                                <input 
                                    type="radio" 
                                    name="isActive"
                                    checked={isActive === true}
                                    onChange={() => setIsActive(true)}
                                />
                                <span>사용</span>
                            </label>
                            <label className="authmodal-radio-label">
                                <input 
                                    type="radio" 
                                    name="isActive"
                                    checked={isActive === false}
                                    onChange={() => setIsActive(false)}
                                />
                                <span>미사용</span>
                            </label>
                        </div>
                    </div>

                    <div className="authmodal-form-group">
                        <label className="authmodal-label">메뉴 선택</label>
                        
                        <div className="authmodal-menu-section">
                            <div className="authmodal-menu-category-header">
                                <h3 className="authmodal-menu-category-title">Admin 메뉴</h3>
                                <div className="authmodal-menu-btn-group">
                                    <button 
                                        type="button"
                                        className="authmodal-select-all-btn"
                                        onClick={handleSelectAllAdmin}
                                    >
                                        전체 선택
                                    </button>
                                    <button 
                                        type="button"
                                        className="authmodal-reset-btn"
                                        onClick={handleResetAdmin}
                                    >
                                        초기화
                                    </button>
                                </div>
                            </div>
                            <div className="authmodal-menu-grid">
                                {adminMenus.map(menu => (
                                    <label key={menu.id} className="authmodal-checkbox-label">
                                        <input 
                                            type="checkbox"
                                            checked={selectedMenus.includes(menu.id)}
                                            onChange={() => handleMenuToggle(menu.id)}
                                        />
                                        <span>{menu.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="authmodal-menu-section">
                            <div className="authmodal-menu-category-header">
                                <h3 className="authmodal-menu-category-title">Store 메뉴</h3>
                                <div className="authmodal-menu-btn-group">
                                    <button 
                                        type="button"
                                        className="authmodal-select-all-btn"
                                        onClick={handleSelectAllStore}
                                    >
                                        전체 선택
                                    </button>
                                    <button 
                                        type="button"
                                        className="authmodal-reset-btn"
                                        onClick={handleResetStore}
                                    >
                                        초기화
                                    </button>
                                </div>
                            </div>
                            <div className="authmodal-menu-grid">
                                {storeMenus.map(menu => (
                                    <label key={menu.id} className="authmodal-checkbox-label">
                                        <input 
                                            type="checkbox"
                                            checked={selectedMenus.includes(menu.id)}
                                            onChange={() => handleMenuToggle(menu.id)}
                                        />
                                        <span>{menu.name}</span>
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