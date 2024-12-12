"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CreditFactorCardProps {
  factor: {
    name: string;
    score: number;
  };
}

const CreditFactorCard: React.FC<CreditFactorCardProps> = ({ factor }) => {
  const getScoreColor = (score: number) => {
    if (score < 620) return "#ef4444";
    if (score < 680) return "#f97316";
    if (score < 740) return "#facc15";
    return "#22c55e";
  };

  const scoreColor = getScoreColor(factor.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-700 rounded-lg p-4 flex items-center justify-between"
    >
      <div>
        <h3 className="text-sm font-medium text-slate-300">{factor.name}</h3>
        <p className="text-2xl font-bold" style={{ color: scoreColor }}>
          {factor.score}%
        </p>
      </div>
      <div className="flex items-center">
        {factor.score >= 680 ? (
          <ArrowUpRight className="w-6 h-6 text-emerald-400" />
        ) : (
          <ArrowDownRight className="w-6 h-6 text-red-400" />
        )}
      </div>
    </motion.div>
  );
};

export default CreditFactorCard;
