import "./css/noticedetail.css";
import { useNavigate, useLocation } from "react-router-dom";

const NoticeDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const notice = location.state?.notice || {};

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-";
        return dateTime.replace("T", " ").substring(0, 16);
    };

    return (
        <div className="noticedetail-wrap">
            <div className="noticedetail-container">
                <div className="noticedetail-header">
                    <div className="noticedetail-title-section">
                        {notice.isPinned && <span className="noticedetail-badge">공지</span>}
                        <h1 className="noticedetail-title">{notice.title || "제목 없음"}</h1>
                    </div>
                    <div className="noticedetail-meta">
                        <span className="noticedetail-author">{notice.regNm || "관리자"}</span>
                        <span className="noticedetail-divider">|</span>
                        <span className="noticedetail-date">{formatDateTime(notice.regDateTime)}</span>
                    </div>
                </div>

                <div className="noticedetail-content">
                    <div className="noticedetail-content-text">
                        {notice.content || "내용이 없습니다."}
                    </div>
                </div>

                <div className="noticedetail-footer">
                    <button 
                        className="noticedetail-btn-list"
                        onClick={() => navigate(-1)}
                    >
                        목록으로
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NoticeDetail;