import React from "react";

import LaStepOne from "@/components/custom/Services/LoanApplication/LaStepOne";
import LoanApplicationHero from "@/components/custom/LoanApplicationHero";
import { StepwiseLoanApplication } from "@/components/custom/Services/LoanApplication/StepwiseLoanApplication";

const LoanApplication = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoanApplicationHero />
      <div className="container mx-auto px-4 py-12">
        <LaStepOne />
      </div>
    </div>
  );
};

export default LoanApplication;
