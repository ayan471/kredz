import { ThumbsUp, ArrowRight, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

import { auth } from "@clerk/nextjs/server";
import { getCreditScoreData } from "@/actions/formActions";

export default async function CreditScoreDashboard() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const creditData = await getCreditScoreData(userId);

  const getScoreColor = (score: number) => {
    if (score < 620) return "red";
    if (score < 680) return "orange";
    if (score < 740) return "yellow";
    return "green";
  };

  const getScoreCategory = (score: number) => {
    if (score < 620) return "Very Poor";
    if (score < 680) return "Fair";
    if (score < 740) return "Good";
    return "Excellent";
  };

  const score = parseInt(creditData.creditScore || "0");
  const scoreColor = getScoreColor(score);
  const scoreCategory = getScoreCategory(score);

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Credit Score Section */}
        <section className="text-center space-y-8">
          <h1 className="text-[#000080] text-4xl font-bold">
            Your Credit Score
          </h1>

          <div className="relative w-[300px] h-[150px] mx-auto">
            <div className="relative w-full h-full">
              {/* Semi-circular gauge background */}
              <div className="absolute inset-0 rounded-t-full border-[16px] border-b-0 border-gray-200" />
              {/* Colored segment */}
              <div
                className={`absolute inset-0 rounded-t-full border-[16px] border-b-0 border-${scoreColor}-400`}
                style={{
                  clipPath: `polygon(0 0, ${(score / 900) * 100}% 0, ${(score / 900) * 100}% 100%, 0% 100%)`,
                }}
              />

              {/* Score display */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-20%] text-center">
                <div className="text-5xl font-bold">{score}</div>
                <div className={`text-${scoreColor}-500 text-sm mt-1`}>
                  {scoreCategory}
                </div>
                <div className="text-xs text-gray-500">300-900</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-gray-500">
            <p>
              Last update: {new Date(creditData.updatedAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold text-black">
                {creditData.fullName}
              </span>{" "}
              <span>
                {scoreCategory === "Excellent"
                  ? "you have an excellent credit score. Keep up the good work!"
                  : "it seems you have scope to improve your overall credit score."}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <span>Powered by</span>
            <img src="/placeholder.svg" alt="CRIF Logo" className="h-6" />
          </div>
        </section>

        {/* Credit Factors Section */}
        <section className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-[#000080] text-3xl font-bold">
              Your Credit Factors
            </h2>
            <p className="text-xl font-semibold">
              Below are all of your credit factors which are affecting your
              overall score
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Credit Utilization Ratio", score: 0 },
              { name: "Credit Behavior", score: 0 },
              { name: "Payment History", score: score > 0 ? 100 : 0 },
              { name: "Age of Credit", score: 0 },
            ].map((factor) => (
              <Card key={factor.name} className="p-4 space-y-4">
                <h3 className="text-[#000080] text-xl font-bold">
                  {factor.name}
                </h3>
                <div
                  className={`text-${getScoreColor(factor.score)}-500 text-2xl font-bold`}
                >
                  {factor.score}%
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full bg-${getScoreColor(factor.score)}-500 rounded-full`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full bg-${getScoreColor(factor.score)}-100 text-${getScoreColor(factor.score)}-700`}
                  >
                    {getScoreCategory(factor.score)}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 text-${getScoreColor(factor.score)}-500`}
                >
                  {factor.score >= 680 ? (
                    <>
                      <ThumbsUp className="w-4 h-4" />
                      <span>Excellent</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Need Improvement</span>
                    </>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
