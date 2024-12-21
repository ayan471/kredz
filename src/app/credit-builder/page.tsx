"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import CbStepOne from "@/components/custom/Services/CreditBuilder/CbStepOne";
import CbStepTwo from "@/components/custom/Services/CreditBuilder/CbStepTwo";
import {
  TrendingUp,
  Shield,
  Clock,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CreditBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    { icon: <TrendingUp className="w-6 h-6" />, title: "Boost Your Score" },
    { icon: <Shield className="w-6 h-6" />, title: "Secure Future" },
    { icon: <Clock className="w-6 h-6" />, title: "Quick Results" },
  ];

  const creditJourneySteps = [
    { title: "Sign Up", description: "Create your Kredz account" },
    { title: "Assessment", description: "We analyze your credit profile" },
    {
      title: "Custom Plan",
      description: "Receive a tailored improvement strategy",
    },
    { title: "Take Action", description: "Follow our expert recommendations" },
    { title: "Monitor Progress", description: "Track your score improvements" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500 opacity-10 transform -skew-y-6"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Build Your <span className="text-orange-500">Credit Score</span>{" "}
                with Confidence
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We will help you improve your credit score and secure a better
                financial future.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-white rounded-full px-4 py-2 shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.5 }}
                  >
                    <span className="text-orange-500 mr-2">{feature.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {feature.title}
                    </span>
                  </motion.div>
                ))}
              </div>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                onClick={scrollToForm}
              >
                Start Your Journey
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="bg-white rounded-lg shadow-2xl p-6 relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Your Credit Journey
                </h3>
                <div className="space-y-4">
                  {creditJourneySteps.map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-semibold text-gray-700">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-orange-300 rounded-lg transform rotate-3 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </div>

      <div
        ref={formRef}
        className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {currentStep === 1
                ? "Start Your Credit Journey"
                : "Choose Your Plan"}
            </h2>
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-16 h-1 ${
                    currentStep >= 2 ? "bg-orange-500" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
              </div>
            </div>
            {currentStep === 1 ? <CbStepOne /> : <CbStepTwo />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditBuilder;
