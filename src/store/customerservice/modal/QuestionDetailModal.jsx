import { useState, useEffect } from 'react';
import { apiGet } from '../../../utils/apiClient';
import './css/questiondetailmodal.css';
import { formatDate } from '../../../utils/commonService';

const QuestionDetailModal = ({ onClose, id }) => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const loadQuestionDetail = async () => {
            setLoading(true);
            try {
                const response = await apiGet(`/store/question/detail/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setQuestion(data);
                }
            } catch (err) {
                console.error("문의 상세 조회 실패:", err);
            } finally {
                setLoading(false);
            }
        };
        
        loadQuestionDetail();
    }, [id]);

    if (loading || !question) {
        return (
            <div className="modal-backdrop">
                <div className="question-detail-wrap">
                    <div style={{textAlign: "center", padding: "20px"}}>로딩 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-backdrop">
            <div className="question-detail-wrap"
                onClick={(e) => e.stopPropagation()}>
                <div className="question-detail-header">
                    <div className="question-detail-title">{question.questionTitle}</div>
                    <div className="question-detail-date-time">{formatDate(question.questionRegDateTime)}</div>
                    <div className="question-detail-question-type">문의 유형: {question.questionRequestType || "-"}</div>
                </div>
                <div className="question-detail-contents">
                    <div className="question-detail-question-content">{question.questionContent}</div>
                    
                    {question.imgs?.files?.length > 0 && (
                        <div className="question-detail-images">
                            {question.imgs.files.map((file, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:8080${file.fileUrl}`}
                                    alt={`문의 이미지 ${index + 1}`}
                                    className="question-detail-image"
                                    onClick={() => setSelectedImage(`http://localhost:8080${file.fileUrl}`)}
                                />
                            ))}
                        </div>
                    )}
                    
                    <div className="question-detail-answer">
                        <div className="question-detail-answer-label">답변</div>
                        {question.isAnswered ? (
                            <>
                                <div className="question-detail-answer-group">
                                    <div className="question-detail-answer-date-time">{formatDate(question.answerDateTime)}</div>
                                    <div className="question-detail-answer-regNm">{question.answerRegNm}</div>
                                </div>
                                <div className="question-detail-answer-content">{question.answerContent}</div>
                            </>
                        ) : (
                            <div className="question-detail-answer-content">답변 대기 중입니다.</div>
                        )}
                    </div>
                </div>
                <div className="question-detail-close-button" onClick={onClose}>
                    닫기
                </div>
            </div>

            {selectedImage && (
                <div className="question-image-lightbox" onClick={() => setSelectedImage(null)}>
                    <div className="question-image-lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="확대 이미지" />
                        <button className="question-image-lightbox-close" onClick={() => setSelectedImage(null)}>
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionDetailModal;