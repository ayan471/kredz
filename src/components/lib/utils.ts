import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | null | undefined) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const calculateEMI = (
  principal: number,
  tenure: number,
  annualInterestRate: number = 11
) => {
  // Convert annual interest rate to monthly
  const monthlyRate = annualInterestRate / 12 / 100;

  // Calculate EMI using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);

  // Calculate total payment and total interest
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - principal;

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    interestRate: annualInterestRate,
  };
};
