import { useState } from "react";
import { apiPostFormData } from "../../../utils/apiClient";
import "./css/questionregistermodal.css";

const QuestionRegisterModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        questionRequestType: "",
        questionTitle: "",
        questionContent: ""
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const storeCode = JSON.parse(localStorage.getItem("user")).storeCode;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            addFiles(Array.from(e.target.files));
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            addFiles(Array.from(e.dataTransfer.files));
        }
    };

    const addFiles = (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, {
                    file: file,
                    preview: reader.result,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.questionRequestType || !formData.questionTitle || !formData.questionContent) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("storeCode", storeCode);
            formDataToSend.append("questionRequestType", formData.questionRequestType);
            formDataToSend.append("questionTitle", formData.questionTitle);
            formDataToSend.append("questionContent", formData.questionContent);
            
            if (imagePreviews.length > 0) {
                imagePreviews.forEach(item => {
                    formDataToSend.append("questionFiles", item.file);
                });
            }
            
            const response = await apiPostFormData(`/store/question`, formDataToSend);
            if (response.ok) {
                alert("문의가 등록되었습니다.");
                onSuccess();
            } else {
                const errorText = await response.text();
                alert(`문의 등록 실패: ${errorText}`);
            }
        } catch (err) {
            console.error("문의 등록 실패:", err);
            alert("문의 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="question-register-wrap">
                <div className="question-register-header">
                    관리자 문의
                </div>
                <div className="question-register-contents">
                    <form className="question-register-form" onSubmit={handleSubmit}>
                        <div className="question-register-type">
                            <label htmlFor="questionType">문의 유형</label>
                            <select 
                                id="questionType" 
                                name="questionRequestType" 
                                required
                                value={formData.questionRequestType}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    문의 유형을 선택해주세요
                                </option>
                                <option value="QR">QR 관련</option>
                                <option value="PAYMENT">결제 관련</option>
                                <option value="REFUND">환불/교환 관련</option>
                                <option value="MOD_REQUEST">개인정보 수정 요청</option>
                                <option value="ETC">기타</option>
                            </select>
                        </div>

                        <div className="question-register-title">
                            <div className="question-register-title-label">제목*</div>
                            <input
                                type="text"
                                className="question-register-title-input"
                                name="questionTitle"
                                required
                                placeholder="문의 제목을 입력하세요."
                                value={formData.questionTitle}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="question-register-content">
                            <div className="question-register-content-label">내용*</div>
                            <textarea
                                className="question-register-content-input"
                                name="questionContent"
                                required
                                placeholder="문의 내용을 자세히 입력해주세요. 문제 상황을 자세히 설명해주시면 더 정확한 답변을 드릴 수 있습니다."
                                value={formData.questionContent}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="question-register-img">
                            <div className="question-register-content-label">문의 이미지 첨부</div>

                            {/* 파일 선택 버튼 대신 클릭 가능한 박스 */}
                            <label 
                                htmlFor="questionImage" 
                                className={`question-register-img-box ${dragActive ? 'drag-active' : ''}`}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                            >
                                {imagePreviews.length > 0 
                                    ? `${imagePreviews.length}개 파일 선택됨` 
                                    : "이미지를 업로드하려면 클릭하거나 드래그하세요"}
                            </label>
                            <input
                                type="file"
                                id="questionImage"
                                className="question-register-img-input"
                                name="questionFiles"
                                accept="image/*"
                                multiple
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            
                            {/* 이미지 미리보기 */}
                            {imagePreviews.length > 0 && (
                                <div className="question-register-img-preview-container">
                                    {imagePreviews.map((item, index) => (
                                        <div key={index} className="question-register-img-preview-item">
                                            <img src={item.preview} alt={item.name} />
                                            <button 
                                                type="button"
                                                className="question-register-img-remove-btn"
                                                onClick={() => removeImage(index)}
                                            >
                                                ✕
                                            </button>
                                            <div className="question-register-img-name">{item.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="question-register-img-note">
                                첨부 가능한 이미지 파일 형식: JPG, PNG, GIF
                            </div>
                        </div>
                        <div className="question-register-buttons">
                            <button 
                                type="submit" 
                                className="question-register-submit-button"
                                disabled={loading}
                            >
                                {loading ? "등록 중..." : "등록"}
                            </button>
                            <button
                                type="button"
                                className="question-register-cancel-button"
                                onClick={onClose}
                                disabled={loading}
                            >
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QuestionRegisterModal;