import { useState } from "react";
import Step1Setup from "../components/Step1Setup";
import Step2Interview from "../components/Step2Interview";
import Step3Report from "../components/Step3Report";
import Navbar from "../components/Navbar";
import AuthModel from "../components/AuthModel";

const Interview = () => {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);
  const [showAuth, setShowAuth] = useState(false);  

  return (
    <div className="min-h-screen bg-slate-950 text-white ">
      <Navbar openAuth={() => setShowAuth(true)} />

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

      <div className="relative px-6 pt-24 pb-6">
        {step === 1 && (
          <Step1Setup
            onStart={(data) => {
              setInterviewData(data);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <Step2Interview
            interviewData={interviewData}
            onFinish={(report) => {
              setInterviewData(report);
              setStep(3);
            }}
          />
        )}

        {step === 3 && <Step3Report report={interviewData} />}
      </div>
    </div>
  );
};

export default Interview;
