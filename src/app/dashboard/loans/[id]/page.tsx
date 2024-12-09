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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  CreditCardIcon,
  BanknotesIcon,
  UserIcon,
  IdentificationIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

const prisma = new PrismaClient();

async function getLoanDetails(id: string, userId: string) {
  const loan = await prisma.loanApplication.findFirst({
    where: {
      id,
      userId,
    },
    include: { eligibility: true },
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
            &larr; Back to Loans
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard/loans">
        <Button variant="outline" className="mb-6">
          &larr; Back to Loans
        </Button>
      </Link>
      <Card className="overflow-hidden max-w-3xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <CardTitle className="text-2xl font-bold">
            {loan.prpseOfLoan}
          </CardTitle>
          <CardDescription className="text-blue-100">
            Application ID: {loan.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <BanknotesIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600 text-sm">Amount Required:</span>
                <span className="ml-auto font-semibold">
                  ₹{parseFloat(loan.amtRequired || "0").toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600 text-sm">Application Date:</span>
                <span className="ml-auto font-semibold">
                  {new Date(loan.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600 text-sm">Full Name:</span>
                <span className="ml-auto font-semibold">{loan.fullName}</span>
              </div>
              <div className="flex items-center">
                <IdentificationIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600 text-sm">Phone Number:</span>
                <span className="ml-auto font-semibold">{loan.phoneNo}</span>
              </div>
            </div>
            <div className="flex items-center">
              <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-600 text-sm">Status:</span>
              <Badge
                variant={
                  loan.status === "Approved"
                    ? "success"
                    : loan.status === "Rejected"
                      ? "destructive"
                      : "default"
                }
                className="ml-auto"
              >
                {loan.status}
              </Badge>
            </div>
            {loan.eligibility && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600 text-sm">EMI Tenure:</span>
                  <span className="ml-auto font-semibold">
                    {loan.eligibility.emiTenure} months
                  </span>
                </div>
                {loan.eligibility.loanEligibility && (
                  <div className="flex items-center">
                    <BuildingLibraryIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600 text-sm">
                      Loan Eligibility:
                    </span>
                    <span className="ml-auto font-semibold">
                      ₹
                      {loan.eligibility.loanEligibility.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            )}
            {loan.approvedAmount && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <BanknotesIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600 text-sm">
                    Approved Amount:
                  </span>
                  <span className="ml-auto font-semibold">
                    ₹{loan.approvedAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                {loan.rateOfInterest && (
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600 text-sm">
                      Interest Rate:
                    </span>
                    <span className="ml-auto font-semibold">
                      {loan.rateOfInterest}%
                    </span>
                  </div>
                )}
              </div>
            )}
            {loan.tenure && (
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600 text-sm">Loan Tenure:</span>
                <span className="ml-auto font-semibold">
                  {loan.tenure} months
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
