import { useState, useEffect } from "react";
import "./css/categorymodal.css";

const CategoryModal = ({ mode, category, onSave, onClose, loading = false }) => {
    const [formData, setFormData] = useState({
        categoryName: "",
        categoryImg: null,
        categoryImgPreview: null,
        existingImage: null
    });
    const [formError, setFormError] = useState("");

    // 현재 로그인한 사용자 정보 가져오기
    const getCurrentUserName = () => {
        const adminStr = localStorage.getItem("admin");
        if (adminStr) {
            try {
                const admin = JSON.parse(adminStr);
                return admin.empNm || "관리자";
            } catch (e) {
                return "관리자";
            }
        }
        return "관리자";
    };

    useEffect(() => {
        if (mode === "edit" && category) {
            setFormData({
                categoryName: category.categoryName || "",
                categoryImg: null,
                categoryImgPreview: null,
                existingImage: category.images?.files?.[0]?.fileUrl || null
            });
        } else {
            // 등록 모드일 때 초기화
            setFormData({
                categoryName: "",
                categoryImg: null,
                categoryImgPreview: null,
                existingImage: null
            });
        }
        setFormError("");
    }, [mode, category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setFormError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 체크 (예: 5MB 이하)
            if (file.size > 5 * 1024 * 1024) {
                setFormError("파일 크기는 5MB 이하여야 합니다.");
                return;
            }

            // 파일 타입 체크 (이미지만)
            if (!file.type.startsWith("image/")) {
                setFormError("이미지 파일만 업로드할 수 있습니다.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({
                    ...formData,
                    categoryImg: file,
                    categoryImgPreview: e.target.result
                });
            };
            reader.readAsDataURL(file);
            setFormError("");
        }
    };

    const handleRemoveNewImage = () => {
        setFormData({
            ...formData,
            categoryImg: null,
            categoryImgPreview: null
        });
    };

    const handleClickImageReplace = () => {
        const fileInput = document.getElementById("categoryImg");
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleSubmit = () => {
        if (!formData.categoryName.trim()) {
            setFormError("카테고리명을 입력해주세요.");
            return;
        }

        if (mode === "add" && !formData.categoryImg) {
            setFormError("카테고리 이미지를 선택해주세요.");
            return;
        }

        const submitData = {
            categoryName: formData.categoryName,
            categoryImg: formData.categoryImg
        };

        onSave(submitData);
    };

    const currentUserName = getCurrentUserName();

    return (
        <div className="categorymodal-backdrop" onClick={onClose}>
            <div className="categorymodal-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="categorymodal-header">
                    <h2 className="categorymodal-title">
                        {mode === "add" ? "카테고리 등록" : "카테고리 수정"}
                    </h2>
                    <button className="categorymodal-close-btn" onClick={onClose} disabled={loading}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="categorymodal-content">
                    {formError && (
                        <div className="categorymodal-error">
                            {formError}
                        </div>
                    )}

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
                            disabled={loading}
                        />
                    </div>

                    <div className="categorymodal-row">
                        <label className="categorymodal-label">
                            카테고리 이미지
                            {mode === "add" && <span className="categorymodal-required">*</span>}
                        </label>
                        <div className="categorymodal-image-section">
                            {/* 수정 모드에서 기존 이미지 표시 */}
                            {mode === "edit" && formData.existingImage && !formData.categoryImgPreview && (
                                <div className="categorymodal-existing-image-wrap">
                                    <p className="categorymodal-image-label-text">기존 이미지:</p>
                                    <img src={`http://localhost:8080${formData.existingImage}`} alt="현재 이미지" className="categorymodal-existing-image" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                                    <button 
                                        type="button"
                                        className="categorymodal-image-replace-btn"
                                        onClick={handleClickImageReplace}
                                        disabled={loading}
                                    >
                                        이미지 변경
                                    </button>
                                </div>
                            )}

                            {/* 새로운 이미지 미리보기 */}
                            {formData.categoryImgPreview && (
                                <div className="categorymodal-new-image-wrap">
                                    <p className="categorymodal-image-label-text">새로운 이미지:</p>
                                    <img src={formData.categoryImgPreview} alt="새로운 이미지" className="categorymodal-new-image-preview" />
                                    <button 
                                        type="button"
                                        className="categorymodal-image-remove-btn"
                                        onClick={handleRemoveNewImage}
                                        disabled={loading}
                                    >
                                        이미지 제거
                                    </button>
                                </div>
                            )}

                            {/* 파일 업로드 */}
                            {!formData.categoryImgPreview && (mode === "add" || !formData.existingImage) && (
                                <div className="categorymodal-image-upload">
                                    <input
                                        type="file"
                                        id="categoryImg"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="categorymodal-file-input"
                                        disabled={loading}
                                    />
                                    <label htmlFor="categoryImg" className="categorymodal-file-label">
                                        파일 선택
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="categorymodal-row">
                        <label className="categorymodal-label">
                            {mode === "add" ? "등록자" : "수정자"}
                        </label>
                        <input
                            type="text"
                            value={currentUserName}
                            className="categorymodal-input"
                            disabled
                        />
                    </div>
                </div>

                <div className="categorymodal-footer">
                    <button 
                        className="categorymodal-btn categorymodal-btn-save" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "처리 중..." : (mode === "add" ? "등록" : "수정")}
                    </button>
                    <button 
                        className="categorymodal-btn categorymodal-btn-cancel" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
