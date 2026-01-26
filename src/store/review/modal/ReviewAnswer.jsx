import { apiPut, apiGet } from "../../../utils/apiClient";
import "./css/reviewanswer.css"
import { useState, useEffect } from "react";

const ReviewAnswer = ({ onClose, reviewIdx, refreshData }) => {
    const [review, setReview] = useState(null);
    const [answerContent, setAnswerContent] = useState("");
    const [isEditMode, setIsEditMode] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewDetail = async () => {
            try {
                const response = await apiGet(`/store/review/${reviewIdx}`);
                if (response.ok) {
                    const data = await response.json();
                    setReview(data);
                    setAnswerContent(data.reviewAnswerContent || "");
                    const hasAnswer = data.reviewAnswered && data.reviewAnswerContent;
                    setIsEditMode(!hasAnswer);
                } else {
                    throw new Error("리뷰 상세 정보를 불러오는데 실패했습니다.");
                }
            } catch (error) {
                alert("리뷰 상세 정보를 불러오는데 실패했습니다.");
                onClose();
            } finally {
                setLoading(false);
            }
        };
        
        fetchReviewDetail();
    }, [reviewIdx, onClose]);

    const hasAnswer = review && review.reviewAnswered && review.reviewAnswerContent;

    const handleEditClick = (e) => {
        e.preventDefault();
        setIsEditMode(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiPut(`/store/review/answer/${review.reviewIdx}`, {
                reviewAnswerContent: answerContent
            });

            if (!response.ok) {
                throw new Error("답변 등록/수정에 실패했습니다.");
            }

            const result = await response.text();
            alert(result);

            if (refreshData) {
                await refreshData();
            }

            onClose();
        } catch (error) {
            alert("답변 등록/수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="review-answer-backdrop" onClick={onClose}>
            <div className="review-answer-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="review-answer-header">
                    {loading ? "로딩 중..." : hasAnswer ? "리뷰 답변 상세" : "리뷰 답변 등록"}
                </div>

                {!loading && review && (
                    <div className="review-answer-contents">
                        <div className="review-detail-info">
                            <div className="review-detail-title">상품명: {review.productNm}</div>
                            <div className="review-detail-regNm">작성자: {review.regNm}</div>
                        </div>
                        <div className="review-detail-content">{review.content}</div>

                        <form className="review-answer-form" onSubmit={handleSubmit}>
                            {hasAnswer && !isEditMode ? (
                                <div className="review-detail-content">{review.reviewAnswerContent}</div>
                            ) : (
                                <input
                                    type="text"
                                    value={answerContent}
                                    onChange={(e) => setAnswerContent(e.target.value)}
                                    required
                                    placeholder="리뷰 답변 내용을 입력해주세요."
                                />
                            )}
                            <div className="review-answer-footer">
                                {hasAnswer && !isEditMode ? (
                                    !review.isMod && (
                                        <button 
                                            type="button" 
                                            className="review-answer-submit-button"
                                            onClick={handleEditClick}
                                        >
                                            수정
                                        </button>
                                    )
                                ) : (
                                    <button type="submit" className="review-answer-submit-button">
                                        {hasAnswer ? "수정완료" : "등록"}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="review-answer-cancel-button"
                                    onClick={onClose}
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewAnswer;
