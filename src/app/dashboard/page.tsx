import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient();

function formatDate(date: Date | null) {
  if (!date) return "N/A";
  return date.toLocaleDateString();
}

async function getUserData(userId: string) {
  const loanApplication = await prisma.loanApplication.findFirst({
    where: {
      userId,
      status: {
        not: "Incomplete",
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const creditBuilderSubscription =
    await prisma.creditBuilderSubscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

  return {
    loanApplication,
    creditBuilderSubscription,
  };
}

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { loanApplication, creditBuilderSubscription } =
    await getUserData(userId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Loan Application</CardTitle>
          </CardHeader>
          <CardContent>
            {loanApplication ? (
              <div>
                <p>Amount: {loanApplication.amtRequired}</p>
                <p>Status: {loanApplication.status}</p>
              </div>
            ) : (
              <p>No completed loan application found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Builder Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            {creditBuilderSubscription ? (
              <div>
                <p>Plan: {creditBuilderSubscription.plan}</p>
                <p>
                  Subscribed on:{" "}
                  {formatDate(creditBuilderSubscription.createdAt)}
                </p>
                <p>
                  Expires on: {formatDate(creditBuilderSubscription.expiryDate)}
                </p>
              </div>
            ) : (
              <p>No active subscription found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
