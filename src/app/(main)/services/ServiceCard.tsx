"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    >
      <Card className="h-full bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 overflow-hidden group">
        <CardHeader className="relative p-6">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          ></div>
          <div className="relative z-10">
            <CardTitle className="text-2xl font-bold text-white mb-2 flex items-center">
              <span className="text-3xl mr-2">{service.icon}</span>
              {service.title}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {service.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="relative p-6">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          ></div>
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Key Features:
            </h3>
            <ul className="list-disc list-inside text-gray-300 mb-4">
              {service.features.map((feature, idx) => (
                <li key={idx} className="mb-1">
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center">
              <Button
                asChild
                className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white"
              >
                <Link href={service.buttonLink}>{service.buttonText}</Link>
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
