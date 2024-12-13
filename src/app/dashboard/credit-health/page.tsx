import { auth } from "@clerk/nextjs/server";
import { getCreditScoreData, getUserSubscription } from "@/actions/formActions";
import CreditScoreGauge from "./CreditScoreGauge";
import CreditFactorCard from "./CreditFactorCard";
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
  currEmis: string | null;
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
}

export default async function CreditScoreDashboard() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let creditData: CreditData | null = null;
  let subscription: Subscription | null = null;
  let parsedCreditHealth: CreditHealthFactor[] = [];

  try {
    creditData = await getCreditScoreData(userId);
    subscription = await getUserSubscription(userId);

    console.log("Credit Data:", creditData);
    console.log("Subscription:", subscription);

    if (subscription?.creditHealth) {
      try {
        parsedCreditHealth = JSON.parse(subscription.creditHealth);
        console.log("Parsed Credit Health:", parsedCreditHealth);
      } catch (error) {
        console.error("Error parsing creditHealth:", error);
      }
    } else {
      console.log("No credit health data found in subscription");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const score = parseInt(creditData?.creditScore || "0");

  const creditHealthFactors: CreditHealthFactor[] = [
    {
      name: "Credit Utilization",
      score:
        parsedCreditHealth.find((f) => f.name === "Credit Utilization")
          ?.score || 0,
    },
    {
      name: "Payment History",
      score:
        parsedCreditHealth.find((f) => f.name === "Payment History")?.score ||
        (score > 0 ? 100 : 0),
    },
    {
      name: "Credit Age",
      score:
        parsedCreditHealth.find((f) => f.name === "Credit Age")?.score || 0,
      details: parsedCreditHealth.find((f) => f.name === "Credit Age")
        ?.details || { years: 0, months: 0, days: 0 },
    },
    {
      name: "Credit Mix",
      score:
        parsedCreditHealth.find((f) => f.name === "Credit Mix")?.score || 0,
    },
    {
      name: "Total Active Accounts",
      score:
        parsedCreditHealth.find((f) => f.name === "Total Active Accounts")
          ?.score || 0,
      details: parsedCreditHealth.find(
        (f) => f.name === "Total Active Accounts"
      )?.details || { count: 0, lenders: "" },
    },
    {
      name: "Delay History",
      score:
        parsedCreditHealth.find((f) => f.name === "Delay History")?.score || 0,
      details: parsedCreditHealth.find((f) => f.name === "Delay History")
        ?.details || { count: 0, lenders: "" },
    },
    {
      name: "No. of Inquiries",
      score:
        parsedCreditHealth.find((f) => f.name === "No. of Inquiries")?.score ||
        0,
      details: parsedCreditHealth.find((f) => f.name === "No. of Inquiries")
        ?.details || { count: 0, lenders: "" },
    },
    {
      name: "Overdue Accounts",
      score:
        parsedCreditHealth.find((f) => f.name === "Overdue Accounts")?.score ||
        0,
      details: parsedCreditHealth.find((f) => f.name === "Overdue Accounts")
        ?.details || { count: 0, lenders: "" },
    },
    {
      name: "Scoring Factors",
      score: 0,
      details: {
        factors:
          parsedCreditHealth.find((f) => f.name === "Scoring Factors")?.details
            ?.factors || "",
      },
    },
    {
      name: "Our Recommendation",
      score: 0,
      details: {
        recommendation:
          parsedCreditHealth.find((f) => f.name === "Our Recommendation")
            ?.details?.recommendation || "",
      },
    },
  ];

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 lg:col-span-2 bg-slate-800 border-slate-700">
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

          <Card className="col-span-1 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-200">
                Credit Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {creditHealthFactors.map((factor: CreditHealthFactor) => (
                <CreditFactorCard key={factor.name} factor={factor} />
              ))}
            </CardContent>
          </Card>
        </div>

        <footer className="text-center text-slate-500 text-sm">
          <p>Powered by CRIF</p>
        </footer>
      </div>
    </div>
  );
}
