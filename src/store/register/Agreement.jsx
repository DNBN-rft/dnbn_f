import "./css/agreement.css";

const Agreement = ({formData, setFormData, next}) => {

  const {agreement = {}} = formData;
  const allMandatoryChecked = agreement.terms && agreement.privacy && agreement.seller && agreement.marketing;
  
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
    
    const allMandatoryChecked = newAgreement.terms && newAgreement.privacy && newAgreement.seller;
    
    setFormData({
      ...formData,
      agreement: newAgreement,
      agreed: allMandatoryChecked
    });
  };

  const handleNext = () => {
    if (!allMandatoryChecked) {
      alert('필수 약관에 모두 동의해주세요.');
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
                checked={allMandatoryChecked}
                onChange={handleAllCheck}
              />
            </div>
            <div className="register-middle-text">약관 전체 동의</div>
          </div>
          <div className="register-middle">
            <div className="register-middle-check">
              서비스 이용을 위한 동의가 필요합니다.
            </div>
            <div className="register-middle-checkinfo">
              <div>
                <input type="checkbox"
                className="register-middle-checkbox"
                checked={agreement.terms || false}
                onChange={handleIndividualCheck('terms')}
                />
              </div>
              <div className="register-agreement">[필수]이용약관 동의</div>
              <div>화살표</div>
            </div>
            <div className="register-middle-checkinfo">
              <div>
                <input type="checkbox" 
                className="register-middle-checkbox"
                checked={agreement.privacy || false}
                onChange={handleIndividualCheck('privacy')}
                />
              </div>
              <div className="register-agreement">[필수]개인정보 수집이용 동의</div>
              <div>화살표</div>
            </div>
            <div className="register-middle-checkinfo">
              <div>
                <input type="checkbox" 
                className="register-middle-checkbox"
                checked={agreement.seller || false}
                onChange={handleIndividualCheck('seller')}
                />    
              </div>
              <div className="register-agreement">[필수]판매회원 이용약관 동의</div>
              <div>화살표</div>
            </div>
                        <div className="register-middle-checkinfo">
              <div>
                <input type="checkbox" 
                className="register-middle-checkbox"
                checked={agreement.marketing || false}
                onChange={handleIndividualCheck('marketing')}
                />    
              </div>
              <div className="register-agreement">[선택]마케팅 정보 및 알림 수신 동의</div>
              <div>화살표</div>
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
