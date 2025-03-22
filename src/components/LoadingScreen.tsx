"use client";

import { motion } from "framer-motion";
import { DollarSign, CreditCard, PieChart, TrendingUp } from "lucide-react";

const icons = [
  { Icon: DollarSign, delay: 0 },
  { Icon: CreditCard, delay: 0.2 },
  { Icon: PieChart, delay: 0.4 },
  { Icon: TrendingUp, delay: 0.6 },
];

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-950 to-blue-900 flex flex-col items-center justify-center z-50">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            {icons.map(({ Icon, delay }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.5 }}
                className="mx-2"
              >
                <Icon className="w-12 h-12 text-orange-500" />
              </motion.div>
            ))}
          </div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Kredz Finance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-xl text-orange-300 mb-8"
          >
            Empowering Your Financial Future
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 2, ease: "easeInOut" }}
          className="h-1 bg-orange-500 rounded-full max-w-md mx-auto"
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-0 right-0 text-center text-gray-400 text-sm"
      >
        Loading your personalized experience...
      </motion.div>
    </div>
  );
}
