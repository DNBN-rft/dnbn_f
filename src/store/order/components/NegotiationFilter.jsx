const NegotiationFilter = ({
  searchText,
  setSearchText,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  statusFilter,
  setStatusFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sliderMax,
  setSliderMax,
  priceRange,
  setPriceRange,
  isManualInput,
  setIsManualInput,
  handleSearch,
  handleReset,
  isHistory = false
}) => {
  return (
    <div className="negotiation-filter">
      <div className="negotiation-filter-grid">
        <div className="negotiation-filter-column">
          <div className="negotiation-filter-item">
            <label className="negotiation-filter-label">가격</label>
            <div className="negotiation-price-range">
              <div className="negotiation-price-range-buttons">
                <button
                  className={`negotiation-price-range-btn ${priceRange === "100000" ? "active" : ""}`}
                  onClick={() => {
                    setPriceRange("100000");
                    setSliderMax(100000);
                    setMinPrice(0);
                    setMaxPrice(100000);
                    setIsManualInput(false);
                  }}
                >
                  10만원
                </button>
                <button
                  className={`negotiation-price-range-btn ${priceRange === "200000" ? "active" : ""}`}
                  onClick={() => {
                    setPriceRange("200000");
                    setSliderMax(200000);
                    setMinPrice(0);
                    setMaxPrice(200000);
                    setIsManualInput(false);
                  }}
                >
                  20만원
                </button>
                <button
                  className={`negotiation-price-range-btn ${priceRange === "300000" ? "active" : ""}`}
                  onClick={() => {
                    setPriceRange("300000");
                    setSliderMax(300000);
                    setMinPrice(0);
                    setMaxPrice(300000);
                    setIsManualInput(false);
                  }}
                >
                  30만원
                </button>
                <button
                  className={`negotiation-price-range-btn ${priceRange === "500000" ? "active" : ""}`}
                  onClick={() => {
                    setPriceRange("500000");
                    setSliderMax(500000);
                    setMinPrice(0);
                    setMaxPrice(500000);
                    setIsManualInput(false);
                  }}
                >
                  50만원
                </button>
                <button
                  className={`negotiation-price-range-btn ${priceRange === "1000000" ? "active" : ""}`}
                  onClick={() => {
                    setPriceRange("1000000");
                    setSliderMax(1000000);
                    setMinPrice(0);
                    setMaxPrice(1000000);
                    setIsManualInput(false);
                  }}
                >
                  100만원
                </button>
                <button
                  className={`negotiation-price-range-btn ${priceRange === "custom" ? "active" : ""}`}
                  onClick={() => {
                    setPriceRange("custom");
                    setIsManualInput(true);
                  }}
                >
                  직접 입력
                </button>
              </div>

              <div className="negotiation-price-inputs">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    setMinPrice(value);
                    if (isManualInput) {
                      const newMax = Math.max(value, maxPrice);
                      setSliderMax(Math.max(newMax, 10000));
                    }
                  }}
                  className="negotiation-price-input"
                  placeholder="최소가"
                />
                <span>~</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    const value = Math.max(minPrice, Number(e.target.value));
                    setMaxPrice(value);
                    if (isManualInput) {
                      setSliderMax(Math.max(value, 10000));
                    }
                  }}
                  className="negotiation-price-input"
                  placeholder="최대가"
                />
                <span className="negotiation-price-unit">원</span>
              </div>

              <div className="negotiation-price-slider-wrapper">
                <div className="negotiation-price-slider-container" style={{ opacity: isManualInput ? 0.4 : 1 }}>
                  <div 
                    className="negotiation-price-slider-track-active"
                    style={{
                      left: `${(minPrice / sliderMax) * 100}%`,
                      width: `${((maxPrice - minPrice) / sliderMax) * 100}%`
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={sliderMax}
                    step="1000"
                    value={minPrice}
                    onChange={(e) => {
                      const value = Math.min(Number(e.target.value), maxPrice - 1000);
                      setMinPrice(value);
                    }}
                    className="negotiation-price-slider negotiation-price-slider-min"
                    disabled={isManualInput}
                  />
                  <input
                    type="range"
                    min="0"
                    max={sliderMax}
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => {
                      const value = Math.max(Number(e.target.value), minPrice + 1000);
                      setMaxPrice(value);
                    }}
                    className="negotiation-price-slider negotiation-price-slider-max"
                    disabled={isManualInput}
                  />
                </div>
                <div className="negotiation-price-ticks">
                  <span className="negotiation-price-tick">0</span>
                  <span className="negotiation-price-tick">{(sliderMax * 0.2 / 10000).toFixed(0)}만</span>
                  <span className="negotiation-price-tick">{(sliderMax * 0.4 / 10000).toFixed(0)}만</span>
                  <span className="negotiation-price-tick">{(sliderMax * 0.6 / 10000).toFixed(0)}만</span>
                  <span className="negotiation-price-tick">{(sliderMax * 0.8 / 10000).toFixed(0)}만</span>
                  <span className="negotiation-price-tick">{(sliderMax / 10000).toFixed(0)}만</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="negotiation-filter-column">
          <div className="negotiation-filter-item">
            <label className="negotiation-filter-label">기간</label>
            <div className="negotiation-date-range-inner">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="negotiation-date-sep">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="negotiation-filter-item">
            <label className="negotiation-filter-label">상태</label>
            <div className="negotiation-status-filter">
              <button 
                className={`negotiation-status-btn ${statusFilter === "ALL" ? "active" : ""}`}
                onClick={() => setStatusFilter("ALL")}
              >
                전체
              </button>
              {isHistory ? (
                <>
                  <button 
                    className={`negotiation-status-btn ${statusFilter === "CANCELED" ? "active" : ""}`}
                    onClick={() => setStatusFilter("CANCELED")}
                  >
                    취소
                  </button>
                  <button 
                    className={`negotiation-status-btn ${statusFilter === "COMPLETED" ? "active" : ""}`}
                    onClick={() => setStatusFilter("COMPLETED")}
                  >
                    종료
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={`negotiation-status-btn ${statusFilter === "ONGOING" ? "active" : ""}`}
                    onClick={() => setStatusFilter("ONGOING")}
                  >
                    진행
                  </button>
                  <button 
                    className={`negotiation-status-btn ${statusFilter === "UPCOMING" ? "active" : ""}`}
                    onClick={() => setStatusFilter("UPCOMING")}
                  >
                    대기
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="negotiation-filter-item">
            <label className="negotiation-filter-label">상품명</label>
            <input
              type="text"
              placeholder="상품명을 입력해주세요"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="negotiation-search-input"
            />
          </div>

          <div className="negotiation-filter-item">
            <label className="negotiation-filter-label"></label>
            <div className="negotiation-filter-actions" style={{ justifyContent: 'flex-end', width: '100%' }}>
              <button className="negotiation-btn primary" onClick={handleSearch}>검색</button>
              <button className="negotiation-btn" onClick={handleReset}>초기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationFilter;
