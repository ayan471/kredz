"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-20 text-center bg-gradient-to-r from-orange-100 to-blue-100 rounded-lg shadow-xl p-8 border border-orange-200"
    >
      <h2 className="text-3xl font-bold text-blue-900 mb-4">
        Get Started Today
      </h2>
      <p className="text-lg text-blue-800 mb-8 max-w-2xl mx-auto">
        Take the first step toward improving your financial future with Kredz.
        We're here to help with personalized solutions tailored to your needs.
      </p>
      <Button
        asChild
        className="bg-gradient-to-r from-orange-500 to-blue-900 hover:from-orange-600 hover:to-blue-800 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <Link href="/contact">Contact Us Now</Link>
      </Button>
    </motion.div>
  );
}
