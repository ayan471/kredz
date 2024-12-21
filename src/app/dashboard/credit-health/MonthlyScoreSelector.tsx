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

interface MonthlyHealthData {
  creditScore: number;
  poweredBy: string;
}

interface MonthlyScoreSelectorProps {
  monthlyHealthData: Record<string, MonthlyHealthData>;
  startDate: Date;
  expiryDate: Date | null;
  currentScore: number;
  currentPoweredBy: string;
}

export default function MonthlyScoreSelector({
  monthlyHealthData,
  startDate,
  expiryDate,
  currentScore,
  currentPoweredBy,
}: MonthlyScoreSelectorProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("current");
  const [displayedScore, setDisplayedScore] = useState<number>(currentScore);
  const [displayedPoweredBy, setDisplayedPoweredBy] =
    useState<string>(currentPoweredBy);

  useEffect(() => {
    if (selectedMonth === "current") {
      setDisplayedScore(currentScore);
      setDisplayedPoweredBy(currentPoweredBy);
    } else if (monthlyHealthData[selectedMonth]) {
      setDisplayedScore(monthlyHealthData[selectedMonth].creditScore);
      setDisplayedPoweredBy(monthlyHealthData[selectedMonth].poweredBy);
    }
  }, [selectedMonth, currentScore, currentPoweredBy, monthlyHealthData]);

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
    <div className="w-full max-w-md mx-auto space-y-6">
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

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-64 h-64">
          <CreditScoreGauge
            score={displayedScore}
            poweredBy={displayedPoweredBy}
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-200">
            {displayedScore > 740 ? "Excellent job!" : "Room for improvement"}
          </p>
          <p className="text-sm text-slate-400 max-w-xs">
            {displayedScore > 740
              ? "Your credit score is in great shape. Keep up the good work!"
              : "Let's work on boosting your credit score!"}
          </p>
          <p className="text-xs text-slate-500">
            {selectedMonth === "current"
              ? "Current score"
              : `Score for ${monthOptions.find((o) => o.value === selectedMonth)?.label}`}
          </p>
        </div>
      </div>
    </div>
  );
}
