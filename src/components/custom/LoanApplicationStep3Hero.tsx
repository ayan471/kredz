"use client";

import type React from "react";
import { CheckCircle, Star, ArrowRight } from "lucide-react";

const LoanApplicationStep3Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-400 text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Consultancy Application
            </h1>
            <span className="text-orange-200 text-lg sm:text-xl font-semibold">
              Step 3 of 3
            </span>
          </div>

          <p className="text-center text-sm sm:text-base text-orange-100">
            Unlock exclusive benefits with our premium membership options.
          </p>

          <div className="flex items-center justify-between text-sm sm:text-base">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span>Steps 1 & 2</span>
            </div>
            <div className="flex items-center">
              <div className="bg-yellow-400 text-orange-600 rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm mr-2">
                <Star className="h-4 w-4" />
              </div>
              <span className="font-semibold">Membership</span>
            </div>
            <div className="flex items-center text-orange-200">
              <ArrowRight className="h-5 w-5 mr-2" />
              <span>Review & Submit</span>
            </div>
          </div>

          <div className="w-full bg-orange-300 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white rounded-full h-2 animate-progress-bar"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
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

export default LoanApplicationStep3Hero;
