import { useState, useEffect, useContext } from "react";
import QuestionRegisterModal from "./modal/QuestionRegisterModal";
import QuestionDetailModal from "./modal/QuestionDetailModal";
import { apiGet } from "../../utils/apiClient";
import { AuthContext } from "../../context/AuthContext";
import "./css/questions.css";


const Questions = () => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user?.storeCode) {
            loadQuestions();
        }
    }, [user]);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const response = await apiGet(`/question/${user.storeCode}`);
            if (response.ok) {
                const data = await response.json();
                setQuestions(data);
            }
        } catch (err) {
            console.error("문의 목록 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateTime) => {
        if (!dateTime) return "-";
        return dateTime.replace("T", " ").substring(0, 16);
    };

    const handleRowClick = (id) => {
        setSelectedId(id);
        setIsDetailModalOpen(true);
    };

    const handleRegisterSuccess = () => {
        loadQuestions();
        setIsRegisterModalOpen(false);
    };

    const handleDetailClose = () => {
        loadQuestions();
        setIsDetailModalOpen(false);
    }

    return (
        <div className="questions-wrap">
            <div className="questions-header">
                <div className="questions-header-title">1:1 문의내역</div>
                <div
                    className="questions-header-contact"
                    onClick={() => setIsRegisterModalOpen(true)}
                >
                    문의하기
                </div>
            </div>

            <div className="questions-contents">
                {loading ? (
                    <div style={{textAlign: "center", padding: "20px"}}>로딩 중...</div>
                ) : questions.length === 0 ? (
                    <div style={{textAlign: "center", padding: "20px"}}>문의 내역이 없습니다.</div>
                ) : (
                    <table className="questions-content-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>등록일</th>
                                <th>상태</th>
                            </tr>
                        </thead>

                        <tbody>
                            {questions.map((q, idx) => (
                                <tr key={q.questionId}
                                onClick={() => handleRowClick(q.questionId)}
                                style={{cursor: 'pointer'}}>
                                    <td className="questions-info-no">{idx + 1}</td>
                                    <td className="questions-info-title">{q.questionTitle}</td>
                                    <td className="questions-info-date">{formatDate(q.questionRegDateTime)}</td>
                                    <td className="questions-info-status">
                                        <p className="questions-status-text">{q.isAnswered ? "답변완료" : "대기중"}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="questions-footer">
                <div className="questions-pagination">
                    <button className="questions-page">이전</button>
                    <button className="questions-page active">1</button>
                    <button className="questions-page">2</button>
                    <button className="questions-page">3</button>
                    <button className="questions-page">다음</button>
                </div>
            </div>

            {isRegisterModalOpen && (
                <QuestionRegisterModal 
                    onClose={() => setIsRegisterModalOpen(false)}
                    onSuccess={handleRegisterSuccess} 
                />
            )}

            {isDetailModalOpen && (
                <QuestionDetailModal
                    id={selectedId}
                    onClose={handleDetailClose} 
                />
            )}
        </div>
    );
};

export default Questions;