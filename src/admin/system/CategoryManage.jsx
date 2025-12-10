import { useState, useEffect } from "react";
import CategoryModal from "./modal/CategoryModal";
import "./css/categorymanage.css";

const CategoryManage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchType, setSearchType] = useState("all");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 초기 데이터 로드
    useEffect(() => {
        fetchCategories();
    }, []);

    // 카테고리 목록 조회
    const fetchCategories = async () => {
        // TODO: 실제 API 호출로 대체
        const mockData = [
            {
                id: 1,
                categoryName: "소매/잡화",
                creatorName: "관리자",
                createdAt: "2024-01-15",
                modifierName: "관리자",
                modifiedAt: "2024-01-15"
            },
            {
                id: 2,
                categoryName: "음식/카페",
                creatorName: "홍길동",
                createdAt: "2024-01-20",
                modifierName: "김철수",
                modifiedAt: "2024-02-10"
            },
            {
                id: 3,
                categoryName: "뷰티/헬스",
                creatorName: "이영희",
                createdAt: "2024-02-01",
                modifierName: "이영희",
                modifiedAt: "2024-02-01"
            },
            {
                id: 4,
                categoryName: "기타",
                creatorName: "관리자",
                createdAt: "2024-02-01",
                modifierName: "",
                modifiedAt: ""
            }
        ];
        setCategories(mockData);
    };

    // 검색 핸들러
    const handleSearch = () => {
        // TODO: 검색 API 호출
        console.log("검색:", searchType, searchKeyword);
    };

    // 체크박스 전체 선택/해제
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCategories(categories.map(cat => cat.id));
        } else {
            setSelectedCategories([]);
        }
    };

    // 개별 체크박스 선택/해제
    const handleSelectCategory = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(catId => catId !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    // 등록 버튼 클릭
    const handleAdd = () => {
        setModalMode("add");
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    // 수정 버튼 클릭
    const handleEdit = (category) => {
        setModalMode("edit");
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    // 삭제 버튼 클릭
    const handleDelete = async () => {
        if (selectedCategories.length === 0) {
            alert("삭제할 카테고리를 선택해주세요.");
            return;
        }

        if (!window.confirm(`선택한 ${selectedCategories.length}개의 카테고리를 삭제하시겠습니까?`)) {
            return;
        }

        // TODO: 실제 삭제 API 호출
        console.log("삭제:", selectedCategories);
        setCategories(categories.filter(cat => !selectedCategories.includes(cat.id)));
        setSelectedCategories([]);
    };

    // 모달 저장 핸들러
    const handleSave = async (categoryData) => {
        if (modalMode === "add") {
            // TODO: 실제 등록 API 호출
            const newCategory = {
                id: categories.length + 1,
                ...categoryData,
                createdAt: new Date().toISOString().split('T')[0],
                modifiedAt: new Date().toISOString().split('T')[0]
            };
            setCategories([...categories, newCategory]);
        } else {
            // TODO: 실제 수정 API 호출
            setCategories(categories.map(cat =>
                cat.id === selectedCategory.id
                    ? { ...cat, ...categoryData, modifiedAt: new Date().toISOString().split('T')[0] }
                    : cat
            ));
        }
        setIsModalOpen(false);
    };

    return (
        <div className="categorymanage-container">
            <div className="categorymanage-wrap">
                <div className="categorymanage-filter-wrap">
                    <div className="categorymanage-filter-group">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="categorymanage-filter-select"
                        >
                            <option value="all">전체</option>
                            <option value="categoryName">카테고리명</option>
                            <option value="creatorName">등록자</option>
                        </select>

                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="categorymanage-filter-input"
                            placeholder="검색어를 입력하세요"
                        />

                        <button onClick={handleSearch} className="categorymanage-filter-search-btn">
                            검색
                        </button>
                    </div>

                    <div className="categorymanage-filter-btn-group">
                        <button onClick={handleAdd} className="categorymanage-filter-btn">
                            등록
                        </button>
                        <button onClick={handleDelete} className="categorymanage-filter-del-btn">
                            삭제
                        </button>
                    </div>
                </div>

                <div className="categorymanage-table-wrap">
                    <table className="categorymanage-table">
                        <thead>
                            <tr>
                                <th className="categorymanage-table-th-checkbox">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedCategories.length === categories.length && categories.length > 0}
                                    />
                                </th>
                                <th className="categorymanage-table-th-name">카테고리명</th>
                                <th className="categorymanage-table-th-creator">등록자</th>
                                <th className="categorymanage-table-th-created">등록일</th>
                                <th className="categorymanage-table-th-modifier">수정자</th>
                                <th className="categorymanage-table-th-modified">수정일</th>
                                <th className="categorymanage-table-th-action">수정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="categorymanage-table-td-empty">
                                        등록된 카테고리가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="categorymanage-table-td">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => handleSelectCategory(category.id)}
                                            />
                                        </td>
                                        <td className="categorymanage-table-td">{category.categoryName}</td>
                                        <td className="categorymanage-table-td">{category.creatorName}</td>
                                        <td className="categorymanage-table-td">{category.createdAt}</td>
                                        <td className="categorymanage-table-td">{category.modifierName || "-"}</td>
                                        <td className="categorymanage-table-td">{category.modifiedAt || "-"}</td>
                                        <td className="categorymanage-table-td">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="categorymanage-edit-btn"
                                            >
                                                수정
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <CategoryModal
                    mode={modalMode}
                    category={selectedCategory}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default CategoryManage;