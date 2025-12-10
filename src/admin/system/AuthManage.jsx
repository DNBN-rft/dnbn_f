import { useState, useEffect } from "react";
import "./css/authmanage.css";
import AuthModal from "./modal/AuthModal";

const AuthManage = () => {
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedAuth, setSelectedAuth] = useState(null);
    const [selectedInactive, setSelectedInactive] = useState([]);
    const [selectedActive, setSelectedActive] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 샘플 데이터
    const [authList, setAuthList] = useState([
        { id: 1, name: "관리자", description: "시스템 전체 권한", menus: ["admin-main", "admin-user", "admin-product", "store-order", "store-product"] },
        { id: 2, name: "운영자", description: "일부 시스템 권한", menus: ["admin-notice", "admin-question", "store-notice"] },
        { id: 3, name: "일반 사용자", description: "기본 권한", menus: ["store-mypage", "store-notice"] },
    ]);

    // 전체 메뉴 목록 (모달에서 선택한 메뉴만 표시)
    const allMenus = [
        { id: "admin-main", name: "관리자 메인" },
        { id: "admin-manager", name: "관리자 관리" },
        { id: "admin-user", name: "회원 관리" },
        { id: "admin-store", name: "가게 정보" },
        { id: "admin-product", name: "상품 관리" },
        { id: "admin-review", name: "리뷰 관리" },
        { id: "admin-employee", name: "직원 관리" },
        { id: "admin-notice", name: "공지사항" },
        { id: "admin-question", name: "문의 관리" },
        { id: "admin-report", name: "신고 관리" },
        { id: "admin-alarm", name: "알림 관리" },
        { id: "admin-push", name: "푸시 알림" },
        { id: "admin-category", name: "카테고리 관리" },
        { id: "admin-region", name: "지역 관리" },
        { id: "admin-plan", name: "요금제 관리" },
        { id: "admin-accept", name: "가입 승인" },
        { id: "admin-auth", name: "권한 관리" },
        { id: "admin-category-manage", name: "카테고리 설정" },
        { id: "store-membership", name: "멤버십 정보" },
        { id: "store-mypage", name: "마이페이지" },
        { id: "store-order", name: "주문 관리" },
        { id: "store-negotiation", name: "흥정 관리" },
        { id: "store-static", name: "주문 통계" },
        { id: "store-product", name: "상품 관리" },
        { id: "store-sale", name: "판매 관리" },
        { id: "store-review", name: "리뷰 관리" },
        { id: "store-employee", name: "직원 관리" },
        { id: "store-notice", name: "공지사항" },
        { id: "store-question", name: "문의하기" },
        { id: "store-subscription", name: "구독 플랜" },
    ];

    // 각 권한별 활성화된 메뉴 (샘플)
    const [authMenus, setAuthMenus] = useState({
        1: ["admin-main", "admin-user", "admin-product", "store-order", "store-product"],
        2: ["admin-notice", "admin-question", "store-notice"],
        3: ["store-mypage", "store-notice"],
    });

    // 원본 메뉴 상태 저장 (변경 감지용)
    const [originalAuthMenus, setOriginalAuthMenus] = useState({
        1: ["admin-main", "admin-user", "admin-product", "store-order", "store-product"],
        2: ["admin-notice", "admin-question", "store-notice"],
        3: ["store-mypage", "store-notice"],
    });

    // inactive, active 메뉴 계산 - 선택한 권한의 메뉴만 표시
    const getInactiveMenus = () => {
        if (!selectedAuth) return [];
        const authMenuIds = selectedAuth.menus || [];
        const activeMenuIds = authMenus[selectedAuth.id] || [];
        return allMenus.filter(menu => authMenuIds.includes(menu.id) && !activeMenuIds.includes(menu.id));
    };

    const getActiveMenus = () => {
        if (!selectedAuth) return [];
        const authMenuIds = selectedAuth.menus || [];
        const activeMenuIds = authMenus[selectedAuth.id] || [];
        return allMenus.filter(menu => authMenuIds.includes(menu.id) && activeMenuIds.includes(menu.id));
    };

    // 권한 행 클릭
    const handleAuthClick = (auth) => {
        if (!deleteMode) {
            // 이전 권한의 메뉴 변경사항이 있으면 초기화
            if (selectedAuth && hasChanges) {
                if (window.confirm('저장하지 않은 변경사항이 있습니다. 변경사항을 취소하시겠습니까?')) {
                    // 원본 상태로 되돌리기
                    setAuthMenus(prev => ({
                        ...prev,
                        [selectedAuth.id]: [...(originalAuthMenus[selectedAuth.id] || [])]
                    }));
                } else {
                    return; // 취소하면 권한 변경하지 않음
                }
            }
            
            setSelectedAuth(auth);
            setSelectedInactive([]);
            setSelectedActive([]);
        }
    };

    // authMenus가 변경될 때마다 체크
    useEffect(() => {
        if (!selectedAuth) {
            setHasChanges(false);
            return;
        }
        
        const current = authMenus[selectedAuth.id] || [];
        const original = originalAuthMenus[selectedAuth.id] || [];
        
        const changed = current.length !== original.length || 
                       current.some(id => !original.includes(id));
        
        setHasChanges(changed);
    }, [authMenus, selectedAuth, originalAuthMenus]);

    // inactive 메뉴 선택
    const handleInactiveSelect = (menuId) => {
        // active 선택 초기화
        setSelectedActive([]);
        
        setSelectedInactive(prev => {
            if (prev.includes(menuId)) {
                return prev.filter(id => id !== menuId);
            } else {
                return [...prev, menuId];
            }
        });
    };

    // active 메뉴 선택
    const handleActiveSelect = (menuId) => {
        // inactive 선택 초기화
        setSelectedInactive([]);
        
        setSelectedActive(prev => {
            if (prev.includes(menuId)) {
                return prev.filter(id => id !== menuId);
            } else {
                return [...prev, menuId];
            }
        });
    };

    // 오른쪽 화살표 (inactive -> active)
    const moveToActive = () => {
        if (!selectedAuth || selectedInactive.length === 0) return;
        
        setAuthMenus(prev => ({
            ...prev,
            [selectedAuth.id]: [...(prev[selectedAuth.id] || []), ...selectedInactive]
        }));
        setSelectedInactive([]);
    };

    // 왼쪽 화살표 (active -> inactive)
    const moveToInactive = () => {
        if (!selectedAuth || selectedActive.length === 0) return;
        
        setAuthMenus(prev => ({
            ...prev,
            [selectedAuth.id]: (prev[selectedAuth.id] || []).filter(id => !selectedActive.includes(id))
        }));
        setSelectedActive([]);
    };

    // 저장 버튼
    const handleSave = () => {
        if (!selectedAuth) {
            alert("권한을 선택해주세요.");
            return;
        }
        // 실제로는 서버로 데이터 전송
        alert("권한 메뉴가 저장되었습니다.");
        
        // 원본 상태 업데이트
        setOriginalAuthMenus(prev => ({
            ...prev,
            [selectedAuth.id]: [...(authMenus[selectedAuth.id] || [])]
        }));
        setHasChanges(false);
    };

    // 초기화 버튼
    const handleReset = () => {
        if (!selectedAuth) {
            alert("권한을 선택해주세요.");
            return;
        }
        if (window.confirm("변경사항을 취소하고 초기 상태로 되돌리시겠습니까?")) {
            // 원본 상태로 되돌리기
            setAuthMenus(prev => ({
                ...prev,
                [selectedAuth.id]: [...(originalAuthMenus[selectedAuth.id] || [])]
            }));
            setSelectedInactive([]);
            setSelectedActive([]);
            setHasChanges(false);
        }
    };

    // 삭제 모드 토글
    const toggleDeleteMode = () => {
        setDeleteMode(!deleteMode);
        setCheckedItems([]);
    };

    // 체크박스 선택
    const handleCheckbox = (authId) => {
        setCheckedItems(prev => {
            if (prev.includes(authId)) {
                return prev.filter(id => id !== authId);
            } else {
                return [...prev, authId];
            }
        });
    };

    // 권한 삭제
    const handleDelete = () => {
        if (checkedItems.length === 0) {
            alert("삭제할 권한을 선택해주세요.");
            return;
        }
        if (window.confirm(`선택한 ${checkedItems.length}개의 권한을 삭제하시겠습니까?`)) {
            setAuthList(authList.filter(auth => !checkedItems.includes(auth.id)));
            setCheckedItems([]);
            setDeleteMode(false);
            if (selectedAuth && checkedItems.includes(selectedAuth.id)) {
                setSelectedAuth(null);
            }
        }
    };

    // 모달 열기
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 권한 추가 저장
    const handleSaveAuth = (newAuth) => {
        const newId = Math.max(...authList.map(auth => auth.id)) + 1;
        const authData = {
            id: newId,
            name: newAuth.name,
            description: newAuth.description,
            menus: newAuth.menus,
            isActive: newAuth.isActive
        };
        
        setAuthList([...authList, authData]);
        
        // 새 권한의 메뉴를 authMenus에 추가 (초기에는 모든 메뉴가 active)
        setAuthMenus(prev => ({
            ...prev,
            [newId]: newAuth.menus
        }));
        
        setOriginalAuthMenus(prev => ({
            ...prev,
            [newId]: newAuth.menus
        }));
        
        alert("권한이 추가되었습니다.");
    };

    return (
        <div className="authmanage-container">
            <div className="authmanage-wrap">
                <div className="authmanage-filter-wrap">
                    <div className="authmanage-filter-left">
                        <select name="option" id="option" className="authmanage-select">
                            <option value="all">전체</option>
                            <option value="name">권한명</option>
                        </select>
                        <input type="text" className="authmanage-input" placeholder="검색어를 입력하세요" />
                        <button className="authmanage-search-btn">검색</button>
                    </div>

                    <div className="authmanage-filter-right">
                        {!deleteMode && (
                            <button className="authmanage-add-btn" onClick={handleOpenModal}>권한 추가</button>
                        )}
                        {deleteMode && (
                            <button className="authmanage-confirm-delete-btn" onClick={handleDelete}>
                                삭제 확인
                            </button>
                        )}
                        <button 
                            className={`authmanage-delete-btn ${deleteMode ? 'active' : ''}`}
                            onClick={toggleDeleteMode}
                        >
                            {deleteMode ? '취소' : '권한 삭제'}
                        </button>
                    </div>
                </div>

                <div className="authmanage-content-wrap">
                    <div className="authmanage-content-left">
                        <table className="authmanage-table">
                            <thead>
                                <tr>
                                    {deleteMode && <th>선택</th>}
                                    <th>권한명</th>
                                    <th>설명</th>
                                </tr>
                            </thead>
                            <tbody>
                                {authList.map((auth) => (
                                    <tr 
                                        key={auth.id}
                                        onClick={() => handleAuthClick(auth)}
                                        className={selectedAuth?.id === auth.id ? 'selected' : ''}
                                    >
                                        {deleteMode && (
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <input 
                                                    type="checkbox"
                                                    checked={checkedItems.includes(auth.id)}
                                                    onChange={() => handleCheckbox(auth.id)}
                                                />
                                            </td>
                                        )}
                                        <td>{auth.name}</td>
                                        <td>{auth.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="authmanage-content-right">
                        <div className="authmanage-menu-box">
                            <div className="authmanage-menu-title">접근 불가능 메뉴</div>
                            <div className="authmanage-menu-list">
                                {selectedAuth ? (
                                    getInactiveMenus().map(menu => (
                                        <div 
                                            key={menu.id}
                                            className={`authmanage-menu-item ${selectedInactive.includes(menu.id) ? 'selected' : ''}`}
                                            onClick={() => handleInactiveSelect(menu.id)}
                                        >
                                            {menu.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="authmanage-no-selection">권한을 선택해주세요</div>
                                )}
                            </div>
                        </div>

                        <div className="authmanage-arrow-wrap">
                            <button 
                                className="authmanage-arrow-btn"
                                onClick={moveToActive}
                                disabled={!selectedAuth || selectedInactive.length === 0}
                            >
                                →
                            </button>
                            <button 
                                className="authmanage-arrow-btn"
                                onClick={moveToInactive}
                                disabled={!selectedAuth || selectedActive.length === 0}
                            >
                                ←
                            </button>
                        </div>

                        <div className="authmanage-menu-box">
                            <div className="authmanage-menu-title">접근 가능 메뉴</div>
                            <div className="authmanage-menu-list">
                                {selectedAuth ? (
                                    getActiveMenus().map(menu => (
                                        <div 
                                            key={menu.id}
                                            className={`authmanage-menu-item ${selectedActive.includes(menu.id) ? 'selected' : ''}`}
                                            onClick={() => handleActiveSelect(menu.id)}
                                        >
                                            {menu.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="authmanage-no-selection">권한을 선택해주세요</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="authmanage-save-wrap">
                    <button 
                        className="authmanage-save-btn" 
                        onClick={handleSave}
                        disabled={!hasChanges}
                    >
                        저장
                    </button>
                    <button 
                        className="authmanage-reset-btn" 
                        onClick={handleReset}
                        disabled={!hasChanges}
                    >
                        초기화
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <AuthModal 
                    onClose={handleCloseModal}
                    onSave={handleSaveAuth}
                />
            )}
        </div>
    );
};

export default AuthManage;