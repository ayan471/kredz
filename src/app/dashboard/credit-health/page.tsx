import { ThumbsUp, ArrowRight, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CreditScoreDashboard() {
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
              {/* Red segment */}
              <div
                className="absolute inset-0 rounded-t-full border-[16px] border-b-0 border-red-400"
                style={{ clipPath: "polygon(0 0, 20% 0, 20% 100%, 0% 100%)" }}
              />

              {/* Score display */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-20%] text-center">
                <div className="text-5xl font-bold">0</div>
                <div className="text-red-500 text-sm mt-1">Very Poor</div>
                <div className="text-xs text-gray-500">300-619</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-gray-500">
            <p>Last update: 20-06-2023</p>
            <p>
              <span className="font-semibold text-black">Swagato Show</span>{" "}
              <span>
                it seems you have scope to improve your overall credit score.
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <span>Powered by</span>
            <img src="/placeholder.svg" alt="CRIF Logo" className="h-6" />
          </div>
        </section>

        {/* Scoring Factors Section */}
        <section className="text-center space-y-4">
          <h2 className="text-[#000080] text-3xl font-bold">
            Your Scoring Factors
          </h2>
          <p className="text-xl font-semibold">
            Below are the factors that are affecting your credit score.
          </p>

          <div className="relative w-[300px] h-[150px] mx-auto">
            <div className="relative w-full h-full">
              {/* Semi-circular gauge similar to above but with different segments */}
              <div className="absolute inset-0 rounded-t-full border-[16px] border-b-0 border-gray-200" />
              <div
                className="absolute inset-0 rounded-t-full border-[16px] border-b-0 border-orange-400"
                style={{
                  clipPath: "polygon(40% 0, 50% 0, 50% 100%, 40% 100%)",
                }}
              />
            </div>
          </div>

          <p className="text-gray-500">
            CRIF has not shared any scoring factor for this report.
          </p>
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
            {/* CUR Card */}
            <Card className="p-4 space-y-4">
              <h3 className="text-[#000080] text-xl font-bold">CUR</h3>
              <div className="text-green-500 text-2xl font-bold">0%</div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-0 bg-green-500 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                  Very Good
                </span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <ThumbsUp className="w-4 h-4" />
                <span>Excellent</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Card>

            {/* Credit Behavior Card */}
            <Card className="p-4 space-y-4">
              <h3 className="text-[#000080] text-xl font-bold">
                Credit Behavior
              </h3>
              <div className="text-green-500 text-2xl font-bold">0%</div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-0 bg-green-500 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                  Very Good
                </span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <ThumbsUp className="w-4 h-4" />
                <span>Excellent</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Card>

            {/* Payment History Card */}
            <Card className="p-4 space-y-4">
              <h3 className="text-[#000080] text-xl font-bold">
                Payment History
              </h3>
              <div className="text-red-500 text-2xl font-bold">-1%</div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[1%] bg-red-500 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">
                  Very Poor
                </span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span>Need Improvement</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Card>

            {/* Age of Credit Card */}
            <Card className="p-4 space-y-4">
              <h3 className="text-[#000080] text-xl font-bold">
                Age of Credit
              </h3>
              <div className="text-red-500 text-2xl font-bold">0 Months</div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-0 bg-red-500 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">
                  Very Poor
                </span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span>Need Improvement</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
