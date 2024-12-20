"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const MainLoginSignupSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Apka Apne Financial Buddy
              </span>{" "}
              <p className="md:text-6xl text-4xl  mt-1">
                Kredz is here for all your financial needs!
              </p>
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              {isLoggedIn ? (
                <>
                  <Link href="/loan-application">
                    <Button className="text-lg px-[2.5rem] py-[1.5rem] bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 rounded-full shadow-lg hover:shadow-xl">
                      Apply Now
                    </Button>
                  </Link>
                  <Link href="/credit-builder">
                    <Button className="text-lg px-[2.5rem] py-[1.5rem] bg-purple-600 hover:bg-purple-700 transition-colors duration-300 rounded-full shadow-lg hover:shadow-xl">
                      Credit Builder
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button className="text-lg px-[2.5rem] py-[1.5rem] bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 rounded-full shadow-lg hover:shadow-xl">
                      Apply Now
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="text-lg px-[2.5rem] py-[1.5rem] bg-purple-600 hover:bg-purple-700 transition-colors duration-300 rounded-full shadow-lg hover:shadow-xl">
                      Credit Builder
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            className="flex-1 relative w-full max-w-md mx-auto md:max-w-none mt-12 md:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={
                  isLoggedIn
                    ? "/global/collage-24.jpg"
                    : "/global/banners/hand-holding-phone-mockup.png"
                }
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                alt="Hero Image"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-400 rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MainLoginSignupSection;
