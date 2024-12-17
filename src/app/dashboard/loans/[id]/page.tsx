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
import { Separator } from "@/components/ui/separator";
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
    include: {
      eligibility: true,
      emiPayments: true,
    },
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
        <h1 className="text-2xl font-bold mb-4">Loan Not Found</h1>
        <p>The requested loan application could not be found.</p>
        <Link href="/dashboard/loans">
          <Button variant="outline" className="mt-4">
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/loans">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loans
          </Button>
        </Link>
        <Card className="overflow-hidden shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">
                  {loan.prpseOfLoan}
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Application ID: {loan.id}
                </CardDescription>
              </div>
              <Badge
                className={`text-sm px-3 py-1 rounded-full ${statusColor}`}
              >
                {loan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">
                  Applicant Details
                </h3>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Full Name:</span>
                  <span className="ml-auto font-semibold">{loan.fullName}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Phone Number:</span>
                  <span className="ml-auto font-semibold">{loan.phoneNo}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Aadhar Number:</span>
                  <span className="ml-auto font-semibold">{loan.aadharNo}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">PAN Number:</span>
                  <span className="ml-auto font-semibold">{loan.panNo}</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Loan Details</h3>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Amount Required:</span>
                  <span className="ml-auto font-semibold">
                    ₹{parseFloat(loan.amtRequired).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Employment Type:</span>
                  <span className="ml-auto font-semibold">{loan.empType}</span>
                </div>
                <div className="flex items-center">
                  <Wallet className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Monthly Income:</span>
                  <span className="ml-auto font-semibold">
                    ₹{parseFloat(loan.monIncome).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Credit Score:</span>
                  <span className="ml-auto font-semibold">
                    {loan.creditScore}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 p-6">
            <div className="w-full text-center">
              <p className="text-sm text-gray-500">
                Application submitted on{" "}
                {new Date(loan.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardFooter>
        </Card>

        {loan.approvedAmount && (
          <Card className="overflow-hidden shadow-lg mb-6">
            <CardHeader className="bg-green-500 text-white p-6">
              <CardTitle className="text-2xl font-bold">
                Approval Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-green-100 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2 text-green-800">
                  Approved Amount
                </h3>
                <div className="text-4xl font-bold text-green-600">
                  ₹{loan.approvedAmount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loan.rateOfInterest && (
                  <div className="flex items-center">
                    <Percent className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="ml-auto font-semibold">
                      {loan.rateOfInterest}%
                    </span>
                  </div>
                )}
                {loan.tenure && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Loan Tenure:</span>
                    <span className="ml-auto font-semibold">
                      {loan.tenure} months
                    </span>
                  </div>
                )}
                {loan.emi && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Monthly EMI:</span>
                    <span className="ml-auto font-semibold">
                      ₹{loan.emi.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isEMIPaymentDue() && (
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-blue-500 text-white p-6">
              <CardTitle className="text-2xl font-bold">EMI Payment</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4">
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
