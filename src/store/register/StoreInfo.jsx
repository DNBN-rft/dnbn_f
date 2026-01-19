import "./css/storeinfo.css";
import StepButton from "../register/component/StepButton";
import { useState, useMemo, useEffect } from "react";
import { validateStoreInfo } from "../../utils/registerValidation";

const StoreInfo = ({ formData, setFormData, next, prev }) => {
  const [openDays, setOpenDays] = useState({
    MON: false,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false,
    SAT: false,
    SUN: false
  });

  // formData에서 영업일 복원
  useEffect(() => {
    if (formData.storeOpenDate && formData.storeOpenDate.length > 0) {
      const restoredDays = {
        MON: false,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        SUN: false
      };
      
      formData.storeOpenDate.forEach(item => {
        if (item.dayNm) {
          restoredDays[item.dayNm] = true;
        }
      });
      
      setOpenDays(restoredDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = useMemo(() => generateTimeOptions(), []);

  const closeTimeOptions = useMemo(() => {
    if (!formData.storeOpenTime) return [];
    const startIndex = timeOptions.indexOf(formData.storeOpenTime);
    return timeOptions.slice(startIndex + 1);
  }, [formData.storeOpenTime, timeOptions]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleAddressSearch = () => {
    window.open('/address-search.html', 'addressSearch', 'width=500,height=500,top=50');
  };

  const handleOpenDayChange = (day) => {
    const newOpenDays = {
      ...openDays,
      [day]: !openDays[day]
    };
    setOpenDays(newOpenDays);
    
    // formData에 저장할 OpenDay 객체 배열
    const storeOpenDate = Object.keys(newOpenDays)
      .filter(key => newOpenDays[key])
      .map(day => ({ dayNm: day }));
    
    setFormData({
      ...formData,
      storeOpenDate: storeOpenDate
    });
  };

  const handleNext = () => {
    // 가맹점 정보 검증
    const validation = validateStoreInfo(formData);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    next();
  };
  return (
    <div className="storeinfo-container">
      <div className="storeinfo-wrap">

        <div className="storeinfo-header">
          <div className="storeinfo-header-title">회원가입</div>
          <div className="storeinfo-header-text">2/4</div>
          <progress className="storeinfo-progress" value="2" max="4">50%</progress>
        </div>

        <div className="storeinfo-middle-title">가게 정보 입력</div>
        <div className="storeinfo-middle-content">
            <div className="storeinfo-middle-subtitle">가게명</div>
            <div>
              <input 
                type="text" 
                className="storeinfo-middle-nm-input"
                value={formData.storeNm}
                onChange={(e) => handleInputChange('storeNm', e.target.value)}
              />
            </div>

            <div className="storeinfo-middle-subtitle">가게 연락처</div>
            <div>
              <input 
                type="text" 
                className="storeinfo-middle-tel-input"
                placeholder="숫자만 입력 가능"
                value={formData.storeTelNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('storeTelNo', value);
                }}
              />
            </div>

            <div className="storeinfo-middle-subtitle">우편번호</div>
            <div className="storeinfo-middle-addr-div">
              <input 
                type="text" 
                className="storeinfo-middle-zipcode-input" 
                disabled
                value={formData.storeZipCode}
              />
              <div 
                className="storeinfo-middle-addr-search"
                onClick={handleAddressSearch}
              >
                주소검색
              </div>
            </div>
            <div className="storeinfo-middle-subtitle">주소</div>
            <div className="storeinfo-middle-addr-div">
              <input 
                type="text" 
                className="storeinfo-middle-addr-input" 
                disabled
                value={formData.storeAddr}
              />
            </div>
            <div className="storeinfo-middle-subtitle">상세주소</div>
            <div>
              <input 
                type="text" 
                className="storeinfo-middle-addr-input"
                value={formData.storeAddrDetail}
                onChange={(e) => handleInputChange('storeAddrDetail', e.target.value)}
              />
            </div>

            <div className="storeinfo-middle-subtitle">영업일</div>
            <div className="storeinfo-middle-check-div">
                <div>
                  <input 
                    type="checkbox" 
                    name="MON"
                    checked={openDays.MON}
                    onChange={() => handleOpenDayChange('MON')}
                  />
                  월
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    name="TUE"
                    checked={openDays.TUE}
                    onChange={() => handleOpenDayChange('TUE')}
                  />
                  화
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    name="WED"
                    checked={openDays.WED}
                    onChange={() => handleOpenDayChange('WED')}
                  />
                  수
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    name="THU"
                    checked={openDays.THU}
                    onChange={() => handleOpenDayChange('THU')}
                  />
                  목
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    name="FRI"
                    checked={openDays.FRI}
                    onChange={() => handleOpenDayChange('FRI')}
                  />
                  금
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    name="SAT"
                    checked={openDays.SAT}
                    onChange={() => handleOpenDayChange('SAT')}
                  />
                  토
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    name="SUN"
                    checked={openDays.SUN}
                    onChange={() => handleOpenDayChange('SUN')}
                  />
                  일
                </div>
            </div>
            <div className="storeinfo-middle-subtitle">영업시간</div>
            <div className="storeinfo-middle-workhour-div">
                <div className="storeinfo-middle-work">
                  <select 
                    className="storeinfo-middle-workhour-input"
                    value={formData.storeOpenTime || ""}
                    onChange={(e) => {
                      const newOpenTime = e.target.value;
                      const shouldResetCloseTime = formData.storeCloseTime && newOpenTime >= formData.storeCloseTime;
                      
                      setFormData({
                        ...formData,
                        storeOpenTime: newOpenTime,
                        storeCloseTime: shouldResetCloseTime ? '' : formData.storeCloseTime
                      });
                    }}
                  >
                    <option value="">시작 시간</option>
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div className="storeinfo-middle-work-wave">~</div>
                <div className="storeinfo-middle-work">
                  <select 
                    className="storeinfo-middle-workhour-input"
                    value={formData.storeCloseTime || ""}
                    onChange={(e) => handleInputChange('storeCloseTime', e.target.value)}
                    disabled={!formData.storeOpenTime}
                  >
                    <option value="">종료 시간</option>
                    {closeTimeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
            </div>
        </div>

        <StepButton next={handleNext} prev={prev}/>
      </div>
    </div>
  );
};

export default StoreInfo;
