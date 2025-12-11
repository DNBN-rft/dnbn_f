import "./css/notices.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiGet } from "../../utils/apiClient";

const Notices = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async () => {
        setLoading(true);
        try {
            const response = await apiGet("/notice");
            if (response.ok) {
                const data = await response.json();
                setNotices(data);
            }
        } catch (err) {
            console.error("공지사항 목록 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateTime) => {
        if (!dateTime) return "-";
        return dateTime.split("T")[0];
    };

    const truncateContent = (content, maxLength = 50) => {
        if (!content) return "";
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + "...";
    };

    const sortedNotices = [...notices].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
    });

    return (
        <div className="notices-wrap">
            <div className="notices-header">
                <div className="notices-header-title">공지사항</div>
            </div>

            <div className="notices-contents">
                {loading ? (
                    <div style={{textAlign: "center", padding: "20px"}}>로딩 중...</div>
                ) : notices.length === 0 ? (
                    <div style={{textAlign: "center", padding: "20px"}}>공지사항이 없습니다.</div>
                ) : (
                    sortedNotices.map((notice) => (
                        <div key={notice.noticeIdx} className="notices-item">
                            <table className="notices-content-table">
                                <tbody onClick={() => navigate(`/store/notice/${notice.noticeIdx}`, { state: { notice } })}>
                                    <tr>
                                        <td className="notices-content-left">
                                            {notice.isPinned && <span style={{color: "#ff6b6b", fontWeight: "bold"}}>[중요] </span>}
                                            {notice.title}
                                        </td>
                                        <td className="notices-content-right" rowSpan={2}>
                                            {formatDate(notice.regDateTime)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="notices-content-body">
                                            {truncateContent(notice.content)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>

            <div className="notices-footer">
                <div className="notices-pagination">
                    <button className="notices-page">이전</button>
                    <button className="notices-page active">1</button>
                    <button className="notices-page">2</button>
                    <button className="notices-page">3</button>
                    <button className="notices-page">다음</button>
                </div>
            </div>
        </div>
    );
};

export default Notices;
