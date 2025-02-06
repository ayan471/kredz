"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    { title: "1. Information We Collect", id: "information-we-collect" },
    { title: "2. How We Use Your Information", id: "how-we-use-information" },
    { title: "3. Sharing Your Information", id: "sharing-information" },
    { title: "4. Data Security", id: "data-security" },
    { title: "5. Cookies and Tracking Technologies", id: "cookies" },
    { title: "6. Third-Party Websites", id: "third-party-websites" },
    { title: "7. Your Rights and Choices", id: "your-rights" },
    { title: "8. Children's Privacy", id: "childrens-privacy" },
    { title: "9. Changes to This Privacy Policy", id: "changes" },
    { title: "10. Contact Us", id: "contact-us" },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-blue-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <header className="text-center mb-12">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-blue-900 mb-4"
          >
            Privacy Policy
          </motion.h1>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-white rounded-full p-4 shadow-lg"
          >
            <Shield className="w-16 h-16 text-orange-500" />
          </motion.div>
        </header>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl p-6 md:p-10 mb-10"
        >
          <p className="text-blue-700 mb-6 text-lg leading-relaxed">
            Kredz values your privacy and is committed to protecting your
            personal information. This Privacy Policy outlines how we collect,
            use, disclose, and safeguard your data when you use our services or
            visit our website. By accessing or using Kredz, you agree to the
            terms of this policy.
          </p>

          <nav className="mb-10">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Table of Contents
            </h2>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full text-left flex justify-between items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-blue-900 font-medium">
                      {section.title}
                    </span>
                    {expandedSection === section.id ? (
                      <ChevronUp className="w-5 h-5 text-orange-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-orange-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSection === section.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-orange-50 rounded-b-lg">
                          {renderSectionContent(section.id)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-blue-700"
        >
          <p>&copy; 2024 Kredz. All rights reserved.</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

const renderSectionContent = (id: string) => {
  switch (id) {
    case "information-we-collect":
      return (
        <div>
          <p className="text-blue-700 mb-4">
            We collect various types of information when you use our services,
            including:
          </p>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            Personal Information:
          </h3>
          <ul className="list-disc list-inside text-blue-700 mb-4">
            <li>Name</li>
            <li>Contact details (email, phone number, address)</li>
            <li>Date of birth</li>
            <li>
              Identification number (e.g., PAN, Aadhaar in India, or other
              similar identifiers)
            </li>
            <li>Payment information (credit card details, billing address)</li>
          </ul>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            Financial Information:
          </h3>
          <ul className="list-disc list-inside text-blue-700 mb-4">
            <li>Credit report details</li>
            <li>Credit score</li>
            <li>Loan history</li>
            <li>Bank account or credit card statements (if provided)</li>
          </ul>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            Usage Data:
          </h3>
          <ul className="list-disc list-inside text-blue-700">
            <li>
              Information about your interactions with our website, such as IP
              address, browser type, device information, and pages visited.
            </li>
            <li>
              Cookies or similar tracking technologies to enhance your browsing
              experience.
            </li>
          </ul>
        </div>
      );
    case "how-we-use-information":
      return (
        <div>
          <p className="text-blue-700 mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc list-inside text-blue-700">
            <li>
              <span className="font-semibold">Providing Services:</span> To
              deliver credit score improvement strategies, credit monitoring,
              credit report analysis, and dispute resolution services.
            </li>
            <li>
              <span className="font-semibold">Personalization:</span> To
              customize our services based on your financial goals and credit
              profile.
            </li>
            <li>
              <span className="font-semibold">Communication:</span> To
              communicate with you about our services, updates, or promotional
              offers. We may also send you reminders or notifications regarding
              your credit score and other financial matters.
            </li>
            <li>
              <span className="font-semibold">Processing Payments:</span> To
              process payments and manage your account.
            </li>
            <li>
              <span className="font-semibold">Improving Services:</span> To
              analyze usage trends and enhance the performance and functionality
              of our website and services.
            </li>
            <li>
              <span className="font-semibold">Legal Compliance:</span> To comply
              with legal requirements, resolve disputes, and enforce our
              agreements.
            </li>
          </ul>
        </div>
      );
    case "sharing-information":
      return (
        <div>
          <p className="text-blue-700 mb-4">
            We respect your privacy and do not share your personal information
            without your consent, except in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-blue-700">
            <li>
              <span className="font-semibold">Service Providers:</span> We may
              share your information with trusted third-party service providers
              who assist us in delivering our services, such as payment
              processors, credit reporting agencies, or loan partners.
            </li>
            <li>
              <span className="font-semibold">Financial Institutions:</span> If
              you are seeking a loan through our banking or NBFC partners, we
              may share your financial and credit details with them to help you
              apply for and secure a loan. This is done with your explicit
              consent.
            </li>
            <li>
              <span className="font-semibold">Legal Requirements:</span> We may
              disclose your information if required by law, or in response to
              legal requests such as subpoenas, court orders, or regulatory
              requirements.
            </li>
          </ul>
        </div>
      );
    case "data-security":
      return (
        <p className="text-blue-700">
          We implement reasonable security measures to protect your personal
          information from unauthorized access, alteration, or disclosure.
          However, no method of data transmission over the internet is 100%
          secure, and while we strive to protect your data, we cannot guarantee
          absolute security.
        </p>
      );
    case "cookies":
      return (
        <p className="text-blue-700">
          We use cookies and other tracking technologies to improve your
          browsing experience, track your interactions with our website, and
          analyze trends. You can control cookies through your browser settings,
          but disabling cookies may affect some website functionalities.
        </p>
      );
    case "third-party-websites":
      return (
        <p className="text-blue-700">
          Our website may contain links to third-party websites for additional
          resources or services. These third-party websites are governed by
          their own privacy policies, and we encourage you to review them before
          sharing any personal information. Kredz is not responsible for the
          privacy practices of third-party sites.
        </p>
      );
    case "your-rights":
      return (
        <div>
          <p className="text-blue-700 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-blue-700">
            <li>
              <span className="font-semibold">Access Your Data:</span> You can
              request a copy of the personal data we hold about you.
            </li>
            <li>
              <span className="font-semibold">
                Update or Correct Information:
              </span>{" "}
              If you believe any of the information we hold is inaccurate, you
              can request corrections.
            </li>
            <li>
              <span className="font-semibold">Delete Your Data:</span> You may
              request that we delete your personal data, subject to legal and
              contractual obligations.
            </li>
            <li>
              <span className="font-semibold">
                Opt-Out of Marketing Communications:
              </span>{" "}
              You can opt out of receiving marketing or promotional emails at
              any time by using the unsubscribe link in the email or contacting
              us directly.
            </li>
          </ul>
        </div>
      );
    case "childrens-privacy":
      return (
        <p className="text-blue-700">
          Our services are not intended for individuals under the age of 18. We
          do not knowingly collect or solicit personal information from
          children. If we learn that we have inadvertently collected personal
          information from a child under 18, we will take steps to delete such
          information as quickly as possible.
        </p>
      );
    case "changes":
      return (
        <p className="text-blue-700">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or legal requirements. Any updates will be posted on
          this page with an updated "Last Modified" date. We encourage you to
          review this Privacy Policy periodically to stay informed about how we
          are protecting your data.
        </p>
      );
    case "contact-us":
      return (
        <div>
          <p className="text-blue-700 mb-4">
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at:
          </p>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-orange-500" />
              Email: support@kredz.com
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-orange-500" />
              Phone: +91 8240561547
            </li>
            <li className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-orange-500" />
              No 656A, ElcotSez, Zsurvey, Behind Accenture Company, Old
              Mahablipuram Road, RajivGandhi Salai Sholinganallur - 600119
              TamilNadu, India
            </li>
            <li className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-orange-500" />
              Website: www.kredz.com
            </li>
          </ul>
        </div>
      );
    default:
      return null;
  }
};

export default PrivacyPolicy;
