"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Phone, Mail, MapPin } from "lucide-react";

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const sections = [
    {
      title: "1. Introduction",
      content:
        'These Terms and Conditions ("Terms") govern your access to and use of the Kredz website and services. By accessing or using the site, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with these Terms, please refrain from using our services.',
    },
    {
      title: "2. Services Provided",
      content: (
        <>
          <p>Kredz offers a range of services, including:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Credit score improvement strategies</li>
            <li>Credit monitoring and alerts</li>
            <li>Credit report dispute resolution</li>
            <li>
              Loan assistance through our partner banks and NBFCs (Non-Banking
              Financial Companies)
            </li>
          </ul>
          <p className="mt-2">
            These services are designed to provide guidance and support to help
            improve your credit score. However, individual results may vary
            depending on your unique financial situation.
          </p>
        </>
      ),
    },
    {
      title: "3. User Responsibilities",
      content: (
        <>
          <p>As a user of Kredz, you agree to:</p>
          <ul className="list-disc list-inside mt-2">
            <li>
              Provide accurate, complete, and up-to-date information when using
              our services.
            </li>
            <li>
              Follow the recommendations provided by Kredz to improve your
              credit score.
            </li>
            <li>
              Be solely responsible for any actions you take that may affect
              your credit score, including applying for loans or credit products
              through our partners.
            </li>
            <li>
              Notify us promptly of any changes in your credit status or
              personal information.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "4. No Guarantee of Results",
      content:
        "While Kredz strives to help you improve your credit score, we do not guarantee specific results, including any particular increase in your credit score or approval for loans. The results of using our services depend on multiple factors, including the accuracy of your credit information, your financial history, and actions taken by you or third parties.",
    },
    {
      title: "5. Fees and Payments",
      content: (
        <ul className="list-disc list-inside">
          <li>
            Kredz offers its services on a paid basis. All payments for services
            must be made according to the pricing plan selected.
          </li>
          <li>Payments are non-refundable unless stated otherwise.</li>
          <li>
            Kredz reserves the right to change service fees, and such changes
            will be communicated in advance.
          </li>
        </ul>
      ),
    },
    {
      title: "6. Third-Party Services",
      content:
        "Kredz partners with various banks and NBFCs to assist you in securing loans. However, any loan application, approval, or disbursement is subject to the terms and conditions of the respective bank or NBFC. Kredz is not responsible for the decisions made by third-party institutions.",
    },
    {
      title: "7. Privacy and Data Security",
      content:
        "We value your privacy and take all necessary precautions to protect your personal and financial information. Please refer to our Privacy Policy for details on how we collect, use, and safeguard your data.",
    },
    {
      title: "8. Limitation of Liability",
      content:
        "Kredz will not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or services, including but not limited to any financial loss, credit score impact, or loan rejection.",
    },
    {
      title: "9. Modification of Terms",
      content:
        "Kredz reserves the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on this website. Continued use of our services constitutes acceptance of the modified Terms.",
    },
    {
      title: "10. Termination of Services",
      content:
        "Kredz reserves the right to suspend or terminate your access to our services at any time if you violate these Terms or engage in any fraudulent or illegal activities.",
    },
    {
      title: "11. Governing Law",
      content:
        "These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.",
    },
    {
      title: "12. Contact Us",
      content: (
        <div>
          <p>
            For any questions or concerns about these Terms and Conditions,
            please contact us at:
          </p>
          <ul className="list-none mt-2">
            <li className="flex items-center mb-2">
              <Phone className="mr-2 text-orange-500" size={18} />
              <span>+91 8240561547</span>
            </li>
            <li className="flex items-center mb-2">
              <Mail className="mr-2 text-orange-500" size={18} />
              <span>support@kredz.com</span>
            </li>
            <li className="flex items-center">
              <MapPin className="mr-2 text-orange-500" size={18} />
              <span>
                No 656A, ElcotSez, Zsurvey, Behind Accenture Company, Old
                Mahablipuram Road, RajivGandhi Salai Sholinganallur - 600119
                TamilNadu, India
              </span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-blue-900 text-center mb-8"
        >
          Terms and Conditions
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <p className="text-blue-700 mb-6">
              Welcome to <span className="font-semibold">Kredz</span>! By using
              our website and services, you agree to the following terms and
              conditions. Please read them carefully before using our services.
            </p>
            {sections.map((section, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full text-left flex justify-between items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                >
                  <span className="text-blue-900 font-medium">
                    {section.title}
                  </span>
                  {expandedSection === index ? (
                    <ChevronUp className="w-5 h-5 text-orange-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-orange-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSection === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 bg-orange-50 rounded-b-lg">
                        {typeof section.content === "string" ? (
                          <p className="text-blue-700">{section.content}</p>
                        ) : (
                          <div className="text-blue-700">{section.content}</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-blue-700 mt-8"
        >
          By using our services, you acknowledge that you have read, understood,
          and agreed to these Terms and Conditions.
        </motion.p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
