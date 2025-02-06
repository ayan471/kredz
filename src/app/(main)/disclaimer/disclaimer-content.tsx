"use client";

import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  ExternalLink,
  Lock,
  Info,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";

const disclaimerSections = [
  {
    title: "No Financial Advice",
    content:
      "The content on this website is not intended as professional financial or legal advice. For personalized financial advice, you should consult with a qualified financial advisor or legal professional.",
    icon: Info,
  },
  {
    title: "No Guarantee of Results",
    content:
      "The services offered by Kredz aim to assist in improving your credit score and financial health. However, individual results may vary, and Kredz cannot guarantee specific outcomes, including improvements in your credit score, approval for loans, or better financial terms.",
    icon: Shield,
  },
  {
    title: "Accuracy of Information",
    content:
      "While we make every effort to ensure the accuracy of the information on this website, Kredz does not guarantee that the information provided is complete, accurate, or up to date. We are not responsible for any errors or omissions on this website.",
    icon: AlertTriangle,
  },
  {
    title: "Third-Party Links",
    content:
      "Our website may contain links to third-party websites. Kredz does not endorse or assume any responsibility for the content, products, or services of these third-party websites.",
    icon: ExternalLink,
  },
  {
    title: "Limitation of Liability",
    content:
      "Kredz will not be held liable for any loss or damage arising from the use of this website, including but not limited to financial loss, reputational harm, or other indirect damages, whether arising from negligence or other legal claims.",
    icon: Shield,
  },
  {
    title: "Changes to Services",
    content:
      "Kredz reserves the right to modify, update, or discontinue any part of its services or website at any time without prior notice.",
    icon: RefreshCcw,
  },
  {
    title: "Privacy",
    content:
      "We respect your privacy. Please refer to our Privacy Policy for detailed information on how we collect, use, and protect your personal information.",
    icon: Lock,
  },
];

export default function DisclaimerContent() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-orange-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-900 mb-4">
          Website Disclaimer
        </h1>
        <p className="text-xl text-blue-700 max-w-3xl mx-auto">
          The information provided on the Kredz website is for general
          informational purposes only. Please read our disclaimer carefully.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {disclaimerSections.map((section, index) => (
          <motion.div
            key={section.title}
            className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out transform hover:scale-105 ${
              hoveredIndex === index ? "ring-2 ring-orange-400" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-blue-600 p-3 rounded-full mr-4">
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900">
                {section.title}
              </h2>
            </div>
            <p className="text-blue-700 leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
