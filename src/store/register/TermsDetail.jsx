import { useNavigate, useParams } from "react-router-dom";
import { TERMS_HTML } from "../../utils/termsContent";
import "./css/termsDetail.css";

const TermsDetail = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  // 약관 타입에 따른 HTML 파일명 매핑
  const getTermsFileName = (type) => {
    const termsMap = {
      'terms': '동네방네_서비스_통합_정책_가이드라인_V1.html',
      'privacy': '개인정보_처리방침_소비자_V2.html',
      'seller': '동네방네_가맹점_개인정보_처리방침_V2.html',
      'marketing': '동네방네_마케팅_수신_동의_약관_V1.html'
    };
    return termsMap[type];
  };

  // 약관 타입에 따른 제목 매핑
  const getTermsTitle = (type) => {
    const titleMap = {
      'terms': '이용약관',
      'privacy': '개인정보 수집이용 동의',
      'seller': '판매회원 이용약관',
      'marketing': '마케팅 정보 및 알림 수신 동의'
    };
    return titleMap[type] || '약관';
  };

  const fileName = getTermsFileName(type);
  const htmlContent = TERMS_HTML[fileName];
  const title = getTermsTitle(type);

  // HTML에서 body 내용만 추출하고 내부 style 제거
  const getCleanedHtml = (html) => {
    if (!html) return '';
    
    // style 태그 제거
    let cleaned = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // body 태그 내용만 추출
    const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      cleaned = bodyMatch[1];
    }
    
    return cleaned;
  };

  const cleanedContent = getCleanedHtml(htmlContent);

  if (!htmlContent) {
    return (
      <div className="terms-detail-container">
        <div className="terms-detail-header">
          <button className="terms-back-btn" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="terms-title">약관</h1>
        </div>
        <div className="terms-detail-content">
          <p>약관을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="terms-detail-container">
      <div className="terms-detail-header">
        <button className="terms-back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="terms-title">{title}</h1>
      </div>
      <div className="terms-detail-content">
        <div dangerouslySetInnerHTML={{ __html: cleanedContent }} />
      </div>
    </div>
  );
};

export default TermsDetail;
