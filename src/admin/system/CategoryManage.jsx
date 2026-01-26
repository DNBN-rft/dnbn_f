import { useState, useEffect } from "react";
import CategoryModal from "./modal/CategoryModal";
import { fetchCategories as fetchCategoriesAPI, searchCategories, deleteCategories as deleteCategoriesAPI } from "../../utils/adminCategoryService";
import "./css/categorymanage.css";

const CategoryManage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchType, setSearchType] = useState("all");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 초기 데이터 로드
    useEffect(() => {
        loadCategories();
    }, []);

    // 카테고리 목록 조회
    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCategoriesAPI();
            const formattedData = data.map(category => ({
                categoryIdx: category.categoryIdx,
                id: category.categoryIdx,
                categoryName: category.categoryNm,
                creatorName: category.categoryRegNm,
                createdAt: category.categoryRegDate,
                modifierName: category.categoryModNm || "-",
                modifiedAt: category.categoryModDate || "-",
                imageUrl: category.images?.files?.[0]?.fileUrl || null,
                images: category.images
            }));
            setCategories(formattedData);
        } catch (err) {
            setError("카테고리 목록을 불러오는 데 실패했습니다.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 검색 핸들러
    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            loadCategories();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await searchCategories(searchType, searchKeyword);
            const formattedData = data.map(category => ({
                categoryIdx: category.categoryIdx,
                id: category.categoryIdx,
                categoryName: category.categoryNm,
                creatorName: category.categoryRegNm,
                createdAt: category.categoryRegDate,
                modifierName: category.categoryModNm || "-",
                modifiedAt: category.categoryModDate || "-",
                imageUrl: category.images?.files?.[0]?.fileUrl || null,
                images: category.images
            }));
            setCategories(formattedData);
        } catch (err) {
            setError("검색에 실패했습니다.");
            console.error(err);
        } finally {
            setLoading(false);
        }
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

        try {
            setLoading(true);
            setError(null);
            await deleteCategoriesAPI(selectedCategories);
            setCategories(categories.filter(cat => !selectedCategories.includes(cat.id)));
            setSelectedCategories([]);
            alert("카테고리가 삭제되었습니다.");
        } catch (err) {
            setError("카테고리 삭제에 실패했습니다.");
            alert("카테고리 삭제에 실패했습니다.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 모달 저장 핸들러
    const handleSave = async (categoryData) => {
        try {
            setLoading(true);
            setError(null);
            
            if (modalMode === "add") {
                // 카테고리 등록
                const { registerCategory } = await import("../../utils/adminCategoryService");
                await registerCategory({
                    categoryNm: categoryData.categoryName,
                    categoryImg: categoryData.categoryImg
                });
                alert("카테고리가 등록되었습니다.");
                await loadCategories();
            } else {
                // 카테고리 수정
                const { modifyCategory } = await import("../../utils/adminCategoryService");
                await modifyCategory({
                    categoryIdx: selectedCategory.categoryIdx,
                    categoryNm: categoryData.categoryName,
                    categoryImg: categoryData.categoryImg
                });
                alert("카테고리가 수정되었습니다.");
                await loadCategories();
            }
            setIsModalOpen(false);
        } catch (err) {
            const errorMsg = modalMode === "add" ? "카테고리 등록에 실패했습니다." : "카테고리 수정에 실패했습니다.";
            setError(errorMsg);
            alert(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="categorymanage-container">
            <div className="categorymanage-wrap">
                {error && (
                    <div className="categorymanage-error-message">
                        {error}
                    </div>
                )}

                <div className="categorymanage-filter-wrap">
                    <div className="categorymanage-filter-group">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="categorymanage-filter-select"
                            disabled={loading}
                        >
                            <option value="all">전체</option>
                            <option value="categoryNm">카테고리명</option>
                            <option value="categoryRegNm">등록자</option>
                        </select>

                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="categorymanage-filter-input"
                            placeholder="검색어를 입력하세요"
                            disabled={loading}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />

                        <button onClick={handleSearch} className="categorymanage-filter-search-btn" disabled={loading}>
                            {loading ? "검색 중..." : "검색"}
                        </button>
                    </div>

                    <div className="categorymanage-filter-btn-group">
                        <button onClick={handleAdd} className="categorymanage-filter-btn" disabled={loading}>
                            등록
                        </button>
                        <button onClick={handleDelete} className="categorymanage-filter-del-btn" disabled={loading || selectedCategories.length === 0}>
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
                                        disabled={loading}
                                    />
                                </th>
                                <th className="categorymanage-table-th-image">이미지</th>
                                <th className="categorymanage-table-th-name">카테고리명</th>
                                <th className="categorymanage-table-th-creator">등록자</th>
                                <th className="categorymanage-table-th-created">등록일</th>
                                <th className="categorymanage-table-th-modifier">수정자</th>
                                <th className="categorymanage-table-th-modified">수정일</th>
                                <th className="categorymanage-table-th-action">수정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="categorymanage-table-td-empty">
                                        로딩 중...
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="categorymanage-table-td-empty">
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
                                                disabled={loading}
                                            />
                                        </td>
                                        <td className="categorymanage-table-td categorymanage-table-td-image">
                                            {category.imageUrl ? (
                                                <img src={category.imageUrl} alt={category.categoryName} className="categorymanage-thumbnail" />
                                            ) : (
                                                <span className="categorymanage-no-image">이미지 없음</span>
                                            )}
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
                                                disabled={loading}
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
                    loading={loading}
                />
            )}
        </div>
    );
};

export default CategoryManage;