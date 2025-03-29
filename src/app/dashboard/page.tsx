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
  Zap,
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

function formatCurrency(amount: number | string | null) {
  if (!amount) return "₹0";
  const numAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return `₹${numAmount.toLocaleString("en-IN")}`;
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

  // Fetch the latest credit builder loan application
  const creditBuilderLoan = await prisma.creditBuilderLoanApplication.findFirst(
    {
      where: {
        userId,
      },
      orderBy: { createdAt: "desc" },
    }
  );

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
    creditBuilderLoan,
  };
}

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { loanApplication, creditBuilderSubscription, creditBuilderLoan } =
    await getUserData(userId);

  // Helper function to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        <header className="text-center py-4 sm:py-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-blue-900">
            Your Financial Dashboard
          </h1>
          <p className="text-sm sm:text-base text-blue-700">
            Track your loan applications and credit builder progress
          </p>
        </header>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Regular Loan Application Card */}
          <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl border-orange-300 bg-orange-50">
            <CardHeader className="bg-orange-500 text-white p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" />
                Loan Application
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loanApplication ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-orange-800">
                      {loanApplication.status === "Approved"
                        ? "Approved Amount:"
                        : "Amount Requested:"}
                    </span>
                    <span className="text-lg sm:text-2xl font-bold text-orange-600">
                      ₹
                      {loanApplication.status === "Approved"
                        ? loanApplication.approvedAmount ||
                          loanApplication.amtRequired
                        : loanApplication.amtRequired}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-orange-800">
                      Status:
                    </span>
                    <Badge
                      variant={
                        loanApplication.status === "Approved"
                          ? "success"
                          : "secondary"
                      }
                      className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-100 text-orange-800"
                    >
                      {loanApplication.status}
                    </Badge>
                  </div>
                  <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-orange-200">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-orange-800">
                      Next Steps
                    </h3>
                    <p className="text-xs sm:text-sm text-orange-700">
                      {loanApplication.status === "Approved"
                        ? "Congratulations! Your loan has been approved. We'll contact you shortly with further details."
                        : "Your application is being processed. We'll update you on any progress."}
                    </p>
                    <div className="mt-3 text-center">
                      <Link href={`/dashboard/loans/${loanApplication.id}`}>
                        <button className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 sm:py-8">
                  <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm text-orange-700">
                    No completed loan application found
                  </p>
                  <Link href={"/consultancy-application"}>
                    <button className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                      Start Application
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credit Builder Loan Application Card */}
          <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl border-purple-300 bg-purple-50">
            <CardHeader className="bg-purple-600 text-white p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
                Credit Builder Loan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {creditBuilderLoan ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-purple-800">
                      {creditBuilderLoan.status === "Approved"
                        ? "Approved Amount:"
                        : "Amount Requested:"}
                    </span>
                    <span className="text-lg sm:text-2xl font-bold text-purple-600">
                      {formatCurrency(creditBuilderLoan.loanAmountRequired)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-purple-800">
                      Purpose:
                    </span>
                    <span className="text-xs sm:text-sm text-purple-800">
                      {creditBuilderLoan.purpose}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-purple-800">
                      Status:
                    </span>
                    <Badge
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${getStatusColor(
                        creditBuilderLoan.status ?? ""
                      )}`}
                    >
                      {creditBuilderLoan.status}
                    </Badge>
                  </div>
                  <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-purple-200">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-purple-800">
                      Application Details
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-700">
                      {creditBuilderLoan.status === "Approved"
                        ? "Your credit builder loan has been approved! Check the details to see your EMI schedule."
                        : creditBuilderLoan.status === "Rejected"
                          ? "Unfortunately, your application was not approved at this time."
                          : "Your application is being reviewed. We'll update you soon."}
                    </p>
                    <div className="mt-3 text-center">
                      <Link
                        href={`/dashboard/credit-builder-loan/${creditBuilderLoan.id}`}
                      >
                        <button className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 sm:py-8">
                  <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm text-purple-700">
                    No credit builder loan application found
                  </p>
                  <Link href={"/dashboard/credit-builder-loan/apply"}>
                    <button className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                      Apply Now
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credit Builder Subscription Card */}
          <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl border-blue-300 bg-blue-50 md:col-span-2 lg:col-span-1">
            <CardHeader className="bg-blue-900 text-white p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                Credit Builder Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {creditBuilderSubscription ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-blue-900">
                      Current Plan:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-900 border-blue-300"
                    >
                      {creditBuilderSubscription.plan}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-blue-900">
                      Subscribed on:
                    </span>
                    <span className="flex items-center gap-1 text-xs sm:text-sm text-blue-800">
                      <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      {formatDate(creditBuilderSubscription.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-blue-900">
                      Expires on:
                    </span>
                    <span className="flex items-center gap-1 text-xs sm:text-sm text-blue-800">
                      <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      {formatDate(creditBuilderSubscription.expiryDate)}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-blue-200">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-blue-900">
                      Subscription Benefits
                    </h3>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-blue-800">
                      <li>Regular credit score updates</li>
                      <li>Personalized credit improvement tips</li>
                      <li>Access to financial education resources</li>
                    </ul>
                    <div className="mt-3 text-center">
                      <Link href={"/credit-builder-dashboard"}>
                        <button className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800 transition-colors">
                          View Dashboard
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 sm:py-8">
                  <CreditCard className="h-8 w-8 sm:h-12 sm:w-12 text-blue-900 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm text-blue-800">
                    No active subscription found
                  </p>
                  <Link href={"/credit-builder-plan"}>
                    <button className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
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
