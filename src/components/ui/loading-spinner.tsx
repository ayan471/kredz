import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <motion.div
      className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  );
}
