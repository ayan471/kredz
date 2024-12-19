import React from "react";

import LaStepOne from "@/components/custom/Services/LoanApplication/LaStepOne";
import LoanApplicationHero from "@/components/custom/LoanApplicationHero";

const LoanApplication = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoanApplicationHero />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <LaStepOne />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
