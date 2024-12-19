import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

const LoanApplicationStep2Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white overflow-hidden">
      <div className="absolute inset-0">
        <svg
          className="absolute left-0 bottom-0 h-64 w-64 text-orange-800 opacity-20 transform -translate-x-1/3 translate-y-1/3"
          fill="currentColor"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M100 100 L0 100 L0 0 Z" />
        </svg>
      </div>
      <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block">Consultancy Application</span>
              <span className="block text-orange-200 mt-2">Step 2 of 3</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-orange-100">
              You're making great progress! Let's gather some additional
              information to tailor the perfect loan for you.
            </p>
          </div>
        </div>
      </div>
      <div className="relative bg-orange-800 bg-opacity-75 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
              <span className="text-lg font-medium">Step 1 Completed</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-medium mr-3">Current Step</span>
              <div className="bg-white text-orange-600 rounded-full h-8 w-8 flex items-center justify-center font-bold">
                2
              </div>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-lg font-medium mr-3">
                Next: Final Review
              </span>
              <ArrowRight className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationStep2Hero;
