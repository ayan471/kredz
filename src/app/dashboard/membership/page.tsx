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
  type LucideIcon,
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
  membershipActive: boolean;
  membershipActivationDate: string | null;
}

interface InfoItemProps {
  icon?: LucideIcon;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start space-x-3">
      {Icon && <Icon className="w-5 h-5 text-orange-500 mt-0.5" />}
      <div>
        <p className="text-sm font-medium text-blue-700">{label}</p>
        <p className="text-base font-semibold text-blue-900">{value}</p>
      </div>
    </div>
  );
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-12">
          My Membership
        </h1>
        {loanApplication && loanApplication.membershipPlan ? (
          <div className="space-y-8">
            <Card className="overflow-hidden shadow-xl border-orange-300">
              <CardHeader className="bg-orange-500 p-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl font-bold text-white">
                    {loanApplication.membershipPlan} Plan
                  </CardTitle>
                  <BadgeCheck className="w-12 h-12 text-blue-900" />
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="grid grid-cols-2 gap-6">
                  <InfoItem
                    icon={Calendar}
                    label="Start Date"
                    value={formatDate(loanApplication.createdAt)}
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
                  <InfoItem
                    icon={BadgeCheck}
                    label="Membership Status"
                    value={
                      loanApplication.membershipActive ? "Active" : "Inactive"
                    }
                  />
                  {loanApplication.membershipActivationDate && (
                    <InfoItem
                      icon={Calendar}
                      label="Activation Date"
                      value={formatDate(
                        loanApplication.membershipActivationDate
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg border-orange-300">
                <CardHeader className="bg-blue-900 border-b border-orange-300">
                  <CardTitle className="text-xl text-white flex items-center space-x-2">
                    <DollarSign className="w-6 h-6" />
                    <span>Loan Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="space-y-4">
                    <InfoItem
                      label="Amount Required"
                      value={`₹${Number.parseInt(loanApplication.amtRequired).toLocaleString()}`}
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

              <Card className="shadow-lg border-orange-300">
                <CardHeader className="bg-blue-900 border-b border-orange-300">
                  <CardTitle className="text-xl text-white flex items-center space-x-2">
                    <Briefcase className="w-6 h-6" />
                    <span>Employment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="space-y-4">
                    <InfoItem
                      label="Employment Type"
                      value={loanApplication.empType}
                    />
                    <InfoItem
                      label="Monthly Income"
                      value={`₹${Number.parseInt(loanApplication.monIncome).toLocaleString()}`}
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

            <Card className="shadow-lg border-orange-300">
              <CardHeader className="bg-blue-900 border-b border-orange-300">
                <CardTitle className="text-xl text-white flex items-center space-x-2">
                  <PieChart className="w-6 h-6" />
                  <span>Loan Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 mb-1">Current Status</p>
                    <Badge
                      variant={
                        loanApplication.membershipActive
                          ? "success"
                          : "secondary"
                      }
                      className="text-lg font-semibold bg-orange-500 text-white"
                    >
                      {loanApplication.membershipActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Button
                    asChild
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2"
                    >
                      <span>View Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  {!loanApplication.membershipActive && (
                    <Button
                      asChild
                      className="mt-4 bg-blue-900 hover:bg-blue-800 text-white"
                    >
                      <Link
                        href="/consultancy-application"
                        className="flex items-center space-x-2"
                      >
                        <span>Activate Membership</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-md mx-auto shadow-xl border-orange-300">
            <CardContent className="p-8 bg-white">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="w-12 h-12 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900">
                  No Active Membership
                </h2>
                <p className="text-blue-700">
                  You don't have an active membership or loan application.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
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
