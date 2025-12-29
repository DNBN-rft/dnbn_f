import "./css/fileinfo.css"
import StepButton from "../register/component/StepButton";
import { useState } from "react";
import { validateFileInfo } from "../../utils/registerValidation";
import { apiCall, apiPost } from "../../utils/apiClient";

const FileInfo = ({ formData, setFormData, onSubmit, prev }) => {
  const [storeImage, setStoreImage] = useState(null);
  const [storeImagePreview, setStoreImagePreview] = useState(null);
  const [businessDocs, setBusinessDocs] = useState([]);
  const [businessDocPreviews, setBusinessDocPreviews] = useState([]);
  const [dragActive, setDragActive] = useState({ store: false, business: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleStoreImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreImage(file);
        setStoreImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeStoreImage = () => {
    setStoreImage(null);
    setStoreImagePreview(null);
  };

  const handleBusinessDocsSelect = (files) => {
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const newPreviews = [];
    
    newFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({ file, preview: reader.result });
        if (newPreviews.length === newFiles.length) {
          setBusinessDocs(prev => [...prev, ...newFiles]);
          setBusinessDocPreviews(prev => [...prev, ...newPreviews.map(item => item.preview)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleStoreImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleStoreImageSelect(e.target.files[0]);
    }
  };

  const handleBusinessDocChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleBusinessDocsSelect(e.target.files);
    }
  };

  const removeBusinessDoc = (index) => {
    setBusinessDocs(prev => prev.filter((_, i) => i !== index));
    setBusinessDocPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (type === 'store') {
        handleStoreImageSelect(e.dataTransfer.files[0]);
      } else {
        handleBusinessDocsSelect(e.dataTransfer.files);
      }
    }
  };

  const handleSubmit = async () => {
    // 전체 검증 수행
    const validation = validateFileInfo(formData, storeImage, businessDocs);
    
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // 기본 정보들 추가
      formDataToSend.append("loginId", formData.loginId);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("bankId", formData.bankId);
      formDataToSend.append("storeNm", formData.storeNm);
      formDataToSend.append("storeTelNo", formData.storeTelNo);
      formDataToSend.append("storeZipCode", formData.storeZipCode);
      formDataToSend.append("storeAddr", formData.storeAddr);
      formDataToSend.append("storeAddrDetail", formData.storeAddrDetail);
      formDataToSend.append("storeAccNo", formData.storeAccNo);
      formDataToSend.append("ownerNm", formData.ownerNm);
      formDataToSend.append("ownerTelNo", formData.ownerTelNo);
      formDataToSend.append("bizNm", formData.bizNm);
      formDataToSend.append("bizType", formData.bizType);
      formDataToSend.append("bizNo", formData.bizNo);
      formDataToSend.append("bizRegDate", formData.bizRegDate);
      formDataToSend.append("storeOpenTime", formData.storeOpenTime);
      formDataToSend.append("storeCloseTime", formData.storeCloseTime);
      formDataToSend.append("storeType", formData.storeType);
      formDataToSend.append("agreed", formData.agreed);

      // 영업일 정보 추가
      if (formData.storeOpenDate && formData.storeOpenDate.length > 0) {
        formData.storeOpenDate.forEach((day) => {
          // day 객체에서 dayNm 추출하여 Enum 이름만 전송
          const dayName = day.dayNm || day;
          formDataToSend.append("storeOpenDate", dayName);
        });
      }

      // 파일 추가
      formDataToSend.append("storeImgFile", storeImage);
      businessDocs.forEach((file) => {
        formDataToSend.append("bzFile", file);
      });

      const response = await apiCall("/store/register", 
        {
          method: "POST",
          body: formDataToSend
        });

      if (response.ok) {
        alert("회원가입이 완료되었습니다.");
        onSubmit();
      } else {
        const errorText = await response.text();
        alert(`회원가입 실패: ${errorText}`);
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fileinfo-container">
      <div className="fileinfo-wrap">

        <div className="fileinfo-header">
          <div className="fileinfo-header-title">회원가입</div>
          <div className="fileinfo-header-text">4/4</div>
          <progress value="4" max="4">
            100%
          </progress>
        </div>

        <div className="fileinfo-middle-content">
            <div className="fileinfo-middle-title">첨부파일</div>
            
            <div className="fileinfo-middle-subtitle">가맹 대표 이미지</div>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                id="storeImage"
                accept=".jpg,.jpeg,.png"
                className="fileinfo-middle-file-input-hidden"
                onChange={handleStoreImageChange}
              />
              <label 
                htmlFor="storeImage" 
                className={`file-input-label ${dragActive.store ? 'drag-active' : ''}`}
                onDragEnter={(e) => handleDrag(e, 'store')}
                onDragLeave={(e) => handleDrag(e, 'store')}
                onDragOver={(e) => handleDrag(e, 'store')}
                onDrop={(e) => handleDrop(e, 'store')}
              >
                <div className="file-input-content">
                  {storeImagePreview ? (
                    <div className="file-preview-container">
                      <button 
                        type="button"
                        className="file-remove-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          removeStoreImage();
                        }}
                      >
                        ×
                      </button>
                      <img src={storeImagePreview} alt="미리보기" className="file-preview-image" />
                      <span className="file-name-small">{storeImage.name}</span>
                    </div>
                  ) : (
                    <>
                      <span className="file-input-text">가게 대표 이미지를 올려주세요.(jpg, png) </span>
                      <span className="file-input-link">파일찾기</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div className="fileinfo-middle-subtitle">사업자등록증, 영업신고증, 통장사본</div>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                id="businessDoc"
                accept=".jpg,.jpeg,.png"
                multiple
                className="fileinfo-middle-file-input-hidden"
                onChange={handleBusinessDocChange}
              />
              <label 
                htmlFor="businessDoc" 
                className={`file-input-label ${dragActive.business ? 'drag-active' : ''} ${businessDocs.length > 0 ? 'has-files' : ''}`}
                onDragEnter={(e) => handleDrag(e, 'business')}
                onDragLeave={(e) => handleDrag(e, 'business')}
                onDragOver={(e) => handleDrag(e, 'business')}
                onDrop={(e) => handleDrop(e, 'business')}
              >
                <div className="file-input-content">
                  {businessDocs.length > 0 ? (
                    <div className="file-preview-grid">
                      {businessDocs.map((file, index) => (
                        <div key={index} className="file-preview-item">
                          <button 
                            type="button"
                            className="file-remove-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              removeBusinessDoc(index);
                            }}
                          >
                            ×
                          </button>
                          <img src={businessDocPreviews[index]} alt="미리보기" className="file-preview-image" />
                          <span className="file-name-small">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <span className="file-input-text">사업자 증명, 영업신고증, 통장사본 파일을 올려주세요.(jpg, png) </span>
                      <span className="file-input-link">파일찾기</span>
                    </>
                  )}
                </div>
              </label>
            </div>
        </div>

        <StepButton step={5} prev={prev} onSubmit={handleSubmit} isLoading={isLoading}/>
      </div>
    </div>
  );
};

export default FileInfo;