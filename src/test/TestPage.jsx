import "./css/testpage.css";

const TestPage = () => {
  return (
    <div className="box">
      <div className="section-wrapper">
        <div className="section1">
          <div className="test-border">sec1</div>
          <div className="test-border">sec1</div>
          <div className="test-border">sec1</div>
        </div>
        <div className="test-border">sec2</div>
        <div className="section2">
          <div className="test-border sec3-1">sec3</div>
          <div className="test-border sec3-2">sec3</div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
