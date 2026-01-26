import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./css/productnego.css";
import { apiPost, apiGet } from "../../../utils/apiClient";
import { getCurrentDate, getCurrentTimePlusMinutes, calculateEndDateTime, calculateInitialEndDateTime, parseTimeToDate, formatTimeToString } from "../../../utils/commonService";

const ProductNego = ({ onClose, productCode, onRefresh }) => {
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [negoTimeout, setNegoTimeout] = useState(24);

    // API에서 제한 시간 가져오기
    useEffect(() => {
        const fetchTimeout = async () => {
            try {
                const response = await apiGet('/store/sale/time');
                if (response.ok) {
                    const limitTime = await response.json();
                    setNegoTimeout(limitTime);
                    console.log('Fetched timeout:', limitTime);
                } else {
                    console.error('Failed to fetch timeout');
                }
            } catch (error) {
                console.error('Error fetching timeout:', error);
            }
        };
        fetchTimeout();
    }, []);

    // 모달 열릴 때 현재 시간으로 시작 날짜/시간 설정
    useEffect(() => {
        const currentDate = getCurrentDate();
        const currentTime = getCurrentTimePlusMinutes(5);
        setStartDate(currentDate);
        setStartTime(currentTime);
        setEndDateTime(calculateInitialEndDateTime(5, negoTimeout));
    }, [negoTimeout]);

    // 시작/종료 시간 계산
    const handleDateTimeChange = (date, time) => {
        if (date) setStartDate(date);
        if (time) setStartTime(time);
        if (date && time) {
            setEndDateTime(calculateEndDateTime(date, time, negoTimeout));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!startDate || !startTime) {
            alert("네고 시작 날짜와 시간을 입력해주세요.");
            return;
        }

        // 네고 시작 시간이 현재 시간보다 이전인지 확인
        const selectedStartDateTime = new Date(`${startDate}T${startTime}:00`);
        const currentDateTime = new Date();
        
        if (selectedStartDateTime < currentDateTime) {
            alert("시작 시간은 현재 시간보다 이전일 수 없습니다.");
            return;
        }

        try {
            const startDateTime = `${startDate}T${startTime}:00`;

            const requestData = {
                startDateTime: startDateTime
            };

            const response = await apiPost(`/store/nego/${productCode}`, requestData);

            if (response.ok) {
                alert("네고가 성공적으로 등록되었습니다.");
                if (onRefresh) {
                    onRefresh();
                }
                onClose();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "네고 등록에 실패했습니다.");
            }
        } catch (err) {
            console.error("네고 등록 실패:", err);
            alert("네고 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="product-nego-backdrop">
            <div className="product-nego-wrap">
                <div className="product-nego-header">상품 네고 등록</div>

                <div className="product-nego-body">
                    <form className="product-nego-form" onSubmit={handleSubmit}>
                        <div className="product-nego-date">
                            <label>네고 시작 일자</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => handleDateTimeChange(e.target.value, startTime)}
                            />
                            <label>네고 시작 시간</label>
                            <DatePicker
                                selected={parseTimeToDate(startTime)}
                                onChange={(date) => {
                                    const timeString = formatTimeToString(date);
                                    handleDateTimeChange(startDate, timeString);
                                }}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption="시간"
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                className="product-nego-time-input"
                                popperPlacement="right-start"
                            />
                        </div>

                        <div className="product-nego-end">
                            <label>네고 종료 일시</label>
                            <input
                                type="text"
                                value={endDateTime}
                                readOnly
                                placeholder="자동 계산됨"
                            />
                        </div>

                        <div className="product-nego-buttons">
                            <button type="submit" className="product-nego-submit">
                                등록
                            </button>
                            <button
                                type="button"
                                className="product-nego-cancel"
                                onClick={onClose}
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

export default ProductNego;
