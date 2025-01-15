import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export const PersonalInfoStep = () => {
  const { register } = useFormContext();

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            {...register("fullName")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="phoneNo">Phone Number</Label>
          <Input
            id="phoneNo"
            type="tel"
            {...register("phoneNo")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            placeholder="1234567890"
          />
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="aadharNo">Aadhar Number</Label>
          <Input
            id="aadharNo"
            {...register("aadharNo")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            placeholder="1234 5678 9012"
          />
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="panNo">PAN Number</Label>
          <Input
            id="panNo"
            {...register("panNo")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            placeholder="ABCDE1234F"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
