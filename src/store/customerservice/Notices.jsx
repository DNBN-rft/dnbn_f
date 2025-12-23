import "./css/notices.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiGet } from "../../utils/apiClient";

const Notices = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async (page = 0) => {
        setLoading(true);
        try {
            const response = await apiGet(`/store/notice?page=${page}&size=${pageSize}`);
            if (response.ok) {
                const data = await response.json();
                setNotices(data.content || []);
                setCurrentPage(data.number || 0);
                setTotalPages(data.totalPages || 0);
            } else {
                setNotices([]);
            }
        } catch (err) {
            console.error('공지사항 조회 실패:', err);
            setNotices([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateTime) => {
        if (!dateTime) return "-";
        return dateTime.split("T")[0];
    };

    const sortedNotices = (Array.isArray(notices) ? [...notices] : []).sort((a, b) => {
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
                    <div className="notices-loading">로딩 중...</div>
                ) : notices.length === 0 ? (
                    <div className="notices-empty">공지사항이 없습니다.</div>
                ) : (
                    <table className="notices-table">
                        <thead>
                            <tr>
                                <th className="notices-col-num">번호</th>
                                <th className="notices-col-title">제목</th>
                                <th className="notices-col-author">작성자</th>
                                <th className="notices-col-date">작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedNotices.map((notice, index) => (
                                <tr 
                                    key={notice.noticeIdx}
                                    className="notices-row"
                                    onClick={() => navigate(`/store/notice/${notice.noticeIdx}`, { state: { notice } })}
                                >
                                    <td className="notices-col-num">
                                        {notice.isPinned ? (
                                            <span className="notices-badge-important">중요</span>
                                        ) : (
                                            notices.length - index
                                        )}
                                    </td>
                                    <td className="notices-col-title">
                                        <span className="notices-title-text">{notice.title}</span>
                                    </td>
                                    <td className="notices-col-author">{notice.regNm || "관리자"}</td>
                                    <td className="notices-col-date">{formatDate(notice.regDateTime)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="notices-footer">
                <div className="notices-pagination">
                    <button 
                        className="notices-page" 
                        onClick={() => {
                            if (currentPage > 0) {
                                loadNotices(currentPage - 1);
                            }
                        }}
                        disabled={currentPage === 0}
                    >
                        이전
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`notices-page ${currentPage === index ? 'active' : ''}`}
                            onClick={() => loadNotices(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        className="notices-page"
                        onClick={() => {
                            if (currentPage < totalPages - 1) {
                                loadNotices(currentPage + 1);
                            }
                        }}
                        disabled={currentPage === totalPages - 1}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notices;