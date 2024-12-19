import React from "react";

import LaStepTwo from "@/components/custom/Services/LoanApplication/LaStepTwo";
import LoanApplicationStep2Hero from "@/components/custom/LoanApplicationStep2Hero";

const LoanApplicationStep2 = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoanApplicationStep2Hero />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Complete Your Application
            </h2>
            <LaStepTwo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationStep2;
