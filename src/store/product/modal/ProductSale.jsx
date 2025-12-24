import { useState, useEffect } from "react";
import "./css/productsale.css";
import { apiPost } from "../../../utils/apiClient";

const ProductSale = ({ onClose, productCode, productPrice = 10000, timeout = 2, onRefresh }) => {
    const [discountType, setDiscountType] = useState("할인률");
    const [discountRate, setDiscountRate] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");

    // 할인률 변경 시 할인가 자동 계산
    const handleDiscountRateChange = (e) => {
        const rate = e.target.value;
        setDiscountRate(rate);
        if (rate) {
            let discounted = Math.floor(productPrice * (1 - rate / 100));
            if (discounted < 1) discounted = 1;
            if (discounted > productPrice) discounted = productPrice;
            setDiscountPrice(discounted);
        } else {
            setDiscountPrice("");
        }
    };

    // 할인방식이 "할인가"로 전환될 때 처리
    useEffect(() => {
        if (discountType === "할인가") {
            // 할인율로 이미 계산된 가격이 있으면 그대로 유지, 없으면 원가로 설정
            if (!discountPrice) {
                setDiscountPrice(productPrice);
            }
        }
    }, [discountType, productPrice, discountPrice]);

    // 시작/종료 시간 계산
    const handleDateTimeChange = (date, time) => {
        if (date) setStartDate(date);
        if (time) setStartTime(time);
        if (date && time) {
            const start = new Date(`${date}T${time}`);
            const end = new Date(start.getTime() + timeout * 60 * 60 * 1000);
            const formatted = end.toISOString().slice(0, 16).replace("T", " ");
            setEndDateTime(formatted);
        }
    };

    // 할인가 변경 시 할인율 자동 계산
    const handleDiscountPriceChange = (e) => {
        let val = e.target.value;

        // 빈 값이면 그대로 상태를 비워둠
        if (val === "") {
            setDiscountPrice("");
            setDiscountRate("");
            return;
        }

        // 숫자 변환
        val = Number(val);

        // 최대/최소 제한
        if (val < 1) val = 1;
        if (val > productPrice) val = productPrice;

        setDiscountPrice(val);
        const newRate = Math.floor((1 - val / productPrice) * 100);
        setDiscountRate(newRate);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!startDate || !startTime) {
            alert("할인 시작 날짜와 시간을 입력해주세요.");
            return;
        }

        if (!discountPrice || discountPrice < 1) {
            alert("할인 판매가를 입력해주세요.");
            return;
        }

        if (discountType === "할인률" && (!discountRate || discountRate < 0 || discountRate > 100)) {
            alert("할인률은 0~100 사이의 값을 입력해주세요.");
            return;
        }

        try {
            // startDateTime을 ISO 형식으로 변환
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
                        {/* 할인 방식 */}
                        <div className="product-sale-type">
                            <label>할인 방식</label>
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

                        {/* 할인 입력 영역 */}
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
                                    min="1"
                                    max={productPrice}
                                    value={discountPrice}
                                    onChange={handleDiscountPriceChange}
                                    readOnly={discountType === "할인률"}
                                    className={discountType === "할인률" ? "readonly" : ""}
                                    placeholder="예: 8000"
                                />
                            </div>
                        </div>

                        {/* 날짜 입력 */}
                        <div className="product-sale-date">
                            <label>할인 시작 일자</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => handleDateTimeChange(e.target.value, startTime)}
                            />
                            <label>할인 시작 시간</label>
                            <input
                                type="time"
                                step="300"
                                value={startTime}
                                onChange={(e) => handleDateTimeChange(startDate, e.target.value)}
                            />
                        </div>

                        {/* 종료 일시 */}
                        <div className="product-sale-end">
                            <label>할인 종료 일시</label>
                            <input
                                type="text"
                                value={endDateTime}
                                readOnly
                                placeholder="자동 계산됨"
                            />
                        </div>

                        {/* 버튼 */}
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
