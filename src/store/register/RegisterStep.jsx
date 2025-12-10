import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Agreement from "./Agreement";
import MemberInfo from "./MemberInfo";
import StoreInfo from "./StoreInfo";
import BizInfo from "./BizInfo";
import FileInfo from "./FileInfo";

const RegisterStep = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // 동의
        agreed: false,
        // 회원정보
        loginId: "",
        password: "",
        email: "",
        // 가게정보
        storeNm: "",
        storeTelNo: "",
        storeZipCode: "",
        storeAddr: "",
        storeAddrDetail: "",
        storeOpenTime: "",
        storeCloseTime: "",
        storeOpenDate: [],
        // 사업자정보
        bankId: "",
        ownerNm: "",
        ownerTelNo: "",
        bizNm: "",
        bizType: "",
        bizRegDate: "",
        bizNo: "",
        storeAccNo: "",
        storeType: "",
        // 파일
        bzFile: null,
        storeImgFile: null,
    });

    const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
    
    const handleSubmitComplete = () => {
        // 회원가입 완료 후 로그인 페이지로 리다이렉트
        navigate('/store/login');
    };

    return (
        <div className="registerstep-container">
            {step === 1 && <Agreement formData={formData} setFormData={setFormData} next={nextStep} />}
            {step === 2 && <MemberInfo formData={formData} setFormData={setFormData} next={nextStep} prev={prevStep} />}
            {step === 3 && <StoreInfo formData={formData} setFormData={setFormData} next={nextStep} prev={prevStep} />}
            {step === 4 && <BizInfo formData={formData} setFormData={setFormData} next={nextStep} prev={prevStep} />}
            {step === 5 && <FileInfo formData={formData} setFormData={setFormData} prev={prevStep} onSubmit={handleSubmitComplete} />}
        </div>
    );
};

export default RegisterStep;