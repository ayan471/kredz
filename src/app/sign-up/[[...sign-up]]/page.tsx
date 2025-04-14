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
} from "lucide-react";

const features = [
  { icon: Shield, text: "Bank-grade security" },
  { icon: TrendingUp, text: "Smart credit decisions" },
  { icon: CreditCard, text: "Instant approvals" },
];

const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "₹50Cr+", label: "Credit Disbursed" },
  { number: "4.9", label: "App Rating" },
];

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect_url");

  // Store the redirect URL in localStorage when the component mounts
  useEffect(() => {
    if (redirectUrl) {
      localStorage.setItem("redirectAfterAuth", redirectUrl);
    }
  }, [redirectUrl]);

  // Handle successful sign-up
  const handleSignUpComplete = () => {
    const storedRedirectUrl = localStorage.getItem("redirectAfterAuth");
    if (storedRedirectUrl) {
      localStorage.removeItem("redirectAfterAuth");
      router.push(storedRedirectUrl);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white p-12 flex-col relative overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotate: 15, y: 100 }}
              animate={{ opacity: 0.1, rotate: 15, y: 0 }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="absolute h-[200%] w-1 bg-orange-500/20"
              style={{
                left: `${i * 15}%`,
                top: "-50%",
              }}
            />
          ))}
        </div>

        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 rounded-full bg-orange-500/5"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                scale: 0.5,
              }}
              animate={{
                x: Math.random() * 200,
                y: Math.random() * 200,
                scale: 1,
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Logo Section */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-4 flex items-center gap-2"
          >
            <Sparkles className="w-12 h-12 text-orange-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
              Kredz
            </span>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl font-bold mb-6">Welcome to Kredz! 👋</h1>
            <p className="text-xl text-gray-300 mb-12 max-w-md">
              Access your financial dashboard and unlock a world of credit
              possibilities tailored just for you.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="flex items-center gap-4 bg-blue-900/30 rounded-lg p-4 hover:bg-blue-900/40 transition-colors"
              >
                <feature.icon className="w-6 h-6 text-orange-500" />
                <span className="text-gray-200">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>RBI Registered NBFC</span>
            <div className="mx-2">•</div>
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Trusted by 10,000+ customers</span>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-auto relative z-10 text-gray-400 text-sm flex items-center justify-between"
        >
          <span>
            © {new Date().getFullYear()} Kredz Finance. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Online now: 234</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8"
      >
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="flex justify-center mb-6 lg:hidden">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-10 h-10 text-orange-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
                Kredz
              </span>
            </motion.div>
          </div>
          <SignUp
            redirectUrl={redirectUrl || "/"}
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-orange-500 hover:bg-orange-600 transition-colors",
                footerActionLink: "text-orange-500 hover:text-orange-600",
                formFieldInput:
                  "border-gray-300 focus:border-orange-500 focus:ring-orange-500",
                formFieldLabel: "text-gray-700",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                card: "shadow-none w-full",
                footer: "text-gray-600",
                rootBox: "w-full",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
            }}
            signInUrl="/sign-in"
          />
        </div>
      </motion.div>
    </div>
  );
}
