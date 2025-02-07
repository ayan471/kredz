"use client";

import type React from "react";
import { CheckCircle, Circle } from "lucide-react";

const LoanApplicationStep2Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">
              Consultancy Application
            </h1>
            <span className="text-orange-200 text-lg sm:text-xl font-semibold">
              Step 2 of 3
            </span>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span>Personal Info</span>
            </div>
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm mr-2">
                2
              </div>
              <span className="font-semibold">Financial Details</span>
            </div>
            <div className="flex items-center text-orange-200">
              <Circle className="h-5 w-5 mr-2" />
              <span>Review</span>
            </div>
          </div>

          <div className="w-full bg-blue-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-orange-500 rounded-full h-2 animate-progress-bar"
              style={{ width: "66.66%" }}
            />
          </div>

          <p className="text-center text-sm sm:text-base text-orange-100">
            Please provide your financial information for a tailored loan offer.
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0;
          }
          100% {
            width: 66.66%;
          }
        }
        .animate-progress-bar {
          animation: progress 1.5s ease-out 0.3s forwards;
          width: 0;
        }
      `}</style>
    </div>
  );
};

export default LoanApplicationStep2Hero;
