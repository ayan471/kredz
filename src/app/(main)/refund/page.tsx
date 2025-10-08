"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Mail, Phone, MapPin } from "lucide-react";

const RefundCancellationPolicy = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const sections = [
    {
      title: "1. Refund Policy",
      content: (
        <>
          <h3 className="font-semibold mb-2">Refund Eligibility:</h3>
          <p className="mb-2">
            If you are not satisfied with the services provided, you may request
            a refund within 7 days of making your payment. However, refunds are
            subject to the following terms:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              If you request a refund within 7 days, we may refund up to 50% of
              the amount paid, depending on the stage of service already
              delivered.
            </li>
            <li>
              If services have already been initiated (such as credit report
              analysis, consultations, or customized credit-building plans), no
              full refund will be issued.
            </li>
            <li>
              Refunds will not exceed 50% of the original amount paid,
              regardless of whether services have been partially rendered or
              not.
            </li>
          </ul>
          <h3 className="font-semibold mb-2">Non-Refundable Services:</h3>
          <p className="mb-2">
            After the 7-day period, Kredz will not issue any refunds, as
            services would have been initiated or completed as per the
            agreement.
          </p>
          <h3 className="font-semibold mb-2">Processing of Refunds:</h3>
          <p>
            If a refund is approved, it will be processed to the original
            payment method. Please allow 7-10 business days for the refund to be
            reflected in your account.
          </p>
        </>
      ),
    },
    {
      title: "2. Cancellation Policy",
      content: (
        <>
          <h3 className="font-semibold mb-2">Cancellation Request:</h3>
          <p className="mb-2">
            You can cancel your service with Kredz at any time by submitting a
            written cancellation request to us via email at support@kredz.com or
            by calling +91 8240561547.
          </p>
          <h3 className="font-semibold mb-2">Cancellation Period:</h3>
          <p className="mb-2">
            If you cancel within 7 days of your service agreement, a refund will
            be processed (up to 50% as mentioned above). After 7 days, you will
            not be eligible for a refund, and services will be considered fully
            delivered.
          </p>
          <h3 className="font-semibold mb-2">Ongoing Services:</h3>
          <p className="mb-2">
            If you cancel a subscription-based service (e.g., credit monitoring
            or ongoing consultations), the cancellation will prevent future
            billing, but you will still be charged for the current period. No
            refunds will be issued for the previous period.
          </p>
          <h3 className="font-semibold mb-2">Effective Cancellation:</h3>
          <p>
            Upon cancellation, you will no longer receive updates, alerts, or
            further services. However, any work already done or services
            rendered will be non-refundable, as per the terms above.
          </p>
        </>
      ),
    },
    {
      title: "3. Exceptions",
      content: (
        <p>
          In exceptional circumstances (such as errors on our part or
          non-delivery of services), Kredz may, at its discretion, offer a
          refund greater than the standard 50% limit. Such cases will be
          reviewed individually, and a resolution will be provided within 7
          business days.
        </p>
      ),
    },
    {
      title: "4. Changes to the Refund and Cancellation Policy",
      content: (
        <p>
          Kredz reserves the right to modify or amend this Refund and
          Cancellation Policy at any time. Any updates or changes will be
          communicated to clients via email or posted on our website. Continued
          use of our services after any changes signifies your acceptance of the
          updated policy.
        </p>
      ),
    },
    {
      title: "5. Contact Us",
      content: (
        <div>
          <p className="mb-2">
            If you have any questions or need assistance with the refund or
            cancellation process, please contact us at:
          </p>
          <ul className="list-none">
            <li className="flex items-center mb-2">
              <Mail className="mr-2 text-primary" size={18} />
              <span>Email: support@kredz.com</span>
            </li>
            <li className="flex items-center mb-2">
              <Phone className="mr-2 text-primary" size={18} />
              <span>Phone: +91 8240561547</span>
            </li>
            <li className="flex items-center">
              <MapPin className="mr-2 text-primary" size={18} />
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold  text-center mb-8 text-blue-600"
        >
          Refund and Cancellation Policy
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card shadow-xl rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <p className="text-muted-foreground mb-6">
              At Kredz, we strive to provide excellent services to help improve
              your credit score and financial health. To ensure transparency and
              fairness, we have outlined our Refund and Cancellation Policy
              below. Please read this carefully.
            </p>
            {sections.map((section, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full text-left flex justify-between items-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors duration-200"
                >
                  <span className="text-blue-900 font-medium">
                    {section.title}
                  </span>
                  {expandedSection === index ? (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary" />
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
                      <div className="p-4 bg-primary/5 rounded-b-lg text-muted-foreground">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundCancellationPolicy;
