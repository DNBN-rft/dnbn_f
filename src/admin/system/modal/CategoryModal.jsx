import { useState, useEffect } from "react";
import "./css/categorymodal.css";

const CategoryModal = ({ mode, category, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        categoryName: "",
        creatorName: "",
        modifierName: ""
    });

    useEffect(() => {
        if (mode === "edit" && category) {
            setFormData({
                categoryName: category.categoryName || "",
                creatorName: category.creatorName || "",
                modifierName: category.modifierName || ""
            });
        } else {
            // 등록 모드일 때 현재 사용자 정보로 초기화
            // TODO: 실제로는 로그인한 사용자 정보를 가져와야 함
            setFormData({
                categoryName: "",
                creatorName: "관리자",
                modifierName: "관리자"
            });
        }
    }, [mode, category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        if (!formData.categoryName.trim()) {
            alert("카테고리명을 입력해주세요.");
            return;
        }

        onSave(formData);
    };

    return (
        <div className="categorymodal-backdrop">
            <div className="categorymodal-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="categorymodal-header">
                    <h2 className="categorymodal-title">
                        {mode === "add" ? "카테고리 등록" : "카테고리 수정"}
                    </h2>
                    <button className="categorymodal-close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="categorymodal-content">
                    <div className="categorymodal-row">
                        <label className="categorymodal-label">
                            카테고리명
                            <span className="categorymodal-required">*</span>
                        </label>
                        <input
                            type="text"
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleChange}
                            className="categorymodal-input"
                            placeholder="카테고리명을 입력하세요"
                        />
                    </div>

                    {mode === "add" ? (
                        <div className="categorymodal-row">
                            <label className="categorymodal-label">등록자</label>
                            <input
                                type="text"
                                name="creatorName"
                                value={formData.creatorName}
                                className="categorymodal-input"
                                disabled
                            />
                        </div>
                    ) : (
                        <div className="categorymodal-row">
                            <label className="categorymodal-label">최근 수정자</label>
                            <input
                                type="text"
                                name="modifierName"
                                value={formData.modifierName}
                                className="categorymodal-input"
                                disabled
                            />
                        </div>
                    )}
                </div>

                <div className="categorymodal-footer">
                    <button className="categorymodal-btn categorymodal-btn-save" onClick={handleSubmit}>
                        {mode === "add" ? "등록" : "수정"}
                    </button>
                    <button className="categorymodal-btn categorymodal-btn-cancel" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
