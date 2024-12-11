import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { CalendarDays, CheckCircle, XCircle } from "lucide-react";
import { getUserSubscription } from "@/actions/formActions";
import SubscriptionStatus from "./SubscriptionStatuus";
import { formatDate } from "@/components/lib/utils";

export default async function SubscriptionPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const subscription = await getUserSubscription(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-indigo-800">
          My Subscription
        </h1>

        <Card className="shadow-lg">
          <CardHeader className="bg-indigo-600 text-white">
            <CardTitle className="text-2xl">Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {subscription ? (
              <div className="space-y-6">
                <SubscriptionStatus
                  isActive={
                    subscription.expiryDate
                      ? new Date(subscription.expiryDate) > new Date()
                      : false
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="text-lg font-semibold">{subscription.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-semibold">
                      {subscription.expiryDate &&
                      new Date(subscription.expiryDate) > new Date() ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Expired</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="text-lg font-semibold flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2 text-indigo-600" />
                      {formatDate(subscription.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="text-lg font-semibold flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2 text-indigo-600" />
                      {formatDate(subscription.expiryDate)}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/credit-health">
                      See Credit Health Report
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                <p className="text-xl font-semibold">No Active Subscription</p>
                <p className="text-gray-600">
                  You don't have an active subscription. Purchase one to access
                  premium features.
                </p>
                <Button asChild className="w-full">
                  <Link href="/purchase-subscription">
                    Purchase Subscription
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
