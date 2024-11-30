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

export default async function SubscriptionPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const subscription = await getUserSubscription(userId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Subscription</h1>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <>
              <p>
                <strong>Plan:</strong> {subscription.plan}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {subscription.createdAt.toLocaleDateString()}
              </p>
              <Link
                href="/access-content"
                className="text-blue-500 hover:underline"
              >
                Access Content
              </Link>
            </>
          ) : (
            <>
              <p>You don't have an active subscription.</p>
              <Link
                href="/purchase-subscription"
                className="text-blue-500 hover:underline"
              >
                Purchase Subscription
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
