"use client";

import FAQ from "@/components/custom/FAQ";
import { motion } from "framer-motion";

const floatingBubbles = Array(20).fill(null);

export default function FAQPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {floatingBubbles.map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-orange-300 opacity-20"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-20 px-4 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Need Help?</h1>
        <p className="text-xl md:text-2xl">
          We've got answers to your questions
        </p>
      </motion.div>
      <FAQ />
    </main>
  );
}
