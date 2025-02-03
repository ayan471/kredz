"use client";

import { Lightbulb, CreditCard, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Personal Consulting",
    description:
      "We help you secure the best loan options through RBI-registered Banks and NBFCs. Our expert team guides you through the loan application process, ensuring you get the financial support you need.",
    icon: Lightbulb,
    color: "bg-orange-500",
  },
  {
    title: "Credit Building Subscription",
    description:
      "Build and monitor your credit score with our tailored solutions. We help you track progress, resolve disputes, and offer actionable tips to improve your credit health.",
    icon: TrendingUp,
    color: "bg-blue-900",
  },
  {
    title: "Membership Cards",
    description:
      "Gain exclusive access to premium services and benefits, including priority support and personalized loan consulting with our Kredz Membership Cards.",
    icon: CreditCard,
    color: "bg-orange-400",
  },
  {
    title: "Channel Partners",
    description:
      "Join our network of partners and offer Kredzs expert services to your clients. Become a channel partner and unlock new business opportunities while helping others improve their financial health.",
    icon: Users,
    color: "bg-blue-700",
  },
];

export default function OurServices() {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-orange-600">
            Our Services
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
            Empowering Your Financial Journey
          </p>
          <p className="mt-6 text-lg leading-8 text-blue-700">
            Discover how Kredz can transform your financial landscape with our
            comprehensive suite of services.
          </p>
        </motion.div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-blue-900">
                  <div className={`rounded-lg p-3 ${service.color}`}>
                    <service.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-xl">{service.title}</span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-700">
                  <p className="flex-auto">{service.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
