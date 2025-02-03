"use client";
import { motion } from "framer-motion";
import { CheckCircle, ThumbsUp, Target, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const reasons = [
  {
    icon: CheckCircle,
    title: "Expert Financial Guidance",
    description:
      "Our team of professionals provides personalized advice to help you secure loans and build your credit.",
  },
  {
    icon: ThumbsUp,
    title: "Access to Top Loan Providers",
    description:
      "We connect you with RBI-registered Banks and NBFCs for the best loan offers available.",
  },
  {
    icon: Target,
    title: "Tailored Solutions",
    description:
      "Every individual's financial needs are unique. We offer customized strategies that fit your situation.",
  },
  {
    icon: Shield,
    title: "Transparent & Reliable",
    description:
      "We are committed to clear, honest communication, with no hidden fees or surprises.",
  },
];

const WhyChooseKredz = () => {
  return (
    <section className="bg-gradient-to-b from-white to-orange-50 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Why Choose Kredz?
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Your journey to a better financial future begins here. We offer
            expert guidance and tailored solutions to meet your unique needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 flex items-start border border-orange-200"
            >
              <reason.icon className="w-12 h-12 text-orange-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-blue-700">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-blue-900 mb-4">
            Get Started Today!
          </h3>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto mb-8">
            Whether you need help improving your credit, securing a loan, or
            accessing exclusive services, Kredz is here to help.
          </p>
          <Link href={"/contact"}>
            <Button className="text-lg px-8 py-4 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 rounded-full shadow-lg hover:shadow-xl text-white">
              Contact Us
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseKredz;
