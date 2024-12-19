import React from "react";

import LaStepThree from "@/components/custom/Services/LoanApplication/LaStepThree";
import LoanApplicationStep3Hero from "@/components/custom/LoanApplicationStep3Hero";

const LoanApplication = () => {
  return (
    <div>
      <LoanApplicationStep3Hero />
      <div className="flex flex-col justify-center items-center xl:flex-row">
        <div className="flex flex-1 mx-auto py-4 px-[20px] max-w-[620px] mt-8">
          <LaStepThree />
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
