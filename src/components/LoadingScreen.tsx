"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Clock, Percent, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: ShieldCheck, label: "Verifying Identity" },
  { icon: Clock, label: "Checking History" },
  { icon: Percent, label: "Analyzing Rates" },
  { icon: CheckCircle2, label: "Ready" },
];

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Handle Progress and Step Switching
  useEffect(() => {
    const duration = 4000; // 4 seconds total load time
    const intervalTime = 40;
    const stepsCount = duration / intervalTime;
    const increment = 100 / stepsCount;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    // Switch icons based on progress milestones
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, duration / steps.length);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  // Calculate circumference for SVG circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-100">
      {/* --- Background Texture (Subtle Grid) --- */}
      <div className="absolute inset-0 z-0">
        <svg
          className="h-full w-full stroke-blue-100/60 [mask-image:radial-gradient(40rem_40rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid-pattern-new"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
              x="50%"
              y="-1"
            >
              <path d="M.5 60V.5H60" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth="0"
            fill="url(#grid-pattern-new)"
          />
        </svg>
      </div>

      {/* --- Main Loader --- */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Circular Progress Container */}
        <div className="relative flex items-center justify-center w-48 h-48 mb-8">
          {/* 1. Pulsing Background Rings */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-blue-400 rounded-full blur-2xl"
          />
          <div className="absolute inset-0 border border-blue-100 rounded-full" />

          {/* 2. SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            {/* Track */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-blue-100"
            />
            {/* Progress Indicator */}
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.1, ease: "linear" }}
              cx="96"
              cy="96"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
              className="text-blue-600 drop-shadow-lg"
            />
          </svg>

          {/* 3. Central Icon & Percentage */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative h-10 w-10 mb-2 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotateX: 90 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  <CurrentIcon className="w-8 h-8 text-blue-600" />
                </motion.div>
              </AnimatePresence>
            </div>

            <span className="text-2xl font-bold text-slate-800 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* --- Text Content --- */}
        <div className="text-center space-y-2 h-16">
          <motion.h2
            className="text-3xl font-extrabold text-blue-900 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Kredz<span className="text-blue-600">.in</span>
          </motion.h2>

          <div className="relative h-6 w-64 mx-auto overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 text-sm font-medium text-slate-500 uppercase tracking-wide"
              >
                {steps[currentStep].label}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Legal/Security Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-blue-100/50"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-slate-600">
          256-bit Secure Encryption
        </span>
      </motion.div>
    </div>
  );
}
