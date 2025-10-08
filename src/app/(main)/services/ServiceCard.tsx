"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    icon: string;
    color: string;
    link: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
    comingSoon?: boolean;
  };
  index: number;
  onChannelPartnerClick?: () => void;
}

export default function ServiceCard({
  service,
  index,
  onChannelPartnerClick,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col h-full"
    >
      <div className={`p-6 bg-gradient-to-r ${service.color}`}>
        <div className="text-4xl mb-4">{service.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {service.title}
        </h3>
        <p className="text-white text-sm">{service.description}</p>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <ul className="list-disc list-inside mb-4 text-blue-900 flex-grow">
          {service.features.map((feature, index) => (
            <li key={index} className="mb-2 text-sm">
              {feature}
            </li>
          ))}
        </ul>

        {service.comingSoon ? (
          <button
            onClick={onChannelPartnerClick}
            className="w-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition-colors duration-300 rounded-full mt-auto"
          >
            {service.buttonText}
          </button>
        ) : (
          <Link href={service.buttonLink} className="mt-auto">
            <button className="w-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition-colors duration-300 rounded-full">
              {service.buttonText}
            </button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
