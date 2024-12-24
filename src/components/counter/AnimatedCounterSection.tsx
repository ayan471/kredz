"use client";

import React from "react";
import { motion } from "framer-motion";

import { CreditCard, Users, TrendingUp, Banknote } from "lucide-react";
import { useCountUp } from "@/hooks/useCountAnimation";

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) => {
  const formattedValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const { count, ref } = useCountUp(formattedValue);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <Icon className="w-12 h-12 mb-4 text-indigo-600" />
      <h3 className="text-4xl font-bold mb-2 text-gray-800">
        {count.toFixed(1).replace(/\.0$/, "")}
        {value.includes("+") && "+"}
        {value.includes("cr") && "cr"}
      </h3>
      <p className="text-lg text-gray-600">{title}</p>
    </motion.div>
  );
};

export default function AnimatedCounterSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-indigo-900"
        >
          Our Impressive Impact
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Loan disbursal" value="6.5cr+" icon={Banknote} />
          <StatCard
            title="Credit Report dispute resolved"
            value="3463+"
            icon={CreditCard}
          />
          <StatCard
            title="Credit score improved"
            value="9567+"
            icon={TrendingUp}
          />
          <StatCard title="Happy Customers" value="8766+" icon={Users} />
        </div>
      </div>
    </section>
  );
}
