import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  CreditCard,
  IndianRupee,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

function formatDate(date: Date | null) {
  if (!date) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getUserData(userId: string) {
  const loanApplication = (await prisma.loanApplication.findFirst({
    where: {
      userId,
      status: {
        not: "Incomplete",
      },
    },
    orderBy: { createdAt: "desc" },
  })) as {
    id: string;
    userId: string;
    fullName: string;
    phoneNo: string;
    amtRequired: string;
    prpseOfLoan: string;
    aadharImgFrontUrl: string | null;
    aadharImgBackUrl: string | null;
    aadharNo: string;
    status: string;
    approvedAmount?: string;
  } | null;

  // Only fetch active subscriptions (where isActive is true)
  const creditBuilderSubscription =
    await prisma.creditBuilderSubscription.findFirst({
      where: {
        userId,
        isActive: true, // Only get active subscriptions
      },
      orderBy: { createdAt: "desc" },
    });

  return {
    loanApplication,
    creditBuilderSubscription,
  };
}

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { loanApplication, creditBuilderSubscription } =
    await getUserData(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">
            Your Financial Dashboard
          </h1>
          <p className="text-blue-700">
            Track your loan application and credit builder progress
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl border-orange-300 bg-orange-50">
            <CardHeader className="bg-orange-500 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <IndianRupee className="h-6 w-6" />
                Loan Application
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loanApplication ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-orange-800">
                      {loanApplication.status === "Approved"
                        ? "Approved Amount:"
                        : "Amount Requested:"}
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹
                      {loanApplication.status === "Approved"
                        ? loanApplication.approvedAmount ||
                          loanApplication.amtRequired
                        : loanApplication.amtRequired}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-orange-800">
                      Status:
                    </span>
                    <Badge
                      variant={
                        loanApplication.status === "Approved"
                          ? "success"
                          : "secondary"
                      }
                      className="text-sm px-3 py-1 bg-orange-100 text-orange-800"
                    >
                      {loanApplication.status}
                    </Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <h3 className="text-lg font-semibold mb-2 text-orange-800">
                      Next Steps
                    </h3>
                    <p className="text-sm text-orange-700">
                      {loanApplication.status === "Approved"
                        ? "Congratulations! Your loan has been approved. We'll contact you shortly with further details."
                        : "Your application is being processed. We'll update you on any progress."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <p className="text-orange-700">
                    No completed loan application found
                  </p>
                  <Link href={"/consultancy-application"}>
                    <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                      Start Application
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl border-blue-300 bg-blue-50">
            <CardHeader className="bg-blue-900 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Credit Builder Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {creditBuilderSubscription ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">
                      Current Plan:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-900 border-blue-300"
                    >
                      {creditBuilderSubscription.plan}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">
                      Subscribed on:
                    </span>
                    <span className="flex items-center gap-1 text-blue-800">
                      <CalendarIcon className="h-4 w-4" />
                      {formatDate(creditBuilderSubscription.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">
                      Expires on:
                    </span>
                    <span className="flex items-center gap-1 text-blue-800">
                      <CalendarIcon className="h-4 w-4" />
                      {formatDate(creditBuilderSubscription.expiryDate)}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <h3 className="text-lg font-semibold mb-2 text-blue-900">
                      Subscription Benefits
                    </h3>
                    <ul className="list-disc list-inside text-sm text-blue-800">
                      <li>Regular credit score updates</li>
                      <li>Personalized credit improvement tips</li>
                      <li>Access to financial education resources</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-blue-900 mx-auto mb-4" />
                  <p className="text-blue-800">No active subscription found</p>
                  <Link href={"/credit-builder-plan"}>
                    <button className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
                      Explore Plans
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
