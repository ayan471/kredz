"use client";

import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import ContactSection from "./ContactSection";
import HeroSection from "./HeroSection";

const services = [
  {
    title: "Loan Consulting",
    description:
      "Our Loan Consulting service offers expert advice and assistance to help you secure the best loan options suited to your financial needs. Whether it's a personal loan, home loan, or business loan, we guide you through the entire loan process.",
    icon: "💼",
    color: "from-orange-500 to-blue-900",
    link: "/consultancy-application",
    features: [
      "Expert Loan Advice: Personalized recommendations on loan types, lenders, and terms.",
      "Loan Pre-Approval Guidance: Assistance in the pre-approval process to improve your chances of getting the best loan offers.",
      "Negotiation Support: We help negotiate the best interest rates, repayment terms, and other loan conditions.",
      "End-to-End Support: From loan application to disbursement, we provide expert support at each step.",
    ],
    buttonText: "Apply Now",
    buttonLink: "/consultancy-application",
  },
  {
    title: "Loan Membership Cards",
    description:
      "The Membership Card gives you exclusive access to Kredz's premium loan consulting and credit-building services. With our membership, you can take advantage of specialized offerings and priority access to our experts.",
    icon: "💳",
    color: "from-blue-900 to-orange-500",
    link: "/membership-cards",
    features: [
      "Exclusive Benefits: Access to customized loan consulting, special loan offers, and faster services.",
      "Priority Support: As a cardholder, you receive priority access to our loan consultants, ensuring quick assistance whenever you need it.",
      "Special Discounts: Enjoy discounts on our Credit Building Subscription and other premium services.",
      "VIP Consultation: Get one-on-one consultations with financial experts to guide you in making the best credit and loan decisions.",
    ],
    buttonText: "Apply Now",
    buttonLink: "/membership-cards",
  },
  {
    title: "Credit Building Subscription",
    description:
      "Our Credit Building Subscription is designed to help you enhance and maintain a healthy credit score. With ongoing support and expert advice, you can take charge of your credit health and open doors to better financial opportunities.",
    icon: "📈",
    color: "from-orange-500 to-blue-900",
    link: "/credit-builder-plan",
    features: [
      "Personalized Credit Plans: Get a customized credit-building strategy based on your current credit profile.",
      "Regular Credit Monitoring: Stay informed with regular updates and alerts on your credit score and report.",
      "Debt Management Guidance: Receive advice on how to reduce debt and improve your credit score over time.",
      "Dispute Resolution: Assistance in identifying and resolving errors or discrepancies on your credit report.",
    ],
    buttonText: "Apply Now",
    buttonLink: "/credit-builder-plan",
  },
  {
    title: "Credit Builder Loan",
    description:
      "Kredz Credit Builder Loan is designed to help individuals build or improve their credit score. By borrowing a small, manageable amount and making timely payments, you can demonstrate positive credit behavior and enhance your credit profile.",
    icon: "🏗️",
    color: "from-blue-900 to-orange-500",
    link: "/credit-builder-loan",
    features: [
      "Build Credit Score: Improve your credit score through consistent, timely payments.",
      "Flexible Terms: Choose loan terms that fit your financial situation.",
      "Easy Application: Straightforward application process designed for accessibility.",
      "Manageable Payments: Small, manageable loan amounts to ensure successful repayment.",
    ],
    buttonText: "Apply Now",
    buttonLink: "/credit-builder-loan",
  },
  {
    title: "Channel Partners",
    description:
      "Kredz offers an exclusive Channel Partner Program for businesses or individuals looking to collaborate with us and expand their financial service offerings.",
    icon: "🤝",
    color: "from-orange-500 to-blue-900",
    link: "#",
    features: [
      "Revenue Sharing: Earn commissions by referring clients to Kredz for credit-building or loan consulting services.",
      "Access to Exclusive Products: Offer Kredz's tailored credit and loan products to your clients and customers.",
      "Comprehensive Support: We provide training, tools, and ongoing support to ensure you can deliver quality financial services to your network.",
      "Partnership Opportunities: Partner with us to offer comprehensive credit and loan solutions, and expand your business's product portfolio.",
    ],
    buttonText: "Apply Now",
    buttonLink: "#",
  },
  {
    title: "Why Choose Kredz?",
    description:
      "At Kredz, we are committed to helping you take control of your financial journey. We offer comprehensive services to ensure you build, manage, and protect your credit while gaining access to loans and exclusive membership benefits.",
    icon: "🌟",
    color: "from-blue-900 to-orange-500",
    link: "/about-us",
    features: [
      "Expert Guidance: Our team of financial experts provides personalized advice, helping you make informed decisions at every stage.",
      "Comprehensive Services: Whether you need help with a loan, credit score, or expanding your business, we offer all-around support.",
      "Exclusive Benefits: Membership and channel partners enjoy special access to services, products, and financial opportunities that are not available to the general public.",
      "Trusted Partnerships: We work with RBI-registered Banks and NBFCs to offer you reliable and competitive loan products.",
    ],
    buttonText: "Learn More",
    buttonLink: "/about-us",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-100 text-blue-900">
      <HeroSection />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16"
      >
        <h2
          id="services"
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-500 to-blue-900 bg-clip-text text-transparent"
        >
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
        <ContactSection />
      </motion.div>
    </div>
  );
}
