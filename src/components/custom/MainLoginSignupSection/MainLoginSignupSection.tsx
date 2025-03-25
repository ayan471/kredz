"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, TrendingUp, Shield, DollarSign } from "lucide-react";

const MainLoginSignupSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <section className="bg-gradient-to-b from-orange-50 via-white to-blue-50 py-16 md:py-24 overflow-hidden relative">
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-900">
                Apka Apne Financial Buddy
              </span>{" "}
              <p className="md:text-6xl text-4xl mt-3">
                Kredz is here for all your financial needs!
              </p>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Empowering your financial journey with tailored solutions and
              expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              {isLoggedIn ? (
                <>
                  <Link href="">
                    <Button className="text-lg px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl text-white transform hover:scale-105">
                      Apply Now
                    </Button>
                  </Link>
                  <Link href="/credit-builder-plan">
                    <Button className="text-lg px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl text-white transform hover:scale-105">
                      Credit Builder
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button className="text-lg px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl text-white transform hover:scale-105">
                      Apply Now
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="text-lg px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl text-white transform hover:scale-105">
                      Credit Builder
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CreditCard className="w-10 h-10 text-orange-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Easy Applications
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quick and hassle-free process
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <TrendingUp className="w-10 h-10 text-orange-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Boost Your Credit
                  </h3>
                  <p className="text-sm text-gray-600">
                    Improve your financial health
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Shield className="w-10 h-10 text-orange-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Secure & Trusted
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your data is safe with us
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <DollarSign className="w-10 h-10 text-orange-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Competitive Rates
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get the best deals for you
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 relative w-full max-w-md mx-auto lg:max-w-none mt-12 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={
                  isLoggedIn ? "/global/LoggedIn.jpg" : "/global/LoggedOut.jpg"
                }
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                alt="Hero Image"
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
            </div>
            <motion.div
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-400 rounded-full"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            ></motion.div>
            <motion.div
              className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 rounded-full"
              animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 10, 0] }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MainLoginSignupSection;
