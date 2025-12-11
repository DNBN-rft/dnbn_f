import "./css/noticedetail.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const NoticeDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const notice = location.state?.notice || {};

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-";
        return dateTime.replace("T", " ").substring(0, 16);
    };
    return (
        <div className="notice-detail-wrap">
            <div className="notice-detail-header">
                <div className="notice-detail-header-title">{notice.title || "제목 없음"}</div>
                <div className="notice-detail-header-info">
                    <div className="notice-detail-date-time">{formatDateTime(notice.regDateTime)}</div>
                    <div className="notice-detail-regNm">{notice.regNm || "-"}</div>
                </div>
            </div>

            <div className="notice-detail-contents">
                <p>{notice.content || "내용이 없습니다."}</p>
            </div>

            <div className="notice-detail-footer">
                <button className="notice-detail-back-button"
                onClick={() => navigate(-1)}> 목록으로 돌아가기</button>
            </div>
        </div>
    )
}

export default NoticeDetail;