import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/mypageedit.css";
import PasswordChangeModal from "./modal/PasswordChangeModal";
import { apiGet, apiPutFormData } from "../../utils/apiClient";

const MyPageEdit = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [banks, setBanks] = useState([]);

  const [formData, setFormData] = useState({
    storeNm: "",
    storeTelNo: "",
    storeAddr: "",
    storeAddrDetail: "",
    bankIdx: "",
    storeAccNo: "",
    ownerNm: "",
    storeOpenDate: [],
    storeOpenTime: "",
    storeCloseTime: "",
  });

  const [mainImgFile, setMainImgFile] = useState(null);
  const [mainImgPreview, setMainImgPreview] = useState(null);
  const [mainImgDeleted, setMainImgDeleted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      
      try {
        let userInfo = localStorage.getItem("user");
        const storeCode = JSON.parse(userInfo).storeCode;
        
        const response = await apiGet(`/store/view/${storeCode}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch store data: ${response.status}`);
        }
        
        const data = await response.json();
        setStoreData(data);
        
        // 폼 데이터 초기화
        setFormData({
          storeNm: data.storeNm || "",
          storeTelNo: data.storeTelNo || "",
          storeAddr: data.storeAddr || "",
          storeAddrDetail: data.storeAddrDetail || "",
          bankIdx: data.bankIdx || "1",
          storeAccNo: data.storeAccNo || "",
          ownerNm: data.ownerNm || "",
          storeOpenDate: data.storeOpenDate || [],
          storeOpenTime: data.storeOpenTime || "",
          storeCloseTime: data.storeCloseTime || "",
        });
        setMainImgPreview(data.mainImg.fileUrl || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

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

    fetchUserData();
    fetchBanks();
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
      const isSelected = prev.storeOpenDate.includes(day);
      const newStoreOpenDate = isSelected
        ? prev.storeOpenDate.filter(d => d !== day)
        : [...prev.storeOpenDate, day];
      
      return {
        ...prev,
        storeOpenDate: newStoreOpenDate,
      };
    });
  };

  const handleMainImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('이미지 파일 크기는 10MB를 초과할 수 없습니다.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImgFile(file);
        setMainImgPreview(reader.result);
        setMainImgDeleted(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleMainImageSelect(e.target.files[0]);
    }
  };

  const handleMainImageDelete = () => {
    setMainImgFile(null);
    setMainImgPreview(null);
    setMainImgDeleted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let userInfo = localStorage.getItem("user");
      const storeCode = JSON.parse(userInfo).storeCode;
      
      // 한글 요일을 OpenDay enum 상수명으로 변환
      const dayMap = {
        '월': 'MON',
        '화': 'TUE',
        '수': 'WED',
        '목': 'THU',
        '금': 'FRI',
        '토': 'SAT',
        '일': 'SUN'
      };
      
      const submitData = new FormData();
      submitData.append("storeNm", formData.storeNm);
      submitData.append("storeTelNo", formData.storeTelNo);
      submitData.append("storeAddr", formData.storeAddr);
      submitData.append("storeAddrDetail", formData.storeAddrDetail);
      submitData.append("bankIdx", formData.bankIdx);
      submitData.append("storeAccNo", formData.storeAccNo);
      submitData.append("ownerNm", formData.ownerNm);
      submitData.append("storeOpenTime", formData.storeOpenTime);
      submitData.append("storeCloseTime", formData.storeCloseTime);
      formData.storeOpenDate.forEach((day) => {
        submitData.append("storeOpenDate", dayMap[day]);
      });
      
      if (mainImgFile) {
        submitData.append("mainImg", mainImgFile);
      }
      
      const response = await apiPutFormData(`/store/info-modify/${storeCode}`, submitData);
      
      if (!response.ok) {
        throw new Error('Failed to update store data');
      }
      
      alert("정보가 성공적으로 수정되었습니다.");
      navigate('/store/mypage');
    } catch (error) {
      console.error("Error updating store data:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate('/store/mypage');
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
                    name="storeAddr"
                    value={formData.storeAddr}
                    onChange={handleChange}
                    placeholder="주소를 입력하세요"
                  />
                </div>

                <div className="mypage-edit-field">
                  <label>상세주소</label>
                  <input
                    type="text"
                    name="storeAddrDetail"
                    value={formData.storeAddrDetail}
                    onChange={handleChange}
                    placeholder="상세주소를 입력하세요"
                  />
                </div>
              </div>

              <div className="mypage-edit-box">
                <div className="mypage-edit-box-title">대표 이미지</div>

                <div className="mypage-edit-field">
                  {mainImgPreview && !mainImgDeleted ? (
                    <div className="mypage-edit-image-container">
                      <img
                        src={mainImgPreview}
                        alt="대표 이미지"
                        className="mypage-edit-store-image"
                      />
                      <button
                        type="button"
                        className="mypage-edit-image-delete-btn"
                        onClick={handleMainImageDelete}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="mypage-edit-no-image">이미지가 없습니다</div>
                  )}
                </div>

                {(!mainImgPreview || mainImgDeleted) && (
                  <div className="mypage-edit-field">
                    <input
                      type="file"
                      id="mainImage"
                      accept=".jpg,.jpeg,.png"
                      className="mypage-edit-file-input-hidden"
                      onChange={handleMainImageChange}
                    />
                    <label htmlFor="mainImage" className="mypage-edit-file-upload-label">
                      이미지 업로드
                    </label>
                  </div>
                )}
              </div>

              <div className="mypage-edit-box">
                <div className="mypage-edit-box-title">계좌 정보</div>
                
                <div className="mypage-edit-field">
                  <label>은행명</label>
                  <select
                    name="bankIdx"
                    value={formData.bankIdx || ""}
                    onChange={handleChange}
                  >
                    <option value="">은행을 선택하세요</option>
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

                <div className="mypage-edit-field">
                  <label>계좌번호</label>
                  <input
                    type="text"
                    name="storeAccNo"
                    value={formData.storeAccNo}
                    onChange={handleChange}
                    placeholder="계좌번호를 입력하세요"
                  />
                </div>

                <div className="mypage-edit-field">
                  <label>예금주</label>
                  <input
                    type="text"
                    value={storeData.ownerNm}
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
                      value={storeData.bizNm}
                      disabled
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label>사업자번호</label>
                    <input
                      type="text"
                      value={storeData.bizNo}
                      disabled
                    />
                  </div>
                </div>

                <div className="mypage-edit-field-row">
                  <div className="mypage-edit-field">
                    <label>대표</label>
                    <input
                      type="text"
                      value={storeData.ownerNm}
                      disabled
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label>대표 연락처</label>
                    <input
                      type="text"
                      value={storeData.ownerTelNo}
                      disabled
                    />
                  </div>
                </div>

                <div className="mypage-edit-field-row">
                  <div className="mypage-edit-field">
                    <label>가맹점 유형</label>
                    <input
                      type="text"
                      value={storeData.storeType}
                      disabled
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label>사업자 등록일</label>
                    <input
                      type="text"
                      value={storeData.requestedDateTime ? new Date(storeData.requestedDateTime).toLocaleDateString('ko-KR') : '-'}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="mypage-edit-box">
                <div className="mypage-edit-box-title">운영 정보</div>
                
                <div className="mypage-edit-field-row">
                  <div className="mypage-edit-field">
                    <label>오픈시간</label>
                    <input
                      type="time"
                      name="storeOpenTime"
                      value={formData.storeOpenTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label>마감시간</label>
                    <input
                      type="time"
                      name="storeCloseTime"
                      value={formData.storeCloseTime}
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
                        checked={formData.storeOpenDate.includes('월')}
                        onChange={() => handleBusinessDayChange('월')}
                      />
                      월
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.storeOpenDate.includes('화')}
                        onChange={() => handleBusinessDayChange('화')}
                      />
                      화
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.storeOpenDate.includes('수')}
                        onChange={() => handleBusinessDayChange('수')}
                      />
                      수
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.storeOpenDate.includes('목')}
                        onChange={() => handleBusinessDayChange('목')}
                      />
                      목
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.storeOpenDate.includes('금')}
                        onChange={() => handleBusinessDayChange('금')}
                      />
                      금
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.storeOpenDate.includes('토')}
                        onChange={() => handleBusinessDayChange('토')}
                      />
                      토
                    </label>
                    <label className="mypage-edit-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.storeOpenDate.includes('일')}
                        onChange={() => handleBusinessDayChange('일')}
                      />
                      일
                    </label>
                  </div>
                </div>
              </div>

              <div className="mypage-edit-box">
                <div className="mypage-edit-box-title">로그인 정보 변경</div>
                
                <div className="mypage-edit-password-row">
                  <div className="mypage-edit-field">
                    <label>로그인 아이디</label>
                    <input
                      type="text"
                      value={JSON.parse(localStorage.getItem('user')).memberId || "admin@example.com"}
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
          </div>

          <div className="mypage-edit-section-wrap">
            <div className="mypage-edit-section-right" style={{ marginLeft: "auto" }}>
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
