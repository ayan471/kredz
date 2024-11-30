import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUserOverview(userId: string) {
  const creditBuilderSubscription =
    await prisma.creditBuilderSubscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

  const latestLoanApplication = await prisma.loanApplication.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const latestLoanMembership = await prisma.loanMembership.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return {
    creditBuilderPlan: creditBuilderSubscription?.plan || "No active plan",
    latestLoanAmount:
      latestLoanApplication?.amtRequired || "No loan applications",
    latestLoanMembership:
      latestLoanMembership?.membershipPlan || "No active loan membership",
  };
}

export async function Overview({ userId }: { userId: string }) {
  const { creditBuilderPlan, latestLoanAmount, latestLoanMembership } =
    await getUserOverview(userId);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Credit Builder Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{creditBuilderPlan}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Latest Loan Application Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestLoanAmount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Latest Loan Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestLoanMembership}</div>
        </CardContent>
      </Card>
    </div>
  );
}
