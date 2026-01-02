import { useEffect, useState } from "react";
import "./css/faqpage.css";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../utils/apiClient";

const FaqPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadFaqs();
  }, [])

  const loadFaqs = async () => {

    try {
      const response = await apiGet("/store/faq");
      if (!response.ok) {
        throw new Error("FAQ 목록을 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setFaqs(data);
    } catch (e) {
    }
  }

    const toggleAccordion = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    const handleCategoryClick = (categoryIndex) => {
      setSelectedCategory(categoryIndex);
      setOpenIndex(null);
    };

    return (
      <div className="faqpage-container">
        <div className="faqpage-wrap">

          <div className="faqpage-searchbox">
            <div className="faqpage-search-title">도움이 필요하신가요?</div>
            <div className="faqpage-search-content">궁금한 내용을 검색해보세요.</div>
            <div className="faqpage-search-inputbox"><input type="text" className="faqpage-search-input" placeholder="검색어를 입력하세요." /><button className="faqpage-search-btn">Search</button></div>
          </div>

          <div className="faqpage-contentbox">
            <div className="faqpage-list">
              {faqs.length > 0 && faqs[selectedCategory]?.faqList.map((faq, index) => (
                <div key={index} className="faqpage-item">
                  <div
                    className={`faqpage-col-q ${openIndex === index ? 'faqpage-col-q-active' : ''}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <span>{faq.faqTitle}</span>
                    <span className={`faqpage-arrow ${openIndex === index ? 'faqpage-arrow-up' : 'faqpage-arrow-down'}`}>
                      {openIndex === index ? '▲' : '▼'}
                    </span>
                  </div>
                  {openIndex === index && (
                    <div className="faqpage-col-a">
                      {faq.faqContent}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="faqpage-tab">
              {faqs.map((category, index) => (
                <div
                  key={index}
                  className={`faqpage-tab-list ${selectedCategory === index ? 'faqpage-tab-active' : ''}`}
                  onClick={() => handleCategoryClick(index)}
                >
                  {category.faqType}
                </div>
              ))}
            </div>
          </div>

          <div className="faqpage-question">
            <div className="faqpage-question-title">아직 궁금증이 해결되지 않으셨나요?</div>
            <div className="faqpage-question-btnbox"><button className="faqpage-question-btn" onClick={() => navigate("/store/questions")}>1:1 문의하기</button></div>
          </div>
        </div>
      </div>
    );
  };

export default FaqPage;
