import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getRecentApplications(userId: string) {
  const recentCreditBuilderApplications =
    await prisma.creditBuilderApplication.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

  const recentLoanApplications = await prisma.loanApplication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return { recentCreditBuilderApplications, recentLoanApplications };
}

export async function RecentApplications({ userId }: { userId: string }) {
  const { recentCreditBuilderApplications, recentLoanApplications } =
    await getRecentApplications(userId);

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Credit Builder Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentCreditBuilderApplications.map((app) => (
              <li
                key={app.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <span>{app.fullName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Loan Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentLoanApplications.map((app) => (
              <li
                key={app.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <span>{app.fullName}</span>
                <span className="text-sm text-gray-500">{app.amtRequired}</span>
                <span className="text-sm text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
