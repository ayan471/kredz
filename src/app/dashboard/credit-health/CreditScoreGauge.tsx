import React from "react";
import { motion } from "framer-motion";

interface CreditScoreGaugeProps {
  score: number;
  poweredBy: string;
}

const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({
  score,
  poweredBy,
}) => {
  const getScoreColor = (score: number) => {
    if (score < 620) return "#ef4444";
    if (score < 680) return "#f97316";
    if (score < 740) return "#facc15";
    return "#22c55e";
  };

  const getScoreCategory = (score: number) => {
    if (score < 620) return "Poor";
    if (score < 680) return "Fair";
    if (score < 740) return "Good";
    return "Excellent";
  };

  const scoreColor = getScoreColor(score);
  const scoreCategory = getScoreCategory(score);
  const percentage = (score / 900) * 100;

  return (
    <div className="relative w-full h-full">
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full border-[16px] border-slate-700" />

      {/* Colored arc */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={scoreColor}
          strokeWidth="16"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percentage / 100 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            rotate: -90,
            transformOrigin: "center",
          }}
        />
      </svg>

      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.div
          className="text-4xl font-bold text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.div>
        <motion.div
          className="text-sm font-medium"
          style={{ color: scoreColor }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {scoreCategory}
        </motion.div>
        <motion.div
          className="text-xs text-slate-400 mt-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          300-900
        </motion.div>
        <motion.div
          className="text-[10px] text-slate-500 mt-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          Powered by {poweredBy}
        </motion.div>
      </div>
    </div>
  );
};

export default CreditScoreGauge;
