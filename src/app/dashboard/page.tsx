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
  } | null;

  const creditBuilderSubscription =
    await prisma.creditBuilderSubscription.findFirst({
      where: { userId },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6 space-y-8">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
            Your Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your loan application and credit builder progress
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-400 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <IndianRupee className="h-6 w-6" />
                Loan Application
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loanApplication ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Amount Requested:
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{loanApplication.amtRequired}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <Badge
                      variant={
                        loanApplication.status === "Approved"
                          ? "success"
                          : "secondary"
                      }
                      className="text-sm px-3 py-1"
                    >
                      {loanApplication.status}
                    </Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                      Next Steps
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {loanApplication.status === "Approved"
                        ? "Congratulations! Your loan has been approved. We'll contact you shortly with further details."
                        : "Your application is being processed. We'll update you on any progress."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No completed loan application found
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Start Application
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-400 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Credit Builder Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {creditBuilderSubscription ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Current Plan:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-sm px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300"
                    >
                      {creditBuilderSubscription.plan}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Subscribed on:
                    </span>
                    <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                      <CalendarIcon className="h-4 w-4" />
                      {formatDate(creditBuilderSubscription.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Expires on:
                    </span>
                    <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                      <CalendarIcon className="h-4 w-4" />
                      {formatDate(creditBuilderSubscription.expiryDate)}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                      Subscription Benefits
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                      <li>Regular credit score updates</li>
                      <li>Personalized credit improvement tips</li>
                      <li>Access to financial education resources</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No active subscription found
                  </p>
                  <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                    Explore Plans
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
