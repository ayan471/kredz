"use client";

import { motion } from "framer-motion";

export default function BackgroundElements() {
  return (
    <>
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
        animate={{
          x: [0, 30, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
        animate={{
          x: [0, -30, 0],
          y: [0, 60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </>
  );
}
