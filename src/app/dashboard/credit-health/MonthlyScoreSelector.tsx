"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreditScoreGauge from "./CreditScoreGauge";

interface MonthlyScoreSelectorProps {
  monthlyHealthData: Record<string, any>;
  startDate: Date;
  expiryDate: Date | null;
  currentScore: number;
  poweredBy: string;
}

export default function MonthlyScoreSelector({
  monthlyHealthData,
  startDate,
  expiryDate,
  currentScore,
  poweredBy,
}: MonthlyScoreSelectorProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("current");
  const [displayedScore, setDisplayedScore] = useState<number>(currentScore);

  useEffect(() => {
    if (selectedMonth === "current") {
      setDisplayedScore(currentScore);
    } else if (monthlyHealthData[selectedMonth]) {
      setDisplayedScore(monthlyHealthData[selectedMonth].creditScore || 0);
    }
  }, [selectedMonth, currentScore, monthlyHealthData]);

  const getMonthOptions = () => {
    const options = [{ value: "current", label: "Current Score" }];
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
    <div className="space-y-6 w-full">
      <Select onValueChange={setSelectedMonth} value={selectedMonth}>
        <SelectTrigger className="w-full">
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

      <div className="w-64 h-64 mx-auto">
        <CreditScoreGauge score={displayedScore} poweredBy={poweredBy} />
      </div>

      <p className="text-center text-slate-400 max-w-md">
        {displayedScore > 740
          ? "Excellent job! Your credit score is in great shape. Keep up the good work!"
          : "There's room for improvement in your credit score. Let's work on boosting it!"}
      </p>

      <p className="text-sm text-slate-500 text-center">
        {selectedMonth === "current"
          ? "Current score"
          : `Score for ${monthOptions.find((o) => o.value === selectedMonth)?.label}`}
      </p>
    </div>
  );
}
