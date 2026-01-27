import "./css/stepbutton.css";

const StepButton = ({ step, prev, next, onSubmit, isLoading }) => {
  const isFirst = step === 1;
  const isLast = step === 5;

  return (
    <div className="step-navigation">
      <button 
        type="button" 
        onClick={prev} 
        disabled={isFirst || isLoading}
        className={!isFirst && !isLoading ? "step-prev-btn" : "step-prev-btn disabled"}
      >
        이전
      </button>

      <button 
        type="button" 
        onClick={isLast ? onSubmit : next}
        disabled={isLoading}
        className={!isLoading ? "step-next-btn" : "step-next-btn disabled"}
      >
        {isLoading ? (
          <span className="button-loading">
            <span className="spinner"></span>
            {isLast ? "처리 중..." : "처리 중..."}
          </span>
        ) : (
          isLast ? "가입 완료" : "다음"
        )}
      </button>
    </div>
  );
};

export default StepButton;