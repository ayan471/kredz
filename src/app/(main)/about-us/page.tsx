"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Award,
  Users,
  CreditCard,
  Briefcase,
} from "lucide-react";

import { useRouter } from "next/navigation";

const AboutUs = () => {
  const router = useRouter();
  const services = [
    {
      icon: Award,
      title: "Expert Loan Consulting",
      description: "Personalized advice to secure the best loan options",
    },
    {
      icon: Users,
      title: "Credit Building Subscriptions",
      description: "Tailored strategies to improve your credit score",
    },
    {
      icon: CreditCard,
      title: "Exclusive Membership Cards",
      description: "Access premium financial services and benefits",
    },
    {
      icon: Briefcase,
      title: "Channel Partner Opportunities",
      description: "Join our network and grow your business",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-12"
        >
          About Us – Kredz
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-xl text-blue-700 mb-6">
            At Kredz, we help individuals and businesses achieve their financial
            goals with expert loan consulting, credit-building services, and
            valuable partnerships. Our mission is to empower you with the tools
            and knowledge needed to build a strong financial future.
          </p>
          <p className="text-xl text-blue-700">
            We partner with RBI-registered Banks and NBFCs to provide the best
            loan options, while offering tailored credit improvement strategies
            to enhance your financial health.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex items-start"
            >
              <service.icon className="w-12 h-12 text-blue-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-blue-700">{service.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-blue-700 text-white rounded-lg shadow-xl p-8 text-center"
        >
          <h2 className="text-3xl font-semibold mb-4 text-white">
            Our Commitment
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            At Kredz, we offer transparent, reliable, and customer-focused
            solutions to help you succeed. Our dedicated team is committed to
            providing you with the best financial guidance and support.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
            onClick={() => router.push("/services")}
          >
            Learn More About Our Services
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-semibold text-blue-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-700 mb-8">
            Contact us today to get started on your path toward better credit
            and exciting financial opportunities!
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => router.push("/contact")}
          >
            Contact Us
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
