import { auth } from "@clerk/nextjs/server";

import MonthlyScoreSelector from "./MonthlyScoreSelector";
import MonthlyCreditFactors from "./MonthlyCreditFactors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WelcomeMessage from "./WelcomeMessage";
import { getCreditScoreData, getUserSubscription } from "@/actions/formActions";

interface CreditScoreData {
  userId: string;
  id: string;
  fullName: string | null;
  email: string | null;
  phoneNo: string | null;
  aadharNo: string | null;
  panNo: string | null;
  creditScore: string | null;
  step: number;
  createdAt: Date;
  updatedAt: Date;
  poweredBy: string;
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

  let creditScoreData: CreditScoreData | null = null;
  let subscription: Subscription | null = null;
  let parsedMonthlyHealthData: Record<string, any> = {};

  try {
    creditScoreData = await getCreditScoreData(userId);
    subscription = await getUserSubscription(userId);

    console.log("Credit Score Data:", creditScoreData);
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

  const score = parseInt(creditScoreData?.creditScore || "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Credit Score Dashboard
          </h1>
          {creditScoreData?.fullName && (
            <WelcomeMessage userName={creditScoreData.fullName} />
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 lg:col-span-2 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-200 text-center">
                Your Credit Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6">
              <MonthlyScoreSelector
                monthlyHealthData={parsedMonthlyHealthData}
                startDate={
                  subscription ? new Date(subscription.createdAt) : new Date()
                }
                expiryDate={
                  subscription?.expiryDate
                    ? new Date(subscription.expiryDate)
                    : null
                }
                currentScore={score}
                currentPoweredBy={creditScoreData?.poweredBy || ""}
              />
            </CardContent>
          </Card>

          <Card className="col-span-1 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-200">
                Monthly Credit Factors
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
      </div>
    </div>
  );
}
