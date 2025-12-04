"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Sparkles,
  Shield,
  TrendingUp,
  CreditCard,
  Users,
  CheckCircle,
  Star,
  Zap,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    text: "Bank-grade security",
    description: "256-bit encryption",
  },
  {
    icon: TrendingUp,
    text: "Smart credit decisions",
    description: "AI-powered analysis",
  },
  {
    icon: CreditCard,
    text: "Instant approvals",
    description: "Get approved in minutes",
  },
];

const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "₹50Cr+", label: "Credit Disbursed" },
  { number: "4.9", label: "App Rating" },
];

const benefits = [
  "No hidden fees",
  "24/7 customer support",
  "Flexible repayment options",
];

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect_url");

  useEffect(() => {
    if (redirectUrl) {
      localStorage.setItem("redirectAfterAuth", redirectUrl);
    }
  }, [redirectUrl]);

  const handleSignUpComplete = () => {
    const storedRedirectUrl = localStorage.getItem("redirectAfterAuth");
    if (storedRedirectUrl) {
      localStorage.removeItem("redirectAfterAuth");
      router.push(storedRedirectUrl);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Section - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white p-12 flex-col relative overflow-hidden"
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/40 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-to-tl from-blue-300/30 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid-signup"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-signup)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Sparkles className="w-8 h-8 text-blue-200" />
            </div>
            <span className="text-2xl font-bold text-white">Kredz</span>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-10"
          >
            <h1 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              Start Your Financial
              <span className="block text-blue-200">Journey Today</span>
            </h1>
            <p className="text-lg text-blue-100/80 max-w-md leading-relaxed">
              Join thousands of users who trust Kredz for their credit needs.
              Quick setup, instant access.
            </p>
          </motion.div>

          {/* Features */}
          <div className="space-y-4 mb-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className="group flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className="p-2.5 bg-blue-500/30 rounded-xl group-hover:bg-blue-400/40 transition-colors">
                  <feature.icon className="w-5 h-5 text-blue-100" />
                </div>
                <div className="flex-1">
                  <span className="text-white font-medium">{feature.text}</span>
                  <p className="text-blue-200/60 text-sm">
                    {feature.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-300/50 group-hover:text-blue-200 group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>

          {/* Benefits pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {benefits.map((benefit, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-sm text-blue-100 border border-blue-400/20"
              >
                <Zap className="w-3 h-3" />
                {benefit}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-blue-200/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex items-center gap-4 text-sm text-blue-200/70"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>RBI Registered</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-blue-400/50" />
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              <span>10K+ trust us</span>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-auto pt-8 text-blue-200/50 text-sm flex items-center justify-between"
          >
            <span>© {new Date().getFullYear()} Kredz Finance</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Users className="w-4 h-4" />
              <span>234 online</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Sign Up Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/50 flex flex-col items-center justify-center px-4 py-10 sm:px-6 md:px-8 relative"
      >
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex justify-center mb-8 lg:hidden"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-900">Kredz</span>
            </div>
          </motion.div>

          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-500">
              Already have an account?{" "}
              <a
                href="/sign-in"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign in
              </a>
            </p>
          </motion.div>

          {/* Clerk SignUp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SignUp
              redirectUrl={redirectUrl || "/"}
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40",
                  footerActionLink:
                    "text-blue-600 hover:text-blue-700 font-medium",
                  formFieldInput:
                    "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200",
                  formFieldLabel: "text-gray-700 font-medium",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  card: "shadow-none w-full bg-transparent",
                  footer: "text-gray-500",
                  rootBox: "w-full",
                  socialButtonsBlockButton:
                    "border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 rounded-xl",
                  socialButtonsBlockButtonText: "text-gray-700 font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-400",
                  formFieldInputShowPasswordButton:
                    "text-gray-400 hover:text-gray-600",
                  identityPreviewEditButton:
                    "text-blue-600 hover:text-blue-700",
                  formResendCodeLink: "text-blue-600 hover:text-blue-700",
                },
                layout: {
                  socialButtonsPlacement: "bottom",
                  socialButtonsVariant: "blockButton",
                },
              }}
              signInUrl="/sign-in"
            />
          </motion.div>

          {/* Mobile Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 lg:hidden"
          >
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100"
                >
                  <div className="text-lg font-bold text-blue-600">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mobile Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex justify-center items-center gap-4 text-xs text-gray-500 lg:hidden"
          >
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>RBI Registered</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Secure</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
