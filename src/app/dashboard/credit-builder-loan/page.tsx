import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  CreditCardIcon,
  BanknoteIcon as BanknotesIcon,
  UserIcon,
} from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUserLoans(userId: string) {
  return await prisma.creditBuilderLoanApplication.findMany({
    where: {
      userId,
      status: {
        not: "Incomplete",
      },
    },

    orderBy: { createdAt: "desc" },
  });
}

export default async function LoansPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const loans = await getUserLoans(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-900">My Loans</h1>
        {loans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loans.map((loan) => (
              <Link
                href={`/dashboard/credit-builder-loan/${loan.id}`}
                key={loan.id}
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border-orange-300">
                  <CardHeader className="bg-orange-500 text-white p-4">
                    <CardTitle className="text-xl font-semibold mb-1">
                      {loan.purpose}
                    </CardTitle>
                    <CardDescription className="text-orange-100 text-sm">
                      Application ID: {loan.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 bg-white">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-800">
                          <BanknotesIcon className="h-5 w-5 text-orange-500 mr-2" />
                          <span className="text-sm font-medium">Amount:</span>
                        </div>
                        <span className="text-sm font-bold text-blue-900">
                          ₹
                          {Number.parseFloat(
                            loan.loanAmountRequired?.toString() || "0"
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-800">
                          <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
                          <span className="text-sm font-medium">
                            Applied on:
                          </span>
                        </div>
                        <span className="text-sm font-medium text-blue-900">
                          {new Date(loan.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      {loan.dateOfBirth && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-blue-800">
                            <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
                            <span className="text-sm font-medium">DOB:</span>
                          </div>
                          <span className="text-sm font-medium text-blue-900">
                            {new Date(loan.dateOfBirth).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      )}
                      {loan.age !== null && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-blue-800">
                            <UserIcon className="h-5 w-5 text-orange-500 mr-2" />
                            <span className="text-sm font-medium">Age:</span>
                          </div>
                          <span className="text-sm font-medium text-blue-900">
                            {loan.age} years
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-orange-50 p-4">
                    <Badge
                      variant={
                        loan.status === "Approved"
                          ? "success"
                          : loan.status === "Rejected"
                            ? "destructive"
                            : "default"
                      }
                      className="w-full justify-center text-center py-2 text-sm font-semibold"
                    >
                      {loan.status}
                    </Badge>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-white border border-orange-200 shadow-md">
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-blue-800 text-lg">
                You have no completed loan applications.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
