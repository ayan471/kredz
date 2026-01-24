"use client";

import { ShieldCheck, Clock, Percent, ArrowRight } from "lucide-react";

import { motion } from "framer-motion";
import { StepsCard } from "../HomePage/steps-card";
import { StatsGrid } from "../HomePage/stats-grid";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-blue-100 py-16 md:py-24 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-blue-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width="200"
              height="200"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth="0"
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium mb-6">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-blue-400/40 animate-ping"
                  style={{ animationDuration: "1.8s" }}
                />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
              Same‑day decisions. No hidden fees.
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900">
                Smarter loans with clarity and control
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Borrow with confidence at competitive fixed rates. Check your
              offer in minutes without impacting your credit score.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
              {/* <a
                href="/consultancy-application"
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl text-white transform hover:scale-105 inline-flex items-center"
              >
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
              </a> */}
              <a
                href="/credit-builder-plan"
                className="text-lg px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center"
              >
                Credit Builder Plan
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Soft Credit Check",
                  desc: "No impact on your score",
                },
                {
                  icon: Clock,
                  title: "24–48h Funding",
                  desc: "Quick and reliable",
                },
                {
                  icon: Percent,
                  title: "Fixed APR",
                  desc: "Transparent rates",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                >
                  <item.icon className="w-10 h-10 text-blue-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="text-sm text-slate-700">
                Starting APR from
                <span className="font-semibold text-slate-900"> 7.49%</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="text-sm text-slate-700">
                Max loan
                <span className="font-semibold text-slate-900"> ₹50,000</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 relative w-full max-w-md mx-auto lg:max-w-none mt-12 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <StepsCard />
            </div>
          </motion.div>
        </div>

        <StatsGrid />
      </div>
    </section>
  );
}
