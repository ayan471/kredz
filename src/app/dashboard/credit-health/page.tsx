import { auth } from "@clerk/nextjs/server";
import { getCreditScoreData, getUserSubscription } from "@/actions/formActions";
import CreditScoreGauge from "./CreditScoreGauge";
import CreditFactorCard from "./CreditFactorCard";
import MonthlyCreditFactors from "./MonthlyCreditFactors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WelcomeMessage from "./WelcomeMessage";

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

interface CreditData {
  id: string;
  step: number;
  userId: string;
  fullName: string | null;
  phoneNo: string | null;
  createdAt: Date;
  updatedAt: Date;
  panNo: string | null;
  aadharNo: string | null;
  creditScore: string | null;
}

interface Subscription {
  id: string;
  userId: string;
  fullName: string;
  phoneNo: string;
  plan: string;
  createdAt: Date;
  expiryDate: Date | null;
  updatedAt: Date;
  creditHealth: string | null;
  monthlyHealthData: string | null;
}

export default async function CreditScoreDashboard() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let creditData: CreditData | null = null;
  let subscription: Subscription | null = null;
  let parsedMonthlyHealthData: Record<string, any> = {};

  try {
    creditData = await getCreditScoreData(userId);
    subscription = await getUserSubscription(userId);

    console.log("Credit Data:", creditData);
    console.log("Subscription:", subscription);

    if (subscription?.monthlyHealthData) {
      try {
        parsedMonthlyHealthData = JSON.parse(subscription.monthlyHealthData);
        console.log("Parsed Monthly Health Data:", parsedMonthlyHealthData);
      } catch (error) {
        console.error("Error parsing monthlyHealthData:", error);
      }
    } else {
      console.log("No monthly health data found in subscription");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const getLatestData = () => {
    if (Object.keys(parsedMonthlyHealthData).length > 0) {
      const latestMonth = Object.keys(parsedMonthlyHealthData).sort().pop();
      const latestData = parsedMonthlyHealthData[latestMonth ?? ""];
      return {
        score:
          latestData?.creditScore ?? parseInt(creditData?.creditScore || "0"),
        poweredBy: latestData?.poweredBy ?? "CRIF",
      };
    }
    return {
      score: parseInt(creditData?.creditScore || "0"),
      poweredBy: "CRIF",
    };
  };

  const { score, poweredBy } = getLatestData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Credit Score Dashboard
          </h1>
          {creditData?.fullName && (
            <WelcomeMessage userName={creditData.fullName} />
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-200">
                Your Credit Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6">
              <div className="w-64 h-64">
                <CreditScoreGauge score={score} />
              </div>
              <p className="text-center text-slate-400 max-w-md">
                {score > 740
                  ? "Excellent job! Your credit score is in great shape. Keep up the good work!"
                  : "There's room for improvement in your credit score. Let's work on boosting it!"}
              </p>
              {creditData?.updatedAt && (
                <p className="text-sm text-slate-500">
                  Last updated:{" "}
                  {new Date(creditData.updatedAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-200">
                Credit Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription && (
                <MonthlyCreditFactors
                  monthlyHealthData={parsedMonthlyHealthData}
                  startDate={new Date(subscription.createdAt)}
                  expiryDate={
                    subscription.expiryDate
                      ? new Date(subscription.expiryDate)
                      : null
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>

        <footer className="text-center text-slate-500 text-sm mt-8">
          <p>Powered by {poweredBy}</p>
        </footer>
      </div>
    </div>
  );
}
