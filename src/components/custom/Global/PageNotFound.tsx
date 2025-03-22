"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FinancialIcon } from "@/components/FinancialIcon";
import { FinancialIconsBackground } from "@/components/FinancialIconsBackground";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          router.push("/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      <FinancialIconsBackground />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <FinancialIcon />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-6xl md:text-8xl font-bold mb-4 text-orange-500"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-2xl md:text-3xl mb-8 text-gray-300"
        >
          Page Not Found
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center max-w-md z-10"
      >
        <p className="mb-6 text-gray-400">
          We couldn't find the page you're looking for. It might have been
          moved, deleted, or never existed.
        </p>
        <p className="mb-8 text-sm text-gray-500">
          Redirecting to the dashboard in {countdown} seconds...
        </p>
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white w-full md:w-auto"
        >
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </motion.div>
    </div>
  );
}
