import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "./components/overview";
import { RecentApplications } from "./components/recent-applications";
import { PrismaClient } from "@prisma/client";

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
  return await prisma.loanEligibility.count({
    where: {
      membership: {
        isNot: null,
      },
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

export default async function AdminDashboard() {
  const creditBuilderCount = await getCreditBuilderCount();
  const creditBuilderSubscriptionCount =
    await getCreditBuilderSubscriptionCount();
  const loanApplicationCount = await getLoanApplicationCount();
  const approvedLoansCount = await getApprovedLoansCount();
  const rejectedLoansCount = await getRejectedLoansCount();
  const monthlyLoanData = await getMonthlyLoanData();

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Credit Builder Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {creditBuilderSubscriptionCount}
            </div>
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
      <Overview data={monthlyLoanData} />
      <RecentApplications />
    </div>
  );
}
