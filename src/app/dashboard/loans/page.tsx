import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  CreditCardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUserLoans(userId: string) {
  return await prisma.loanApplication.findMany({
    where: {
      userId,
      status: {
        not: "Incomplete",
      },
    },
    include: { eligibility: true },
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">My Loans</h1>
      {loans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => (
            <Link href={`/dashboard/loans/${loan.id}`} key={loan.id}>
              <Card className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg cursor-pointer">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardTitle className="text-xl font-semibold">
                    {loan.prpseOfLoan}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Application ID: {loan.id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <BanknotesIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        Amount Required:
                      </span>
                      <span className="ml-auto font-semibold">
                        ₹
                        {parseFloat(loan.amtRequired || "0").toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        Application Date:
                      </span>
                      <span className="ml-auto font-semibold">
                        {new Date(loan.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    {loan.eligibility && (
                      <div className="flex items-center">
                        <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          EMI Tenure:
                        </span>
                        <span className="ml-auto font-semibold">
                          {loan.eligibility.emiTenure} months
                        </span>
                      </div>
                    )}
                    <div className="pt-4">
                      <Badge
                        variant={
                          loan.status === "Approved"
                            ? "success"
                            : loan.status === "Rejected"
                              ? "destructive"
                              : "default"
                        }
                        className="w-full justify-center text-center py-1"
                      >
                        {loan.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-gray-600 text-lg">
              You have no completed loan applications.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
