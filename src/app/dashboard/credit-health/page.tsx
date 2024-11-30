import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

async function getUserSubscription(userId: string) {
  return await prisma.creditBuilderSubscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export default async function CreditHealthPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const subscription = await getUserSubscription(userId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Credit Health Analysis Report</h1>
      <Card>
        <CardHeader>
          <CardTitle>Credit Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <p>
              Your credit health analysis report is available. [Insert report
              content here]
            </p>
          ) : (
            <>
              <p>
                This content is locked. You need a Credit Builder subscription
                to access it.
              </p>
              <Link
                href="/purchase-subscription"
                className="text-blue-500 hover:underline"
              >
                Purchase Credit Builder Subscription
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
