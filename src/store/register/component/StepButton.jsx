import "./css/stepbutton.css";

const StepButton = ({ step, prev, next, onSubmit }) => {
  const isFirst = step === 1;
  const isLast = step === 5;

  return (
    <div className="step-navigation">
      <button 
        type="button" 
        onClick={prev} 
        disabled={isFirst}
        className={!isFirst ? "step-prev-btn" : "step-prev-btn disabled"}
      >
        이전
      </button>

      <button 
        type="button" 
        onClick={isLast ? onSubmit : next}
        className="step-next-btn"
      >
        {isLast ? "가입 완료" : "다음"}
      </button>
    </div>
  );
};

export default StepButton;