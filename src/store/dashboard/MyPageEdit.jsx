import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/mypageedit.css";
import PasswordChangeModal from "./modal/PasswordChangeModal";

const MyPageEdit = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    storeNm: "",
    storeTelNo: "",
    StoreAddr: "",
    StoreAddrDetail: "",
    BankNm: "",
    StoreAccNo: "",
    StoreOpenDate: "",
    StoreOpenTime: "",
    StoreCloseTime: "",
    businessDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storeCode = "STO_90865359"; // TODO: 실제 storeIdx를 로그인 정보에서 가져와야 합니다
        
        const response = await fetch(`http://localhost:8080/api/store/view/${storeCode}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch store data: ${response.status}`);
        }
        
        const data = await response.json();
        setStoreData(data);
        
        // 폼 데이터 초기화
        setFormData({
          storeNm: data.storeNm || "",
          storeTelNo: data.storeTelNo || "",
          StoreAddr: data.StoreAddr || "",
          StoreAddrDetail: data.StoreAddrDetail || "",
          BankNm: data.BankNm || "",
          StoreAccNo: data.StoreAccNo || "",
          StoreOpenDate: data.StoreOpenDate || "",
          StoreOpenTime: data.StoreOpenTime || "",
          StoreCloseTime: data.StoreCloseTime || "",
          businessDays: data.businessDays || ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPhoneNumber = (value) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, storeTelNo: formatted }));
  };

  const handleBusinessDayChange = (day) => {
    setFormData((prev) => {
      const isSelected = prev.businessDays.includes(day);
      const newBusinessDays = isSelected
        ? prev.businessDays.filter(d => d !== day)
        : [...prev.businessDays, day];
      
      return {
        ...prev,
        businessDays: newBusinessDays,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const storeIdx = 1; // TODO: 실제 storeIdx를 로그인 정보에서 가져와야 합니다
      
      const response = await fetch(`http://localhost:8080/api/store/update/${storeIdx}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update store data');
      }
      
      alert("정보가 성공적으로 수정되었습니다.");
      navigate('/mypage');
    } catch (error) {
      console.error("Error updating store data:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate('/mypage');
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!storeData) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="mypage-edit-wrap">
      <div className="mypage-edit-header">
        <div className="mypage-edit-header-title">내 정보 수정</div>
      </div>

      <div className="mypage-edit-content-wrap">
        <form onSubmit={handleSubmit}>
          <div className="mypage-edit-section-wrap">
            <div className="mypage-edit-section-left">
              <div className="mypage-edit-box">
                <div className="mypage-edit-box-title">가맹점 정보</div>
                
                <div className="mypage-edit-field">
                  <label>가맹점명</label>
                  <input
                    type="text"
                    name="storeNm"
                    value={formData.storeNm}
                    onChange={handleChange}
                    placeholder="가맹점명을 입력하세요"
                  />
                </div>

                <div className="mypage-edit-field">
                  <label>전화번호</label>
                  <input
                    type="text"
                    name="storeTelNo"
                    value={formData.storeTelNo}
                    onChange={handlePhoneChange}
                    placeholder="010-0000-0000"
                  />
                </div>

                <div className="mypage-edit-field">
                  <label>주소</label>
                  <input
                    type="text"
                    name="StoreAddr"
                    value={formData.StoreAddr}
                    onChange={handleChange}
                    placeholder="주소를 입력하세요"
                  />
                </div>

                <div className="mypage-edit-field">
                  <label>상세주소</label>
                  <input
                    type="text"
                    name="StoreAddrDetail"
                    value={formData.StoreAddrDetail}
                    onChange={handleChange}
                    placeholder="상세주소를 입력하세요"
                  />
                </div>
              </div>

              <div className="mypage-edit-box">
                <div className="mypage-edit-box-title">계좌 정보</div>
                
                <div className="mypage-edit-field">
                  <label>은행명</label>
                  <select
                    name="BankNm"
                    value={formData.BankNm}
                    onChange={handleChange}
                  >
                    <option value="">은행을 선택하세요</option>
                    <option value="KB국민은행">KB국민은행</option>
                    <option value="신한은행">신한은행</option>
                    <option value="우리은행">우리은행</option>
                    <option value="하나은행">하나은행</option>
                    <option value="NH농협은행">NH농협은행</option>
                    <option value="IBK기업은행">IBK기업은행</option>
                    <option value="SC제일은행">SC제일은행</option>
                    <option value="한국씨티은행">한국씨티은행</option>
                    <option value="카카오뱅크">카카오뱅크</option>
                    <option value="케이뱅크">케이뱅크</option>
                    <option value="토스뱅크">토스뱅크</option>
                    <option value="새마을금고">새마을금고</option>
                    <option value="신협">신협</option>
                    <option value="우체국">우체국</option>
                    <option value="KDB산업은행">KDB산업은행</option>
                    <option value="수협은행">수협은행</option>
                    <option value="대구은행">대구은행</option>
                    <option value="부산은행">부산은행</option>
                    <option value="경남은행">경남은행</option>
                    <option value="광주은행">광주은행</option>
                    <option value="전북은행">전북은행</option>
                    <option value="제주은행">제주은행</option>
                  </select>
                </div>

                <div className="mypage-edit-field">
                  <label>계좌번호</label>
                  <input
                    type="text"
                    name="StoreAccNo"
                    value={formData.StoreAccNo}
                    onChange={handleChange}
                    placeholder="계좌번호를 입력하세요"
                  />
                </div>

                <div className="mypage-edit-field">
                  <label>예금주</label>
                  <input
                    type="text"
                    value={storeData.OwnerNm}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="mypage-edit-section-right">
              <div className="mypage-edit-box">
                <div className="mypage-edit-box-title">사업자 정보</div>
                
                <div className="mypage-edit-field-row">
                  <div className="mypage-edit-field">
                    <label>사업자명</label>
                    <input
                      type="text"
                      value={storeData.BizNm}
                      disabled
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label>사업자번호</label>
                    <input
                      type="text"
                      value={storeData.BizNo}
                      disabled
                    />
                  </div>
                </div>

                <div className="mypage-edit-field-row">
                  <div className="mypage-edit-field">
                    <label>대표</label>
                    <input
                      type="text"
                      value={storeData.OwnerNm}
                      disabled
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label>대표 연락처</label>
                    <input
                      type="text"
                      value={storeData.OwnerTelNo}
                      disabled
                    />
                  </div>
                </div>

                <div className="mypage-edit-field-row">
                  <div className="mypage-edit-field">
                    <label>가맹점 유형</label>
                    <input
                      type="text"
                      value={storeData.StoreType}
                      disabled
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label>등록 신청일</label>
                    <input
                      type="text"
                      value={storeData.RequestedDateTime ? new Date(storeData.RequestedDateTime).toLocaleDateString('ko-KR') : '-'}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="mypage-edit-box">
                <div className="mypage-edit-box-title">운영 정보</div>
                
                <div className="mypage-edit-field">
                  <label>개업일</label>
                  <input
                    type="date"
                    name="StoreOpenDate"
                    value={formData.StoreOpenDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="mypage-edit-field-row">
                  <div className="mypage-edit-field">
                    <label>오픈시간</label>
                    <input
                      type="time"
                      name="StoreOpenTime"
                      value={formData.StoreOpenTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label>마감시간</label>
                    <input
                      type="time"
                      name="StoreCloseTime"
                      value={formData.StoreCloseTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mypage-edit-field">
                  <label>영업일</label>
                  <div className="mypage-edit-business-days">
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.businessDays.includes('MON')}
                        onChange={() => handleBusinessDayChange('MON')}
                      />
                      월
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.businessDays.includes('TUE')}
                        onChange={() => handleBusinessDayChange('TUE')}
                      />
                      화
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.businessDays.includes('WED')}
                        onChange={() => handleBusinessDayChange('WED')}
                      />
                      수
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.businessDays.includes('THU')}
                        onChange={() => handleBusinessDayChange('THU')}
                      />
                      목
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.businessDays.includes('FRI')}
                        onChange={() => handleBusinessDayChange('FRI')}
                      />
                      금
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.businessDays.includes('SAT')}
                        onChange={() => handleBusinessDayChange('SAT')}
                      />
                      토
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.businessDays.includes('SUN')}
                        onChange={() => handleBusinessDayChange('SUN')}
                      />
                      일
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mypage-edit-section-wrap">
            <div className="mypage-edit-section-left">
              <div className="mypage-edit-box">
                <div className="mypage-edit-box-title">로그인 정보 변경</div>
                
                <div className="mypage-edit-password-row">
                  <div className="mypage-edit-field">
                    <label>로그인 아이디</label>
                    <input
                      type="text"
                      value={storeData.LoginId || "admin@example.com"}
                      disabled
                    />
                  </div>
                  
                  <button 
                    type="button"
                    className="mypage-edit-password-btn"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    비밀번호 변경
                  </button>
                </div>
              </div>
            </div>

            <div className="mypage-edit-section-right">
              <div className="mypage-edit-button-group-inline">
                <button type="submit" className="mypage-edit-submit-btn">
                  저장
                </button>
                <button 
                  type="button" 
                  className="mypage-edit-cancel-btn"
                  onClick={handleCancel}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showPasswordModal && (
        <PasswordChangeModal 
          onClose={() => setShowPasswordModal(false)}
          storeIdx={1} // TODO: 실제 storeIdx를 로그인 정보에서 가져와야 합니다
        />
      )}
    </div>
  );
};

export default MyPageEdit;
