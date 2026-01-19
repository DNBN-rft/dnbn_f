import "./css/agreement.css";
import { validateAgreement } from "../../utils/registerValidation";

const Agreement = ({formData, setFormData, next}) => {

  const {agreement = {}} = formData;
  // 전체 약관 체크 여부 (marketing 포함)
  const allChecked = agreement.terms && agreement.privacy && agreement.seller && agreement.marketing;
  
  const handleAllCheck = (e) => {
    const isChecked = e.target.checked;
    setFormData({
      ...formData,
      agreement: {
        terms: isChecked,
        privacy: isChecked,
        seller: isChecked,
        marketing: isChecked
      },
      agreed: isChecked
    });
  };

  const handleIndividualCheck = (field) => (e) => {
    const newAgreement = {
      ...agreement,
      [field]: e.target.checked
    };
    
    // 필수 항목만 체크 (marketing은 선택 사항이므로 제외)
    const mandatoryChecked = newAgreement.terms && newAgreement.privacy && newAgreement.seller;
    
    setFormData({
      ...formData,
      agreement: newAgreement,
      agreed: mandatoryChecked
    });
  };

  const handleNext = () => {
    // validation util 사용
    const validation = validateAgreement(agreement);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }
    next();
  };
  
  return (
    <div className="register-container">
      <div className="register-wrap">
        <div className="register-top-content">
          <div className="register-top-title">동네방네 회원가입</div>
          <div className="register-top-text">
            동네방네에서 제공하는 모든 서비스와 혜택을 누릴 수 있어요.
          </div>
        </div>
        <div className="register-middle-content">
          <div className="register-middle-title">
            <div className="register-middle-check-div">
              <input 
                type="checkbox" 
                className="register-middle-checkbox"
                checked={allChecked}
                onChange={handleAllCheck}
              />
            </div>
            <div className="register-middle-text">약관 전체 동의</div>
          </div>
          <div className="register-middle">
            <div className="register-middle-check">
              서비스 이용을 위한 동의가 필요합니다.
            </div>
            <div className="register-middle-checkinfo first">
              <div className="register-checkinfo-checkbox">
                <input type="checkbox"
                className="register-middle-checkbox"
                checked={agreement.terms || false}
                onChange={handleIndividualCheck('terms')}
                />
              </div>
              <div className="register-agreement">[필수]이용약관 동의</div>
              <div className="register-checkinfo-arrow">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="register-middle-checkinfo">
              <div className="register-checkinfo-checkbox">
                <input type="checkbox" 
                className="register-middle-checkbox"
                checked={agreement.privacy || false}
                onChange={handleIndividualCheck('privacy')}
                />
              </div>
              <div className="register-agreement">[필수]개인정보 수집이용 동의</div>
              <div className="register-checkinfo-arrow">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="register-middle-checkinfo">
              <div className="register-checkinfo-checkbox">
                <input type="checkbox" 
                className="register-middle-checkbox"
                checked={agreement.seller || false}
                onChange={handleIndividualCheck('seller')}
                />    
              </div>
              <div className="register-agreement">[필수]판매회원 이용약관 동의</div>
              <div className="register-checkinfo-arrow">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
                        <div className="register-middle-checkinfo last">
              <div className="register-checkinfo-checkbox">
                <input type="checkbox" 
                className="register-middle-checkbox"
                checked={agreement.marketing || false}
                onChange={handleIndividualCheck('marketing')}
                />    
              </div>
              <div className="register-agreement">[선택]마케팅 정보 및 알림 수신 동의</div>
              <div className="register-checkinfo-arrow">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="register-bottom-content">
          <button className="register-bottom-next-btn" onClick={handleNext}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default Agreement;
