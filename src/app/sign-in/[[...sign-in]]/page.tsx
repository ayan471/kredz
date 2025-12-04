"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Sparkles,
  Shield,
  TrendingUp,
  CreditCard,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Shield, text: "Bank-grade security", desc: "256-bit encryption" },
  {
    icon: TrendingUp,
    text: "Smart credit decisions",
    desc: "AI-powered insights",
  },
  { icon: CreditCard, text: "Instant approvals", desc: "Get funded in 24-48h" },
];

const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "₹50Cr+", label: "Credit Disbursed" },
  { number: "4.9", label: "App Rating", icon: Star },
];

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Section - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white p-12 flex-col relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute left-0 top-0 h-full w-full opacity-10"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Floating Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Kredz</span>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1"
          >
            <h1 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              Welcome back to
              <br />
              <span className="text-blue-200">smarter lending</span>
            </h1>
            <p className="text-lg text-blue-100/80 mb-10 max-w-md leading-relaxed">
              Access your financial dashboard and unlock credit possibilities
              tailored for you.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <span className="font-medium text-white">
                      {feature.text}
                    </span>
                    <p className="text-sm text-blue-200/70">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-4"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                    {stat.number}
                    {stat.icon && (
                      <stat.icon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  <div className="text-sm text-blue-200/70 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-4 text-sm text-blue-200/70 pt-8 border-t border-white/10"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>RBI Registered NBFC</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-300" />
              <span>256-bit SSL Secured</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Sign In Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 bg-gradient-to-b from-blue-50 via-white to-blue-50 flex flex-col min-h-screen lg:min-h-0"
      >
        {/* Background Pattern for Right Side */}
        <div className="absolute inset-0 lg:left-1/2 overflow-hidden pointer-events-none">
          <svg
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-blue-100 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="signin-pattern"
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
              fill="url(#signin-pattern)"
            />
          </svg>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
          {/* Mobile Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex items-center gap-3 mb-8 lg:hidden"
          >
            <div className="p-2 bg-blue-600 rounded-xl">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-900">Kredz</span>
          </motion.div>

          {/* Sign In Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 lg:hidden"
          >
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </motion.div>

          {/* Clerk Sign In */}
          <div className="w-full max-w-sm">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-xl shadow-blue-900/5 border border-blue-100 rounded-2xl w-full bg-white/80 backdrop-blur-sm",
                  headerTitle: "text-2xl font-bold text-blue-900",
                  headerSubtitle: "text-gray-600",
                  formButtonPrimary:
                    "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 rounded-xl text-base font-medium py-3",
                  formFieldInput:
                    "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white",
                  formFieldLabel: "text-gray-700 font-medium",
                  footerActionLink:
                    "text-blue-600 hover:text-blue-700 font-medium",
                  socialButtonsBlockButton:
                    "border-blue-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-200",
                  socialButtonsBlockButtonText: "text-gray-700 font-medium",
                  dividerLine: "bg-blue-100",
                  dividerText: "text-gray-500",
                  formFieldInputShowPasswordButton:
                    "text-gray-500 hover:text-blue-600",
                  identityPreviewEditButton:
                    "text-blue-600 hover:text-blue-700",
                  footer: "hidden",
                },
                layout: {
                  socialButtonsPlacement: "bottom",
                  socialButtonsVariant: "blockButton",
                },
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline underline-offset-2"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Mobile Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-3 mt-8 lg:hidden w-full max-w-sm"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-3 rounded-xl bg-white border border-blue-100 shadow-sm"
              >
                <div className="text-lg font-bold text-blue-700 flex items-center justify-center gap-1">
                  {stat.number}
                  {stat.icon && (
                    <stat.icon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Mobile Trust Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500 lg:hidden"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Secured by 256-bit SSL encryption</span>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="py-6 px-6 text-center text-sm text-gray-500 border-t border-blue-100 relative z-10"
        >
          <p>
            © {new Date().getFullYear()} Kredz Finance. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
