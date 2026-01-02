import { useState, useEffect } from "react";
import "./css/authmanage.css";
import AuthModal from "./modal/AuthModal";
import { apiGet, apiPut, apiDelete } from "../../utils/apiClient";

const AuthManage = () => {
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedAuth, setSelectedAuth] = useState(null);
    const [selectedInactive, setSelectedInactive] = useState([]);
    const [selectedActive, setSelectedActive] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [authList, setAuthList] = useState([]);
    const [authMenus, setAuthMenus] = useState({});
    const [originalAuthMenus, setOriginalAuthMenus] = useState({});
    const [allMenus, setAllMenus] = useState([]);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [searchType, setSearchType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // 기본 권한 (수정 불가)
    const DEFAULT_AUTH_IDS = [1, 2, 3];

    const authTypeLabels = {
        "ADMIN": "관리자",
        "STORE": "가맹점",
        "CUST": "일반 사용자"
    };

    // 권한 목록 조회
    useEffect(() => {
        const fetchAuthList = async () => {
            try {
                const response = await apiGet("/admin/auth");
                if (response.ok) {
                    const data = await response.json();

                    const formattedAuthList = data.map(auth => ({
                        id: auth.authIdx,
                        name: auth.authNm,
                        description: auth.authDescription,
                        menus: auth.menuAuth.map(m => m.code),
                        authType: auth.authType
                    }));
                    setAuthList(formattedAuthList);

                    // allMenus 구축 (모든 권한의 메뉴를 모음)
                    const menusMap = new Map();
                    data.forEach(auth => {
                        auth.menuAuth.forEach(menu => {
                            if (!menusMap.has(menu.code)) {
                                menusMap.set(menu.code, {
                                    id: menu.code,
                                    name: menu.displayName
                                });
                            }
                        });
                    });
                    setAllMenus(Array.from(menusMap.values()));

                    // originalAuthMenus 초기화
                    const originalMenus = {};
                    const authMenusInit = {};
                    formattedAuthList.forEach(auth => {
                        originalMenus[auth.id] = auth.menus;
                        authMenusInit[auth.id] = auth.menus;
                    });
                    setOriginalAuthMenus(originalMenus);
                    setAuthMenus(authMenusInit);
                }
            } catch (error) {
                console.error("권한 목록 조회 실패:", error);
            }
        };
        fetchAuthList();
    }, []);

    // inactive, active 메뉴 계산 - 기본 권한(1,2,3)의 권한과 비교
    // 접근 불가능 메뉴 = 같은 authType의 기본 권한 menuAuth 중 현재 권한에 없는 메뉴
    const getInactiveMenus = () => {
        if (!selectedAuth) return [];
        
        // 같은 authType의 기본 권한 찾기
        let baseAuthMenus = [];
        if (!DEFAULT_AUTH_IDS.includes(selectedAuth.id)) {
            // 선택한 권한이 기본 권한이 아닌 경우
            const baseAuth = authList.find(auth => 
                DEFAULT_AUTH_IDS.includes(auth.id) && auth.authType === selectedAuth.authType
            );
            if (baseAuth) {
                baseAuthMenus = baseAuth.menus || [];
            }
        } else {
            // 선택한 권한이 기본 권한인 경우 (수정 불가이므로 빈 배열)
            baseAuthMenus = [];
        }
        
        const currentMenuIds = authMenus[selectedAuth.id] || [];

        return allMenus.filter(menu =>
            baseAuthMenus.includes(menu.id) && !currentMenuIds.includes(menu.id)
        );
    };

    // 접근 가능 메뉴 = 현재 authMenus에 있는 메뉴
    const getActiveMenus = () => {
        if (!selectedAuth) return [];
        const currentMenuIds = authMenus[selectedAuth.id] || [];

        return allMenus.filter(menu => currentMenuIds.includes(menu.id));
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
            // 기본 권한 여부 확인
            setIsReadOnly(DEFAULT_AUTH_IDS.includes(auth.id));
            // 새 권한 선택 시 authMenus 초기화 (원본 menuAuth로)
            setAuthMenus(prev => ({
                ...prev,
                [auth.id]: auth.menus
            }));
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
        if (isReadOnly) return; // 기본 권한이면 선택 불가
        
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
        if (isReadOnly) return; // 기본 권한이면 선택 불가
        
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
    const handleSave = async () => {
        if (!selectedAuth) {
            alert("권한을 선택해주세요.");
            return;
        }

        try {
            const menuAuthCodes = authMenus[selectedAuth.id] || [];
            const response = await apiPut(`/admin/auth/${selectedAuth.id}`, {
                menuAuth: menuAuthCodes
            });

            if (response.ok) {
                alert("권한 메뉴가 저장되었습니다.");

                // 원본 상태 업데이트
                setOriginalAuthMenus(prev => ({
                    ...prev,
                    [selectedAuth.id]: [...menuAuthCodes]
                }));
                setHasChanges(false);
                
                // 페이지 새로고침
                window.location.reload();
            } else {
                alert("권한 저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("권한 저장 실패:", error);
            alert("권한 저장 중 오류가 발생했습니다.");
        }
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
    const handleDelete = async () => {
        if (checkedItems.length === 0) {
            alert("삭제할 권한을 선택해주세요.");
            return;
        }
        
        // 기본 권한 삭제 방지
        const hasDefaultAuth = checkedItems.some(id => DEFAULT_AUTH_IDS.includes(id));
        if (hasDefaultAuth) {
            alert("기본 권한은 삭제할 수 없습니다.");
            return;
        }
        
        if (window.confirm(`선택한 ${checkedItems.length}개의 권한을 삭제하시겠습니까?`)) {
            try {
                const response = await apiDelete("/admin/auth", {
                    body: JSON.stringify({
                        deleteAuthList: checkedItems
                    })
                });

                if (response.ok) {
                    alert("권한이 삭제되었습니다.");
                    setAuthList(authList.filter(auth => !checkedItems.includes(auth.id)));
                    setCheckedItems([]);
                    setDeleteMode(false);
                    if (selectedAuth && checkedItems.includes(selectedAuth.id)) {
                        setSelectedAuth(null);
                    }
                } else {
                    alert("권한 삭제에 실패했습니다.");
                }
            } catch (error) {
                console.error("권한 삭제 실패:", error);
                alert("권한 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // 검색 함수
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }

        try {
            const queryString = `?searchType=${encodeURIComponent(searchType)}&searchTerm=${encodeURIComponent(searchTerm)}`;
            const response = await apiGet(`/admin/auth/search${queryString}`);

            console.log(queryString)
            if (response.ok) {
                const data = await response.json();
                
                const formattedAuthList = data.map(auth => ({
                    id: auth.authIdx,
                    name: auth.authNm,
                    description: auth.authDescription,
                    menus: auth.menuAuth.map(m => m.code),
                    authType: auth.authType
                }));
                
                setAuthList(formattedAuthList);
                setSelectedAuth(null);
                setSelectedInactive([]);
                setSelectedActive([]);
            } else {
                alert("검색에 실패했습니다.");
            }
        } catch (error) {
            console.error("검색 실패:", error);
            alert("검색 중 오류가 발생했습니다.");
        }
    };

    // 검색 초기화 함수
    const handleSearchReset = async () => {
        setSearchType("all");
        setSearchTerm("");
        
        // 전체 목록 다시 로드
        try {
            const response = await apiGet("/admin/auth");
            if (response.ok) {
                const data = await response.json();

                const formattedAuthList = data.map(auth => ({
                    id: auth.authIdx,
                    name: auth.authNm,
                    description: auth.authDescription,
                    menus: auth.menuAuth.map(m => m.code),
                    authType: auth.authType
                }));
                setAuthList(formattedAuthList);
                setSelectedAuth(null);
                setSelectedInactive([]);
                setSelectedActive([]);
            }
        } catch (error) {
            console.error("목록 조회 실패:", error);
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
            authType: newAuth.authType,
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
                        <select 
                            name="option" 
                            id="option" 
                            className="authmanage-select"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="authNm">권한명</option>
                        </select>
                        <input 
                            type="text" 
                            className="authmanage-input" 
                            placeholder="검색어를 입력하세요"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="authmanage-search-btn" onClick={handleSearch}>검색</button>
                        <button 
                            className="authmanage-search-reset-btn" 
                            onClick={handleSearchReset}
                        >
                            초기화
                        </button>
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
                                    <th>권한 그룹</th>
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
                                                    disabled={DEFAULT_AUTH_IDS.includes(auth.id)}
                                                />
                                            </td>
                                        )}
                                        <td>{authTypeLabels[auth.authType]}</td>
                                        <td>
                                            {DEFAULT_AUTH_IDS.includes(auth.id) 
                                                ? authTypeLabels[auth.authType] 
                                                : auth.name
                                            }
                                            {DEFAULT_AUTH_IDS.includes(auth.id) && (
                                                <span className="authmanage-readonly-badge">(수정 불가)</span>
                                            )}
                                        </td>
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
                                disabled={!selectedAuth || selectedInactive.length === 0 || isReadOnly}
                            >
                                →
                            </button>
                            <button
                                className="authmanage-arrow-btn"
                                onClick={moveToInactive}
                                disabled={!selectedAuth || selectedActive.length === 0 || isReadOnly}
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
                        disabled={!hasChanges || isReadOnly}
                    >
                        저장
                    </button>
                    <button
                        className="authmanage-reset-btn"
                        onClick={handleReset}
                        disabled={!hasChanges || isReadOnly}
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