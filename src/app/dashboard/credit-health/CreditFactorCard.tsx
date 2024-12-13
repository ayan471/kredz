import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

interface CreditFactorCardProps {
  factor: CreditHealthFactor;
}

const CreditFactorCard: React.FC<CreditFactorCardProps> = ({ factor }) => {
  const renderDetails = () => {
    if (!factor.details) return null;

    switch (factor.name) {
      case "Credit Age":
        return (
          <p className="text-sm text-slate-400">
            {factor.details.years} years, {factor.details.months} months,{" "}
            {factor.details.days} days
          </p>
        );
      case "Total Active Accounts":
      case "Delay History":
      case "No. of Inquiries":
      case "Overdue Accounts":
        return (
          <>
            <p className="text-sm text-slate-400">
              Count: {factor.details.count}
            </p>
            {factor.details.lenders && (
              <p className="text-sm text-slate-400">
                Lenders: {factor.details.lenders}
              </p>
            )}
          </>
        );
      case "Scoring Factors":
        return (
          <p className="text-sm text-slate-400">{factor.details.factors}</p>
        );
      case "Our Recommendation":
        return (
          <p className="text-sm text-slate-400">
            {factor.details.recommendation}
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-200">{factor.name}</h3>
          {factor.score > 0 && (
            <span className="text-sm font-semibold text-slate-300">
              {factor.score}%
            </span>
          )}
        </div>
        {factor.score > 0 && (
          <Progress
            value={factor.score}
            className={`h-2 mb-2 ${
              factor.score > 66
                ? "bg-green-500"
                : factor.score > 33
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
        )}
        {renderDetails()}
      </CardContent>
    </Card>
  );
};

export default CreditFactorCard;
