import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./css/productsale.css";
import { apiPost, apiGet } from "../../../utils/apiClient";
import { getCurrentDate, getCurrentTimePlusMinutes, calculateEndDateTime, calculateInitialEndDateTime, parseTimeToDate, formatTimeToString } from "../../../utils/commonService";

const ProductSale = ({ onClose, productCode, productPrice = 10000, onRefresh }) => {
    const [discountType, setDiscountType] = useState("할인률");
    const [discountRate, setDiscountRate] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [saleTimeout, setSaleTimeout] = useState(24);
    const [hasSetInitialPrice, setHasSetInitialPrice] = useState(false);

    const handleDiscountRateChange = (e) => {
        const rate = Number(e.target.value);
        setDiscountRate(rate || "");
        if (rate) {
            let discounted = Math.floor((productPrice * (100 - rate)) / 100);
            if (discounted < 1) discounted = 1;
            if (discounted > productPrice) discounted = productPrice;
            setDiscountPrice(discounted);
        } else {
            setDiscountPrice("");
        }
    };

    useEffect(() => {
        if (discountType === "할인가" && !hasSetInitialPrice && !discountPrice) {
            setDiscountPrice(productPrice);
            setHasSetInitialPrice(true);
        }
    }, [discountType, productPrice, discountPrice, hasSetInitialPrice]);

    useEffect(() => {
        const fetchTimeout = async () => {
            try {
                const response = await apiGet('/store/sale/time');
                if (response.ok) {
                    const limitTime = await response.json();
                    setSaleTimeout(limitTime);
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
        setEndDateTime(calculateInitialEndDateTime(5, saleTimeout));
    }, [saleTimeout]);

    // 시작/종료 시간 계산
    const handleDateTimeChange = (date, time) => {
        if (date) setStartDate(date);
        if (time) setStartTime(time);
        if (date && time) {
            setEndDateTime(calculateEndDateTime(date, time, saleTimeout));
        }
    };

    // 할인가 변경 시 할인율 자동 계산
    const handleDiscountPriceChange = (e) => {
        let val = e.target.value;

        if (val === "") {
            setDiscountPrice("");
            setDiscountRate("");
            return;
        }

        // 숫자 변환
        val = Number(val);

        // 최대/최소 제한
        if (val < 0) val = 0;
        if (val > productPrice) val = productPrice;

        setDiscountPrice(val);
        const newRate = Math.round(((productPrice - val) / productPrice) * 100);
        setDiscountRate(newRate);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !startTime) {
            alert("할인 시작 날짜와 시간을 입력해주세요.");
            return;
        }

        const selectedStartDateTime = new Date(`${startDate}T${startTime}:00`);
        const currentDateTime = new Date();
        
        if (selectedStartDateTime < currentDateTime) {
            alert("할인 시작 시간은 현재 시간보다 이전일 수 없습니다.");
            return;
        }

        if (discountPrice === "" || discountPrice < 0) {
            alert("할인 판매가를 입력해주세요.");
            return;
        }

        if (discountType === "할인률" && (!discountRate || discountRate < 0 || discountRate > 100)) {
            alert("할인률은 0~100 사이의 값을 입력해주세요.");
            return;
        }

        try {
            const startDateTime = `${startDate}T${startTime}:00`;

            const requestData = {
                saleType: discountType,
                originalPrice: productPrice,
                saleValue: discountType === "할인률" ? parseInt(discountRate) : (productPrice - parseInt(discountPrice)),
                discountedPrice: parseInt(discountPrice),
                startDateTime: startDateTime
            };

            const response = await apiPost(`/store/sale/${productCode}`, requestData);

            if (response.ok) {
                alert("할인이 성공적으로 등록되었습니다.");
                if (onRefresh) {
                    onRefresh();
                }
                onClose();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "할인 등록에 실패했습니다.");
            }
        } catch (err) {
            console.error("할인 등록 실패:", err);
            alert("할인 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="product-sale-backdrop">
            <div className="product-sale-wrap">
                <div className="product-sale-header">상품 할인 등록</div>

                <div className="product-sale-body">
                    <form className="product-sale-form" onSubmit={handleSubmit}>
                        <div className="product-sale-type">
                            <label className="product-sale-type-label">할인 방식</label>
                            <div className="product-sale-radio">
                                <label>
                                    <input
                                        type="radio"
                                        name="discountType"
                                        value="할인률"
                                        checked={discountType === "할인률"}
                                        onChange={(e) => setDiscountType(e.target.value)}
                                    />
                                    할인률
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="discountType"
                                        value="할인가"
                                        checked={discountType === "할인가"}
                                        onChange={(e) => setDiscountType(e.target.value)}
                                    />
                                    할인가
                                </label>
                            </div>
                        </div>

                        <div className="product-sale-inputs-row">
                            <div className="product-sale-field">
                                <label>할인률 (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={discountRate}
                                    onChange={handleDiscountRateChange}
                                    readOnly={discountType === "할인가"}
                                    className={discountType === "할인가" ? "readonly" : ""}
                                    placeholder="예: 10"
                                />
                            </div>

                            <div className="product-sale-field">
                                <label>할인 판매가 (원)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={productPrice}
                                    value={discountPrice}
                                    onChange={handleDiscountPriceChange}
                                    readOnly={discountType === "할인률"}
                                    className={discountType === "할인률" ? "readonly" : ""}
                                    placeholder="예: 8000"
                                />
                            </div>
                        </div>

                        <div className="product-sale-date">
                            <label>할인 시작 일자</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => handleDateTimeChange(e.target.value, startTime)}
                            />
                            <label>할인 시작 시간</label>
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
                                className="product-sale-time-input"
                                popperPlacement="right-start"
                            />
                            <small className="product-sale-time-hint">
                                ⓘ 시간은 30분 단위로 선택 가능합니다
                            </small>
                        </div>

                        <div className="product-sale-end">
                            <label>할인 종료 일시</label>
                            <input
                                type="text"
                                value={endDateTime}
                                readOnly
                                placeholder="자동 계산됨"
                            />
                        </div>

                        <div className="product-sale-buttons">
                            <button type="submit" className="product-sale-submit">
                                등록
                            </button>
                            <button
                                type="button"
                                className="product-sale-cancel"
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

export default ProductSale;
