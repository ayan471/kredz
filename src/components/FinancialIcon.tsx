import { motion } from "framer-motion";

export function FinancialIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-24 h-24 text-orange-500"
      initial={{ rotate: -90 }}
      animate={{ rotate: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.rect
        x="2"
        y="7"
        width="20"
        height="14"
        rx="2"
        ry="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.line
        x1="2"
        y1="11"
        x2="22"
        y2="11"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      />
      <motion.line
        x1="12"
        y1="7"
        x2="12"
        y2="21"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      />
      <motion.path
        d="M6 10v4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 1.4 }}
      />
      <motion.path
        d="M10 10v4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 1.5 }}
      />
      <motion.path
        d="M14 10v4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 1.6 }}
      />
      <motion.path
        d="M18 10v4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 1.7 }}
      />
      <motion.circle
        cx="12"
        cy="5"
        r="1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.8 }}
      />
    </motion.svg>
  );
}
