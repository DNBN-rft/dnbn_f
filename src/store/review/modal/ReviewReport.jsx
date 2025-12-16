import "./css/reviewreport.css";
import { useState } from "react";
import { apiPost } from "../../../utils/apiClient";
const REPORT_REASONS = [
    { value: "ADVERTISING_REVIEW", label: "광고성 리뷰" },
    { value: "FALSE_REVIEW", label: "허위 리뷰" },
    { value: "ABUSIVE_REVIEW", label: "욕설/비방" },
    { value: "IRRELEVANT_CONTENT", label: "상품과 무관한 내용" },
    { value: "SPAM_REVIEW", label: "도배/스팸" }
];
const ReviewReport = ({ onClose, reviewIdx, refreshData }) => {
    const [selectedReason, setSelectedReason] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReason) {
            alert("신고 사유를 선택해주세요.");
            return;
        }
        try {
            setIsLoading(true);
            const response = await apiPost(`/store/report/review/${reviewIdx}`, {
                reportReason: selectedReason,
                content: content || null
            });
            if (!response.ok) {
                throw new Error("신고 처리에 실패했습니다.");
            }
            alert("리뷰가 신고 처리되었습니다.");
            if (refreshData) {
                await refreshData();
            }
            onClose();
        } catch (error) {
            console.error("신고 처리 실패:", error);
            alert("신고 처리에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="review-report-backdrop" onClick={onClose}>
            <div className="review-report-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="review-report-header">
                    <h2>리뷰 신고</h2>
                    <button className="review-report-close" onClick={onClose}>×</button>
                </div>
                <form className="review-report-form" onSubmit={handleSubmit}>
                    <div className="review-report-section">
                        <label className="review-report-label">신고 사유 <span className="required">*</span></label>
                        <div className="review-report-reason-group">
                            {REPORT_REASONS.map((reason) => (
                                <label key={reason.value} className="review-report-radio">
                                    <input
                                        type="radio"
                                        name="reportReason"
                                        value={reason.value}
                                        checked={selectedReason === reason.value}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                    />
                                    <span>{reason.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="review-report-section">
                        <label className="review-report-label">상세 내용 (선택사항)</label>
                        <textarea
                            className="review-report-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="신고 사유에 대한 추가 설명을 입력해주세요."
                            maxLength="500"
                        />
                        <div className="review-report-char-count">
                            {content.length}/500
                        </div>
                    </div>
                    <div className="review-report-footer">
                        <button
                            type="submit"
                            className="review-report-submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? "처리 중..." : "신고"}
                        </button>
                        <button
                            type="button"
                            className="review-report-cancel-button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ReviewReport;