"use client";

import InnerHeroOne from "@/components/custom/Global/InnerHeroOne";
import CbStepOne from "@/components/custom/Services/CreditBuilder/CbStepOne";
import CbStepTwo from "@/components/custom/Services/CreditBuilder/CbStepTwo";
import { useState } from "react";

const CreditBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepOneComplete = () => {
    setCurrentStep(2);
  };

  return (
    <div>
      <InnerHeroOne
        bgImgUrl="/global/banners/orange-gradient.jpg"
        title="Credit Builder"
        subtitle="We will help you to build your credit score!"
        ctaText=""
      />

      <div className="flex flex-col justify-center items-center xl:flex-row">
        <div className="flex flex-1 mx-auto py-4 px-[20px] max-w-[620px] mt-8">
          {currentStep === 1 ? <CbStepOne /> : <CbStepTwo />}
        </div>
      </div>
    </div>
  );
};

export default CreditBuilder;
