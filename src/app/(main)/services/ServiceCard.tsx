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
  };
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
    >
      <div className={`p-6 bg-gradient-to-r ${service.color}`}>
        <div className="text-4xl mb-4">{service.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {service.title}
        </h3>
        <p className="text-white text-sm">{service.description}</p>
      </div>
      <div className="p-6">
        <ul className="list-disc list-inside mb-4 text-blue-900">
          {service.features.map((feature, index) => (
            <li key={index} className="mb-2 text-sm">
              {feature}
            </li>
          ))}
        </ul>
        <Link href={service.buttonLink}>
          <button className="w-full bg-orange-500 text-white py-2 px-4 hover:bg-orange-600 transition-colors duration-300  rounded-full">
            {service.buttonText}
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
