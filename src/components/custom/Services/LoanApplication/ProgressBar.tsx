import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              i <= currentStep
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {i + 1}
          </motion.div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>
    </div>
  );
};
