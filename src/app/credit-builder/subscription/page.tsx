"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import CbStepTwo from "@/components/custom/Services/CreditBuilder/CbStepTwo";
import {
  TrendingUp,
  Shield,
  CreditCard,
  ChevronRight,
  Check,
} from "lucide-react";

const CreditBuilderSubscription = () => {
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      text: "Boost Your Credit Score",
    },
    { icon: <Shield className="w-8 h-8" />, text: "Secure Financial Future" },
    { icon: <CreditCard className="w-8 h-8" />, text: "Unlock Better Rates" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 w-full h-full"
          >
            <path d="M0,0 L100,0 L100,100 Z" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 py-20 sm:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                Build Your <span className="text-yellow-300">Credit</span>{" "}
                Future
              </h1>
              <p className="text-xl text-orange-100 mb-10">
                Choose your plan and start your journey to financial success
                today!
              </p>
              <div className="hidden sm:grid sm:grid-cols-3 gap-6 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ease-in-out"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                    onHoverStart={() => setHoveredBenefit(index)}
                    onHoverEnd={() => setHoveredBenefit(null)}
                  >
                    <div className="text-yellow-300 mb-4">{benefit.icon}</div>
                    <h3 className="text-white font-semibold">{benefit.text}</h3>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="bg-yellow-400 text-orange-900 font-bold py-4 px-8 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105 hover:bg-yellow-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
                <ChevronRight className="ml-2 w-5 h-5" />
              </motion.button>
            </motion.div>
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl transform rotate-3 scale-105"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                  <h3 className="text-2xl font-bold text-orange-600 mb-6">
                    Your Credit Journey
                  </h3>
                  {[
                    "Assessment",
                    "Personalized Plan",
                    "Regular Monitoring",
                    "Credit Improvement",
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="bg-orange-100 rounded-full p-2 mr-4">
                        <Check className="w-6 h-6 text-orange-500" />
                      </div>
                      <span className="text-gray-700 font-medium">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <CbStepTwo />
      </div>
    </div>
  );
};

export default CreditBuilderSubscription;
