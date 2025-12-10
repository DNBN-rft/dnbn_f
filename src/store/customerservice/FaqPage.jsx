import { useState } from "react";
import "./css/faqpage.css";

const FaqPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    { id: 0, name: "계정 및 가입" },
    { id: 1, name: "사용 및 기능" },
    { id: 2, name: "결제 및 요금" },
    { id: 3, name: "개인정보 및 보안" },
    { id: 4, name: "법률 및 약관" },
    { id: 5, name: "연락처 및 지원" }
  ];

  const faqData = {
    0: [
      { question: "서비스 비용은 얼마인가요?", answer: "서비스 비용은 선택하신 플랜에 따라 다릅니다. 기본 플랜은 월 10,000원부터 시작하며, 프리미엄 플랜은 월 30,000원입니다." },
      { question: "계정은 어떻게 만드나요?", answer: "웹사이트 상단의 '회원가입' 버튼을 클릭하시고 이메일과 비밀번호를 입력하시면 됩니다." },
      { question: "계정 삭제는 어떻게 하나요?", answer: "설정 > 계정 관리 > 계정 삭제 메뉴에서 삭제하실 수 있습니다." },
      { question: "비밀번호를 잊어버렸어요", answer: "로그인 페이지에서 '비밀번호 찾기'를 클릭하시면 등록하신 이메일로 비밀번호 재설정 링크를 보내드립니다." },
      { question: "이메일 변경은 어떻게 하나요?", answer: "설정 > 계정 정보에서 이메일 변경이 가능합니다. 변경 시 본인 인증 절차가 필요합니다.여기서 데이터가 더 늘어나면 박스는 아래로 늘어나는건가? 그럼 전체적으로 아래가 밀리는건지 확인은 해봐야지" }
    ],
    1: [
      { question: "어떤 결제 수단을 지원하나요?", answer: "신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등 다양한 결제 수단을 지원합니다." },
      { question: "환불 정책은 어떻게 되나요?", answer: "서비스 이용 후 7일 이내에 환불 요청이 가능하며, 사용하지 않은 기간에 대해 일할 계산하여 환불해드립니다." },
      { question: "모바일에서도 사용할 수 있나요?", answer: "네, 모바일 웹 및 앱을 통해 모든 기능을 동일하게 이용하실 수 있습니다." },
      { question: "오프라인에서도 이용 가능한가요?", answer: "일부 기능은 오프라인 모드를 지원하지만, 대부분의 기능은 인터넷 연결이 필요합니다." }
    ],
    2: [
      { question: "결제 정보는 어떻게 업데이트하나요?", answer: "마이페이지 > 결제 설정에서 언제든지 결제 정보를 업데이트하실 수 있습니다." },
      { question: "구독 플랜 변경은 어떻게 하나요?", answer: "마이페이지 > 멤버십 관리에서 플랜을 변경하실 수 있습니다." },
      { question: "세금계산서 발행이 가능한가요?", answer: "네, 사업자 회원의 경우 마이페이지에서 세금계산서 발행을 요청하실 수 있습니다." },
      { question: "결제 영수증은 어디서 확인하나요?", answer: "마이페이지 > 결제 내역에서 모든 결제 영수증을 확인하고 출력하실 수 있습니다." }
    ],
    3: [
      { question: "어떤 구독 플랜을 제공하나요?", answer: "베이직, 스탠다드, 프리미엄 세 가지 플랜을 제공하며, 각 플랜마다 다양한 기능과 혜택이 포함되어 있습니다." },
      { question: "무료 체험 기간이 있나요?", answer: "네, 모든 신규 가입자에게 14일 무료 체험 기간을 제공합니다." },
      { question: "개인정보는 안전하게 보관되나요?", answer: "모든 개인정보는 암호화되어 저장되며, 관련 법규를 준수하여 안전하게 관리됩니다." },
      { question: "제 정보가 제3자에게 제공되나요?", answer: "법적 요구사항이 있는 경우를 제외하고, 회원님의 동의 없이 제3자에게 정보를 제공하지 않습니다." }
    ],
    4: [
      { question: "여러 결제 수단을 함께 사용할 수 있나요?", answer: "죄송하지만 현재는 하나의 구독에 하나의 결제 수단만 등록 가능합니다. 필요시 결제 수단을 변경하실 수 있습니다." },
      { question: "자동 결제는 어떻게 관리하나요?", answer: "마이페이지 > 결제 설정에서 자동 결제를 활성화하거나 비활성화할 수 있습니다." },
      { question: "이용약관은 어디서 확인하나요?", answer: "웹사이트 하단의 '이용약관' 링크를 통해 전체 약관을 확인하실 수 있습니다." },
      { question: "약관이 변경되면 알려주나요?", answer: "네, 약관 변경 시 이메일과 서비스 내 공지를 통해 사전에 안내드립니다." }
    ],
    5: [
      { question: "고객센터 운영 시간은 어떻게 되나요?", answer: "평일 오전 9시부터 오후 6시까지 운영하며, 주말 및 공휴일은 휴무입니다." },
      { question: "긴급 문의는 어떻게 하나요?", answer: "24시간 챗봇 상담이 가능하며, 긴급한 경우 이메일로 문의하시면 최대한 빠르게 답변드리겠습니다." },
      { question: "전화 상담도 가능한가요?", answer: "네, 평일 운영시간 내에 고객센터 대표번호(1234-5678)로 전화 상담이 가능합니다." },
      { question: "피드백은 어떻게 보낼 수 있나요?", answer: "서비스 개선 제안이나 피드백은 고객센터 또는 설정 > 피드백 보내기를 통해 전달하실 수 있습니다." }
    ]
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setOpenIndex(null);
  };

  return (
    <div className="faqpage-container">
      <div className="faqpage-wrap">

        <div className="faqpage-searchbox">
            <div className="faqpage-search-title">도움이 필요하신가요?</div>
            <div className="faqpage-search-content">궁금한 내용을 검색해보세요.</div>
            <div className="faqpage-search-inputbox"><input type="text" className="faqpage-search-input" placeholder="검색어를 입력하세요."/><button className="faqpage-search-btn">Search</button></div>
        </div>

        <div className="faqpage-contentbox">
            <div className="faqpage-list">
              {faqData[selectedCategory].map((faq, index) => (
                <div key={index} className="faqpage-item">
                  <div 
                    className={`faqpage-col-q ${openIndex === index ? 'faqpage-col-q-active' : ''}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <span>{faq.question}</span>
                    <span className={`faqpage-arrow ${openIndex === index ? 'faqpage-arrow-up' : 'faqpage-arrow-down'}`}>
                      {openIndex === index ? '▲' : '▼'}
                    </span>
                  </div>
                  {openIndex === index && (
                    <div className="faqpage-col-a">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="faqpage-tab">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className={`faqpage-tab-list ${selectedCategory === category.id ? 'faqpage-tab-active' : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </div>
              ))}
            </div>
        </div>

        <div className="faqpage-question">
            <div className="faqpage-question-title">아직 궁금증이 해결되지 않으셨나요?</div>
            <div className="faqpage-question-btnbox"><button className="faqpage-question-btn">1:1 문의하기</button></div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
