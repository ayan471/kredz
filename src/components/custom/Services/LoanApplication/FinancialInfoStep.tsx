import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

const incomeRanges = [
  { label: "0-10,000", value: "0-10000", eligibleAmount: 37000 },
  { label: "10,001-23,000", value: "10001-23000", eligibleAmount: 53000 },
  { label: "23,001-30,000", value: "23001-30000", eligibleAmount: 67000 },
  { label: "30,001-37,000", value: "30001-37000", eligibleAmount: 83000 },
  { label: "37,001-45,000", value: "37001-45000", eligibleAmount: 108000 },
  { label: "45,001-55,000", value: "45001-55000", eligibleAmount: 131000 },
  { label: "55,001-65,000", value: "55001-65000", eligibleAmount: 178000 },
  { label: "65,001-75,000", value: "65001-75000", eligibleAmount: 216000 },
  { label: "75,001-85,000", value: "75001-85000", eligibleAmount: 256000 },
  { label: "85,001-95,000", value: "85001-95000", eligibleAmount: 308000 },
  { label: "95,001-1,25,000", value: "95001-125000", eligibleAmount: 376000 },
  { label: "More than 1,25,000", value: "125001+", eligibleAmount: 487000 },
];

export const FinancialInfoStep = () => {
  const { register, control, watch } = useFormContext();
  const empType = watch("empType");

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
      <h2 className="text-2xl font-semibold mb-6">Financial Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="amtRequired">Amount Required</Label>
          <Input
            id="amtRequired"
            type="number"
            {...register("amtRequired")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            placeholder="50000"
          />
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="prpseOfLoan">Purpose of Loan</Label>
          <Input
            id="prpseOfLoan"
            {...register("prpseOfLoan")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            placeholder="Home renovation"
          />
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="creditScore">Credit Score</Label>
          <Input
            id="creditScore"
            type="number"
            {...register("creditScore")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            placeholder="750"
          />
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="empType">Employment Type</Label>
          <Controller
            name="empType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  {["Salaried", "Self-Employed", "Business Owner", "Other"].map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </motion.div>
        {empType === "Other" && (
          <motion.div className="space-y-2" variants={inputVariants}>
            <Label htmlFor="EmpOthers">Specify Other</Label>
            <Input
              id="EmpOthers"
              {...register("EmpOthers")}
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              placeholder="Freelancer"
            />
          </motion.div>
        )}
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="monIncomeRange">Monthly Income Range</Label>
          <Controller
            name="monIncomeRange"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select Income Range" />
                </SelectTrigger>
                <SelectContent>
                  {incomeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="monIncome">Monthly Income</Label>
          <Input
            id="monIncome"
            type="number"
            {...register("monIncome")}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            placeholder="50000"
          />
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="currEmis">Current EMIs</Label>
          <Controller
            name="currEmis"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select number of EMIs" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, "More than 4"].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
