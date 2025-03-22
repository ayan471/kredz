import { motion } from "framer-motion";

const icons = [
  { icon: "💰", delay: 0 },
  { icon: "💳", delay: 0.2 },
  { icon: "📊", delay: 0.4 },
  { icon: "📈", delay: 0.6 },
  { icon: "🏦", delay: 0.8 },
  { icon: "💹", delay: 1 },
  { icon: "🪙", delay: 1.2 },
  { icon: "📑", delay: 1.4 },
];

export function FinancialIconsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-10"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: item.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: 2,
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
}
