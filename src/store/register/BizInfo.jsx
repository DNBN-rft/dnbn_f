import "./css/bizinfo.css";
import StepButton from "../register/component/StepButton";
import { useState, useEffect } from "react";
import { 
  validateBizInfo,
  restrictBusinessNumber,
  restrictName,
  restrictPhone,
  restrictBusinessType,
  restrictBusinessName,
  restrictAccountNumber
} from "../../utils/registerValidation";
import { apiGet, apiPost } from "../../utils/apiClient";

const BizInfo = ({ formData, setFormData, next, prev }) => {
  const [banks, setBanks] = useState([]);
  const [bizNoDuplicate, setBizNoDuplicate] = useState(null);
  const [bizNoCheckMessage, setBizNoCheckMessage] = useState("");

  useEffect(() => {
    fetchBanks();
    // bankId, storeZipCode, storeAddr 기본값 설정
    if (!formData.bankId || !formData.storeZipCode || !formData.storeAddr) {
      setFormData((prev) => ({
        ...prev,
        storeZipCode: "16915",
        storeAddr: "경기도 용인시 기흥구 구성로 184",
        storeType: "가맹점",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await apiGet("/bank");

      if (response.ok) {
        const data = await response.json();
        setBanks(data);
      }
    } catch (error) {
      console.error("은행 목록 조회 실패:", error);
    }
  };

  const handleInputChange = (field, value) => {
    // 필드별 입력 제한 적용
    let restrictedValue = value;
    
    if (field === 'bizNo') {
      restrictedValue = restrictBusinessNumber(value);
    } else if (field === 'ownerNm') {
      restrictedValue = restrictName(value);
    } else if (field === 'ownerTelNo') {
      restrictedValue = restrictPhone(value);
    } else if (field === 'bizType') {
      restrictedValue = restrictBusinessType(value);
    } else if (field === 'bizNm') {
      restrictedValue = restrictBusinessName(value);
    } else if (field === 'storeAccNo') {
      restrictedValue = restrictAccountNumber(value);
    }
    
    setFormData({
      ...formData,
      [field]: restrictedValue,
    });

    // 사업자번호 입력 시 중복 확인 초기화
    if (field === "bizNo") {
      setBizNoDuplicate(null);
      setBizNoCheckMessage("");
    }
  };

  const handleBizNoCheck = async () => {
    if (!formData.bizNo.trim()) {
      setBizNoCheckMessage("사업자번호를 입력해주세요.");
      setBizNoDuplicate(false);
      return;
    }

    try {
      const response = await apiGet(`/store/check-bizNo/${formData.bizNo}`);

      if (response.ok) {
        const data = await response.text();
        if (data.includes("사용가능")) {
          setBizNoCheckMessage("사용 가능한 사업자번호입니다.");
          setBizNoDuplicate(false);
        } else {
          setBizNoCheckMessage("이미 등록된 사업자번호입니다.");
          setBizNoDuplicate(true);
        }
      }
    } catch (error) {
      console.error("사업자번호 중복 체크 실패:", error);
      setBizNoCheckMessage("중복 체크 실패. 다시 시도해주세요.");
      setBizNoDuplicate(true);
    }
  };

  const handleNext = async () => {
    // 사업자 정보 검증 (util 함수 사용)
    const validation = validateBizInfo(formData, bizNoDuplicate);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // 사업자 등록번호 검증 API 호출
    try {
      const validationRequest = {
        businesses: [
          {
            b_no: formData.bizNo,
            start_dt: formData.bizRegDate.replace(/-/g, ""), // YYYYMMDD 형식으로 변환
            p_nm: formData.ownerNm,
          },
        ],
      };

      const response = await apiPost("/store/validate", validationRequest);

      if (response.ok) {
        await response.text();
        next();
      } else {
        alert("유효하지 않은 사업자 등록번호입니다.");
        return;
      }
    } catch (error) {
      console.error("사업자 등록번호 검증 실패:", error);
      alert("사업자 등록번호 검증 중 오류가 발생했습니다.");
      return;
    }
  };
  return (
    <div className="bizinfo-container">
      <div className="bizinfo-wrap">
        <div className="bizinfo-header">
          <div className="bizinfo-header-title">회원가입</div>
          <div className="bizinfo-header-text">3/4</div>
          <progress className="bizinfo-progress" value="3" max="4">75%</progress>
        </div>

        <div className="bizinfo-middle-title">사업자 정보 입력</div>
        <div className="bizinfo-middle-content">
          <div className="bizinfo-middle-subtitle">가맹명</div>
          <div>
            <input
              type="text"
              className="bizinfo-middle-input"
              value={formData.bizNm}
              onChange={(e) => handleInputChange("bizNm", e.target.value)}
            />
          </div>

          <div className="bizinfo-middle-subtitle">업종/업태</div>
          <div>
            <input
              type="text"
              className="bizinfo-middle-input"
              placeholder="예: 음식점/한식"
              value={formData.bizType || ""}
              onChange={(e) => handleInputChange("bizType", e.target.value)}
            />
          </div>

          <div className="bizinfo-middle-subtitle">사업자번호</div>
          <div className="bizinfo-middle-bizno-check-div">
            <input
              type="text"
              className="bizinfo-middle-input"
              placeholder="숫자만 입력 가능"
              value={formData.bizNo}
              onChange={(e) => handleInputChange("bizNo", e.target.value)}
            />
            <button
              type="button"
              onClick={handleBizNoCheck}
              className="bizinfo-middle-bizno-check"
            >
              중복체크
            </button>
          </div>
          {bizNoCheckMessage && (
            <div
              style={{
                color: bizNoDuplicate ? "red" : "green",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              {bizNoCheckMessage}
            </div>
          )}

          <div className="bizinfo-middle-subtitle">사업주 이름</div>
          <div>
            <input
              type="text"
              className="bizinfo-middle-input"
              value={formData.ownerNm}
              onChange={(e) => handleInputChange("ownerNm", e.target.value)}
            />
          </div>

          <div className="bizinfo-middle-subtitle">대표번호</div>
          <div>
            <input
              type="text"
              className="bizinfo-middle-input"
              placeholder="숫자만 입력 가능"
              value={formData.ownerTelNo}
              onChange={(e) => handleInputChange("ownerTelNo", e.target.value)}
            />
          </div>

          <div className="bizinfo-middle-subtitle">은행</div>
          <div>
            <select
              className="bizinfo-middle-input"
              value={formData.bankId || ""}
              onChange={(e) => handleInputChange("bankId", e.target.value)}
            >
              <option value="">은행 선택</option>
              {banks && banks.length > 0 ? (
                banks.map((bank) => (
                  <option key={bank.bankIdx} value={bank.bankIdx}>
                    {bank.bankNm}
                  </option>
                ))
              ) : (
                <option disabled>은행 정보를 불러오는 중...</option>
              )}
            </select>
          </div>

          <div className="bizinfo-middle-subtitle">계좌번호</div>
          <div>
            <input
              type="text"
              className="bizinfo-middle-input"
              placeholder="숫자만 입력 가능"
              value={formData.storeAccNo}
              onChange={(e) => handleInputChange("storeAccNo", e.target.value)}
            />
          </div>

          <div className="bizinfo-middle-subtitle">사업자 등록일</div>
          <div>
            <input
              type="date"
              className="bizinfo-middle-input"
              value={formData.bizRegDate || ""}
              onChange={(e) => handleInputChange("bizRegDate", e.target.value)}
            />
          </div>
        </div>

        <StepButton prev={prev} next={handleNext} />
      </div>
    </div>
  );
};

export default BizInfo;
