import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  DollarSign,
  User,
  FileText,
  Building2,
  ArrowLeft,
  Clock,
  Percent,
  Wallet,
} from "lucide-react";
import EMIPayButton from "../EMIPayButton";

const prisma = new PrismaClient();

async function getLoanDetails(id: string, userId: string) {
  const loan = await prisma.loanApplication.findFirst({
    where: {
      id,
      userId,
    },
    include: { eligibility: true, emiPayments: true },
  });

  if (!loan) {
    return null;
  }

  return loan;
}

export default async function LoanDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const loan = await getLoanDetails(params.id, userId);

  if (!loan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">
          Loan Not Found
        </h1>
        <p className="text-blue-800">
          The requested loan application could not be found.
        </p>
        <Link href="/dashboard/loans">
          <Button
            variant="outline"
            className="mt-4 text-blue-900 border-blue-900 hover:bg-blue-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loans
          </Button>
        </Link>
      </div>
    );
  }

  const statusColor =
    loan.status === "Approved"
      ? "bg-green-100 text-green-800"
      : loan.status === "Rejected"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800";

  const isEMIPaymentDue = () => {
    if (loan.status !== "Approved" || !loan.approvedAmount || !loan.tenure) {
      return false;
    }

    const currentDate = new Date();
    const loanStartDate = new Date(loan.updatedAt);
    const monthsPassed =
      (currentDate.getFullYear() - loanStartDate.getFullYear()) * 12 +
      (currentDate.getMonth() - loanStartDate.getMonth());

    return monthsPassed < loan.tenure && loan.emiPayments.length < loan.tenure;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/loans">
          <Button
            variant="outline"
            className="mb-6 text-blue-900 border-blue-900 hover:bg-blue-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loans
          </Button>
        </Link>
        <Card className="overflow-hidden shadow-lg mb-6 border-orange-300">
          <CardHeader className="bg-orange-500 text-white p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  {loan.prpseOfLoan}
                </CardTitle>
                <CardDescription className="text-orange-100 text-base sm:text-lg">
                  Application ID: {loan.id}
                </CardDescription>
              </div>
              <Badge
                className={`text-sm px-3 py-1 rounded-full ${statusColor} self-start sm:self-auto mt-2 sm:mt-0`}
              >
                {loan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-900">
                  Applicant Details
                </h3>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-blue-800">Full Name:</span>
                  <span className="ml-auto font-semibold text-blue-900">
                    {loan.fullName}
                  </span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-blue-800">Phone Number:</span>
                  <span className="ml-auto font-semibold text-blue-900">
                    {loan.phoneNo}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-blue-800">Aadhar Number:</span>
                  <span className="ml-auto font-semibold text-blue-900">
                    {loan.aadharNo}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-blue-800">PAN Number:</span>
                  <span className="ml-auto font-semibold text-blue-900">
                    {loan.panNo}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-900">
                  Loan Details
                </h3>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-blue-800">Amount Required:</span>
                  <span className="ml-auto font-semibold text-blue-900">
                    ₹
                    {Number.parseFloat(loan.amtRequired).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-blue-800">Employment Type:</span>
                  <span className="ml-auto font-semibold text-blue-900">
                    {loan.empType}
                  </span>
                </div>
                <div className="flex items-center">
                  <Wallet className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-blue-800">Monthly Income:</span>
                  <span className="ml-auto font-semibold text-blue-900">
                    ₹{Number.parseFloat(loan.monIncome).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-blue-800">Credit Score:</span>
                  <span className="ml-auto font-semibold text-blue-900">
                    {loan.creditScore}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-orange-50 p-6">
            <div className="w-full text-center">
              <p className="text-sm text-blue-800">
                Application submitted on{" "}
                {new Date(loan.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardFooter>
        </Card>

        {loan.approvedAmount && (
          <Card className="overflow-hidden shadow-lg mb-6 border-orange-300">
            <CardHeader className="bg-blue-900 text-white p-6">
              <CardTitle className="text-2xl font-bold">
                Approval Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="bg-blue-100 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2 text-blue-900">
                  Approved Amount
                </h3>
                <div className="text-4xl font-bold text-blue-900">
                  ₹{loan.approvedAmount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loan.rateOfInterest && (
                  <div className="flex items-center">
                    <Percent className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-blue-800">Interest Rate:</span>
                    <span className="ml-auto font-semibold text-blue-900">
                      {loan.rateOfInterest}%
                    </span>
                  </div>
                )}
                {loan.tenure && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-blue-800">Loan Tenure:</span>
                    <span className="ml-auto font-semibold text-blue-900">
                      {loan.tenure} months
                    </span>
                  </div>
                )}
                {loan.emi && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-blue-800">Monthly EMI:</span>
                    <span className="ml-auto font-semibold text-blue-900">
                      ₹{loan.emi.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {loan.status === "Rejected" && loan.rejectionReason && (
          <Card className="overflow-hidden shadow-lg mb-6 border-orange-300">
            <CardHeader className="bg-red-500 text-white p-6">
              <CardTitle className="text-2xl font-bold">
                Rejection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="bg-red-100 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2 text-red-800">
                  Reason for Rejection
                </h3>
                <div className="text-lg text-red-600">
                  {loan.rejectionReason}
                </div>
              </div>
              <div className="mt-4">
                <Link href="/credit-builder">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Buy Credit Builder Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {isEMIPaymentDue() && (
          <Card className="overflow-hidden shadow-lg border-orange-300">
            <CardHeader className="bg-blue-900 text-white p-6">
              <CardTitle className="text-2xl font-bold">EMI Payment</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <p className="mb-4 text-blue-800">
                Your next EMI payment is due. Please pay to avoid late fees.
              </p>
              <EMIPayButton
                loanId={loan.id}
                emiAmount={loan.emi || 0}
                emiPaymentLink={loan.emiPaymentLink}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
