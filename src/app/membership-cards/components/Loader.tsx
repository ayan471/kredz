import type React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        className="relative w-32 h-32"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border-t-4 border-b-4 border-orange-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        ></motion.span>
        <motion.span
          className="absolute inset-2 rounded-full border-t-4 border-b-4 border-pink-500"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        ></motion.span>
        <motion.span
          className="absolute inset-4 rounded-full border-t-4 border-b-4 border-purple-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        ></motion.span>
      </motion.div>
      <motion.p
        className="mt-8 text-xl font-semibold text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Loading membership options...
      </motion.p>
    </div>
  );
};

export default Loader;
