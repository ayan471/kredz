import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  Calendar,
  User,
  Phone,
  FileText,
  DollarSign,
  Briefcase,
  PieChart,
  ArrowRight,
  TypeIcon as type,
  LucideIcon,
} from "lucide-react";
import { getUserMembership } from "@/actions/loanApplicationActions";

interface LoanApplication {
  membershipPlan: string;
  createdAt: string;
  fullName: string;
  phoneNo: string;
  panNo: string;
  aadharNo: string;
  amtRequired: string;
  prpseOfLoan: string;
  creditScore: string;
  currEmis: string | null;
  empType: string;
  monIncome: string;
  EmpOthers?: string;
  status: string;
  expiryDate: string;
}

interface InfoItemProps {
  icon?: LucideIcon;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start space-x-3">
      {Icon && <Icon className="w-5 h-5 text-indigo-500 mt-0.5" />}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function calculateExpiryDate(startDate: string, plan: string): Date {
  const start = new Date(startDate);
  const monthsToAdd =
    plan === "Bronze"
      ? 3
      : plan === "Silver"
        ? 6
        : plan === "Gold"
          ? 9
          : plan === "Platinum"
            ? 12
            : 0;

  return new Date(start.setMonth(start.getMonth() + monthsToAdd));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default async function MembershipPage() {
  const { userId } = auth();
  if (!userId) {
    console.log("No user ID found, redirecting to sign-in");
    redirect("/sign-in");
  }

  console.log("Fetching membership for user ID:", userId);
  const loanApplication = (await getUserMembership(
    userId
  )) as LoanApplication | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-900 mb-12">
          My Membership
        </h1>
        {loanApplication && loanApplication.membershipPlan ? (
          <div className="space-y-8">
            <Card className="overflow-hidden shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl font-bold text-white">
                    {loanApplication.membershipPlan} Plan
                  </CardTitle>
                  <BadgeCheck className="w-12 h-12 text-yellow-300" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <InfoItem
                    icon={Calendar}
                    label="Start Date"
                    value={formatDate(loanApplication.createdAt)}
                  />
                  <InfoItem
                    icon={Calendar}
                    label="Expiry Date"
                    value={
                      loanApplication.expiryDate
                        ? formatDate(loanApplication.expiryDate)
                        : formatDate(
                            calculateExpiryDate(
                              loanApplication.createdAt,
                              loanApplication.membershipPlan
                            ).toISOString()
                          )
                    }
                  />
                  <InfoItem
                    icon={User}
                    label="Full Name"
                    value={loanApplication.fullName}
                  />
                  <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={loanApplication.phoneNo}
                  />
                  <InfoItem
                    icon={FileText}
                    label="PAN"
                    value={loanApplication.panNo}
                  />
                  <InfoItem
                    icon={FileText}
                    label="Aadhar"
                    value={loanApplication.aadharNo}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                  <CardTitle className="text-xl text-blue-700 flex items-center space-x-2">
                    <DollarSign className="w-6 h-6" />
                    <span>Loan Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <InfoItem
                      label="Amount Required"
                      value={`₹${parseInt(loanApplication.amtRequired).toLocaleString()}`}
                    />
                    <InfoItem
                      label="Purpose"
                      value={loanApplication.prpseOfLoan}
                    />
                    <InfoItem
                      label="Credit Score"
                      value={loanApplication.creditScore}
                    />
                    <InfoItem
                      label="Current EMIs"
                      value={loanApplication.currEmis || "N/A"}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-green-50 border-b border-green-100">
                  <CardTitle className="text-xl text-green-700 flex items-center space-x-2">
                    <Briefcase className="w-6 h-6" />
                    <span>Employment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <InfoItem
                      label="Employment Type"
                      value={loanApplication.empType}
                    />
                    <InfoItem
                      label="Monthly Income"
                      value={`₹${parseInt(loanApplication.monIncome).toLocaleString()}`}
                    />
                    {loanApplication.EmpOthers && (
                      <InfoItem
                        label="Additional Info"
                        value={loanApplication.EmpOthers}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader className="bg-purple-50 border-b border-purple-100">
                <CardTitle className="text-xl text-purple-700 flex items-center space-x-2">
                  <PieChart className="w-6 h-6" />
                  <span>Loan Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current Status</p>
                    <Badge variant="outline" className="text-lg font-semibold">
                      {loanApplication.status}
                    </Badge>
                  </div>
                  <Button asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2"
                    >
                      <span>View Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-md mx-auto shadow-xl">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="w-12 h-12 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  No Active Membership
                </h2>
                <p className="text-gray-600">
                  You don't have an active membership or loan application.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link
                    href="/consultancy-application"
                    className="flex items-center justify-center space-x-2"
                  >
                    <span>Apply for Loan</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
