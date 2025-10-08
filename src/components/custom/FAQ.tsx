"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Calculator,
  Ban as Bank,
  Bell,
  Clock,
  FileSearch,
  DollarSign,
  UserPlus,
  Lock,
  HelpCircle,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  icon: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    question: "What is the Kredz Credit Build-Up Plan?",
    answer: (
      <>
        The{" "}
        <strong className="text-blue-600">Kredz Credit Build-Up Plan</strong> is
        a comprehensive service designed to help you improve your credit score,
        monitor your credit health, and resolve any discrepancies in your credit
        report. We provide personalized strategies and expert guidance to help
        you build a stronger credit profile and increase your financial
        opportunities.
      </>
    ),
    icon: <CreditCard className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "How can Kredz help me improve my credit score?",
    answer: (
      <>
        We help you by:
        <ul className="list-disc pl-5 mt-2">
          <li>
            Analyzing your credit report to identify areas for improvement.
          </li>
          <li>
            Offering personalized strategies to improve your creditworthiness.
          </li>
          <li>Providing ongoing credit monitoring and alerts.</li>
          <li>
            Assisting with identifying and resolving any inaccuracies or errors
            on your credit report.
          </li>
        </ul>
      </>
    ),
    icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "Do you guarantee that my credit score will improve?",
    answer: (
      <>
        While we strive to help improve your credit score,{" "}
        <strong className="text-blue-600">Kredz</strong> cannot guarantee
        specific results as credit scores are influenced by many factors,
        including your credit history, financial behavior, and actions taken by
        creditors. However, we provide expert guidance to increase your chances
        of improvement.
      </>
    ),
    icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "What is the reducing balance method for loan calculation?",
    answer: (
      <>
        The <strong>reducing balance method</strong> calculates interest on the
        outstanding loan amount, meaning interest is only charged on the
        remaining principal balance after each repayment. This method ensures
        that your interest payments decrease as you pay down the principal.
      </>
    ),
    icon: <Calculator className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "Can Kredz help me get a loan?",
    answer: (
      <>
        Yes! Through our extensive network of{" "}
        <strong className="text-blue-600">bank</strong> and{" "}
        <strong className="text-blue-600">
          NBFC (Non-Banking Financial Company)
        </strong>{" "}
        partners, we help you access loans with better terms. Whether you're
        looking for a personal loan, home loan, or car loan, we assist in
        connecting you with financial institutions that best suit your needs.
      </>
    ),
    icon: <Bank className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "How does Kredz monitor my credit score?",
    answer: (
      <>
        Once you sign up for the{" "}
        <strong className="text-blue-600">Kredz Credit Build-Up Plan</strong>,
        we provide you with regular credit score updates, along with
        notifications for any changes to your credit profile. You will also
        receive alerts if any significant events, like a sudden drop in your
        credit score or suspicious activities, are detected.
      </>
    ),
    icon: <Bell className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "How long will it take to see improvements in my credit score?",
    answer: (
      <>
        The time it takes to see improvements in your credit score varies
        depending on several factors, such as your current credit standing,
        financial habits, and the actions you take to improve your score.
        Generally, it may take a few months to see significant changes.
      </>
    ),
    icon: <Clock className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "What happens if there are errors in my credit report?",
    answer: (
      <>
        If we identify inaccuracies or discrepancies in your credit report, we
        will assist you in disputing them with the relevant credit bureaus and
        creditors. Our team will help you gather necessary documentation, submit
        disputes, and follow up until the errors are resolved.
      </>
    ),
    icon: <FileSearch className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "How much does the Kredz Credit Build-Up Plan cost?",
    answer: (
      <>
        The cost of our services depends on the plan you choose. Please visit
        our{" "}
        <a href="/pricing" className="text-blue-600 hover:underline">
          Pricing Page
        </a>{" "}
        or contact us for more details on pricing and available packages.
      </>
    ),
    icon: <DollarSign className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "How can I get started with Kredz?",
    answer: (
      <>
        To get started, simply{" "}
        <a href="#contact-us" className="text-blue-600 hover:underline">
          contact us
        </a>{" "}
        or sign up for the{" "}
        <strong className="text-blue-600">Kredz Credit Build-Up Plan</strong> on
        our website. We will assess your current credit status and develop a
        personalized plan to help you improve your credit score and reach your
        financial goals.
      </>
    ),
    icon: <UserPlus className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "Is my personal information secure with Kredz?",
    answer: (
      <>
        Yes, we take your privacy seriously. All the personal and financial
        information you provide is protected using secure encryption methods.
        Please review our{" "}
        <a href="/privacy-policy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>{" "}
        for more information on how we handle and safeguard your data.
      </>
    ),
    icon: <Lock className="w-6 h-6 text-blue-600" />,
  },
  {
    question: "What if I have more questions?",
    answer: (
      <>
        If you have additional questions or need more information, feel free to
        reach out to us through our{" "}
        <a href="#contact-us" className="text-blue-600 hover:underline">
          Contact Us
        </a>{" "}
        page. Our customer support team is happy to assist you with any queries.
      </>
    ),
    icon: <HelpCircle className="w-6 h-6 text-blue-600" />,
  },
];

const FAQItem: React.FC<{
  item: FAQItem;
  isOpen: boolean;
  toggleOpen: () => void;
}> = ({ item, isOpen, toggleOpen }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="border-b border-gray-200 py-4"
  >
    <button
      className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-200"
      onClick={toggleOpen}
    >
      <div className="flex items-center">
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="mr-3"
        >
          {item.icon}
        </motion.div>
        {item.question}
      </div>
      {isOpen ? (
        <ChevronUp className="w-5 h-5" />
      ) : (
        <ChevronDown className="w-5 h-5" />
      )}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-gray-600 leading-relaxed overflow-hidden"
        >
          {item.answer}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(index)
        ? prevOpenItems.filter((i) => i !== index)
        : [...prevOpenItems, index]
    );
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-blue-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl font-bold text-center text-gray-800 mb-8"
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-gray-600 mb-12"
        >
          At <strong className="text-blue-600">Kredz</strong>, we understand
          that you may have questions about our services and how we can help you
          improve your credit score and secure better financial opportunities.
          Here are some common questions and their answers:
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white shadow-xl rounded-lg p-6 space-y-4"
        >
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              isOpen={openItems.includes(index)}
              toggleOpen={() => toggleItem(index)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
