import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

export const ReviewStep = () => {
  const { getValues } = useFormContext();
  const formData = getValues();

  const renderValue = (key: string, value: any) => {
    if (value instanceof FileList) {
      return value[0]?.name || "No file selected";
    }
    if (typeof value === "string" && value.startsWith("http")) {
      return "File uploaded";
    }
    return value;
  };

  const itemVariants = {
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
            staggerChildren: 0.05,
          },
        },
      }}
    >
      <h2 className="text-2xl font-semibold mb-6">Review Your Application</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(formData).map(([key, value]) => (
          <motion.div key={key} className="space-y-1" variants={itemVariants}>
            <p className="font-medium text-sm text-muted-foreground">{key}</p>
            <p className="text-lg">{renderValue(key, value)}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
