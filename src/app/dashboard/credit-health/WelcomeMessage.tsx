"use client";

import { motion } from "framer-motion";

interface WelcomeMessageProps {
  userName: string | null | undefined;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userName }) => {
  const displayName = userName || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative inline-block"
    >
      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400 to-emerald-400 opacity-50 blur-lg"></span>
      <h2 className="relative text-3xl font-bold text-white">
        Welcome back,{" "}
        <motion.span
          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
          {displayName}
        </motion.span>
      </h2>
    </motion.div>
  );
};

export default WelcomeMessage;
