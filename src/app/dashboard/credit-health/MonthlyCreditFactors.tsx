"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreditFactorCard from "./CreditFactorCard";

interface CreditHealthFactor {
  name: string;
  score: number;
  details?: {
    years?: number;
    months?: number;
    days?: number;
    count?: number;
    lenders?: string;
    factors?: string;
    recommendation?: string;
  };
}

interface MonthlyCreditFactorsProps {
  monthlyHealthData: Record<string, any>;
  startDate: Date;
  expiryDate: Date | null;
}

export default function MonthlyCreditFactors({
  monthlyHealthData,
  startDate,
  expiryDate,
}: MonthlyCreditFactorsProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [currentFactors, setCurrentFactors] = useState<CreditHealthFactor[]>(
    []
  );

  useEffect(() => {
    if (selectedMonth && monthlyHealthData[selectedMonth]) {
      const factors = transformDataToFactors(monthlyHealthData[selectedMonth]);
      setCurrentFactors(factors);
    }
  }, [selectedMonth, monthlyHealthData]);

  const transformDataToFactors = (data: any): CreditHealthFactor[] => {
    if (Array.isArray(data)) {
      return data;
    }
    return [
      { name: "Credit Utilization", score: data.creditUtilization },
      { name: "Payment History", score: data.paymentHistory },
      { name: "Credit Age", score: 0, details: data.creditAge },
      { name: "Credit Mix", score: data.creditMix },
      {
        name: "Total Active Accounts",
        score: data.totalActiveAccounts.count,
        details: data.totalActiveAccounts,
      },
      {
        name: "Delay History",
        score: data.delayHistory.count,
        details: data.delayHistory,
      },
      {
        name: "No. of Inquiries",
        score: data.inquiries.count,
        details: data.inquiries,
      },
      {
        name: "Overdue Accounts",
        score: data.overdueAccounts.count,
        details: data.overdueAccounts,
      },
      {
        name: "Scoring Factors",
        score: 0,
        details: { factors: data.scoringFactors },
      },
      {
        name: "Our Recommendation",
        score: 0,
        details: { recommendation: data.recommendation },
      },
    ];
  };

  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date(startDate);
    const endDate = expiryDate || new Date();

    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
      options.push({
        value: monthKey,
        label: currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return options;
  };

  const monthOptions = getMonthOptions();

  return (
    <div className="space-y-4">
      <Select onValueChange={setSelectedMonth} value={selectedMonth}>
        <SelectTrigger>
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedMonth && monthlyHealthData[selectedMonth] && (
        <div className="space-y-4">
          {currentFactors.map((factor: CreditHealthFactor) => (
            <CreditFactorCard key={factor.name} factor={factor} />
          ))}
        </div>
      )}
    </div>
  );
}
