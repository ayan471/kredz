import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "./components/overview";
import { RecentApplications } from "./components/recent-applications";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCreditBuilderCount() {
  return await prisma.creditBuilderApplication.count();
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

export default async function AdminDashboard() {
  const creditBuilderCount = await getCreditBuilderCount();
  const loanApplicationCount = await getLoanApplicationCount();
  const approvedLoansCount = await getApprovedLoansCount();
  const rejectedLoansCount = await getRejectedLoansCount();

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Credit Builder Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditBuilderCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loan Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanApplicationCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLoansCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedLoansCount}</div>
          </CardContent>
        </Card>
      </div>
      <Overview />
      <RecentApplications />
    </div>
  );
}
