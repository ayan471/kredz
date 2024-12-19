import React from "react";
import { CheckCircle, Star, ArrowRight } from "lucide-react";

const LoanApplicationStep3Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-600 to-orange-400 text-white overflow-hidden">
      <div className="absolute inset-0">
        <svg
          className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2"
          width="404"
          height="404"
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                className="text-orange-500"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="404"
            height="404"
            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
          />
        </svg>
      </div>
      <div className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Consultancy Application</span>
              <span className="block text-orange-200 mt-2">
                Get more with our membership plans
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-orange-100">
              Unlock exclusive benefits and enhance your loan experience with
              our premium membership options.
            </p>
            <div className="mt-10 flex justify-center items-center space-x-6">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-lg">Step 1 & 2 Complete</span>
              </div>
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="text-lg">Final Step</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 border-t border-orange-300">
            <div className="flex items-center">
              <span className="text-lg font-medium mr-2">Progress:</span>
              <div className="bg-orange-200 rounded-full h-2 w-32">
                <div className="bg-white rounded-full h-2 w-24" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-medium mr-2">Next:</span>
              <span className="text-lg">Review & Submit</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationStep3Hero;
