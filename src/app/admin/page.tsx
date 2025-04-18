import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "./components/overview";
import { RecentApplications } from "./components/recent-applications";

import { PrismaClient } from "@prisma/client";
import { ApprovedLoans } from "./loans/components/approved-loans";
import { RejectedLoans } from "./loans/components/rejected-loans";
import { InProgressLoans } from "./loans/components/in-progress-loans";

const prisma = new PrismaClient();

async function getCreditBuilderCount() {
  return await prisma.creditBuilderApplication.count();
}

async function getCreditBuilderSubscriptionCount() {
  return await prisma.creditBuilderSubscription.count();
}

async function getLoanApplicationCount() {
  return await prisma.loanApplication.count();
}

async function getApprovedLoansCount() {
  return await prisma.loanApplication.count({
    where: {
      status: "Approved",
    },
  });
}

async function getRejectedLoansCount() {
  return await prisma.loanApplication.count({
    where: {
      status: "Rejected",
    },
  });
}

async function getInProgressLoansCount() {
  return await prisma.loanApplication.count({
    where: {
      status: "In Progress",
    },
  });
}

async function getMonthlyLoanData() {
  const currentYear = new Date().getFullYear();
  const monthlyData = await prisma.loanApplication.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: new Date(currentYear, 0, 1),
        lt: new Date(currentYear + 1, 0, 1),
      },
    },
  });

  const formattedData = monthlyData.map((item) => ({
    name: item.createdAt.toLocaleString("default", { month: "short" }),
    total: item._count.id,
  }));

  return formattedData;
}

async function getApprovedLoans() {
  return await prisma.loanApplication.findMany({
    where: {
      status: "Approved",
    },
    select: {
      id: true,
      fullName: true,
      amtRequired: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

async function getRejectedLoans() {
  return await prisma.loanApplication.findMany({
    where: {
      status: "Rejected",
    },
    select: {
      id: true,
      fullName: true,
      amtRequired: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

async function getInProgressLoans() {
  return await prisma.loanApplication.findMany({
    where: {
      status: "In Progress",
    },
    select: {
      id: true,
      fullName: true,
      amtRequired: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

export default async function AdminDashboard() {
  const creditBuilderCount = await getCreditBuilderCount();
  const creditBuilderSubscriptionCount =
    await getCreditBuilderSubscriptionCount();
  const loanApplicationCount = await getLoanApplicationCount();
  const approvedLoansCount = await getApprovedLoansCount();
  const rejectedLoansCount = await getRejectedLoansCount();
  const inProgressLoansCount = await getInProgressLoansCount();
  const monthlyLoanData = await getMonthlyLoanData();
  const approvedLoans = await getApprovedLoans();
  const rejectedLoans = await getRejectedLoans();
  const inProgressLoans = await getInProgressLoans();

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-orange-50 to-blue-50">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
          Dashboard Overview
        </h1>
      </header>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Credit Builder Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {creditBuilderSubscriptionCount}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Loan Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {loanApplicationCount}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Approved Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {approvedLoansCount}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Rejected Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {rejectedLoansCount}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Loans In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {inProgressLoansCount}
            </div>
          </CardContent>
        </Card>
      </div>
      <Overview data={monthlyLoanData} />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ApprovedLoans loans={approvedLoans} />
        <RejectedLoans loans={rejectedLoans} />
        <InProgressLoans loans={inProgressLoans} />
      </div>
      <RecentApplications />
    </div>
  );
}
