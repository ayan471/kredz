import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "./components/overview";
import { RecentApplications } from "./components/recent-applications";
import { UserButton } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUserCreditBuilderCount(userId: string) {
  return await prisma.creditBuilderApplication.count({
    where: { userId },
  });
}

async function getUserLoanApplicationCount(userId: string) {
  return await prisma.loanApplication.count({
    where: { userId },
  });
}

async function getUserApprovedLoansCount(userId: string) {
  return await prisma.loanEligibility.count({
    where: {
      userId,
      membership: {
        isNot: null,
      },
    },
  });
}

export default async function UserDashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const creditBuilderCount = await getUserCreditBuilderCount(userId);
  const loanApplicationCount = await getUserLoanApplicationCount(userId);
  const approvedLoansCount = await getUserApprovedLoansCount(userId);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Dashboard</h1>
      </header>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Credit Builder Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditBuilderCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Loan Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanApplicationCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Approved Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLoansCount}</div>
          </CardContent>
        </Card>
      </div>
      <Overview userId={userId} />
      <RecentApplications userId={userId} />
    </div>
  );
}
