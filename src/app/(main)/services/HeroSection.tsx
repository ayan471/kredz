"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 px-4"
    >
      <div className="container mx-auto text-center">
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Kredz Services Overview
        </motion.h1>
        <motion.p
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
        >
          Take control of your financial journey with our comprehensive suite of
          services.
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href={"#services"}
            className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Explore Our Services
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
