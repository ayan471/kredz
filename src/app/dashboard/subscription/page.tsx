import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getUserSubscription } from "@/actions/formActions";

function formatDate(date: Date | null) {
  if (!date) return "N/A";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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
                {formatDate(subscription.createdAt)}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {formatDate(subscription.expiryDate)}
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
