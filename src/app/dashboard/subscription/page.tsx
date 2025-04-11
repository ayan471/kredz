import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { CalendarDays, CheckCircle, AlertCircle } from "lucide-react";
import { getUserSubscription } from "@/actions/formActions";
import SubscriptionStatus from "./SubscriptionStatuus";
import { formatDate } from "@/components/lib/utils";

const SubscriptionPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const subscription = await getUserSubscription(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-900">
          My Subscription
        </h1>

        <Card className="shadow-lg border-orange-300">
          <CardHeader className="bg-orange-500 text-white">
            <CardTitle className="text-2xl">Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            {subscription ? (
              <div className="space-y-6">
                <SubscriptionStatus
                  isActive={subscription.isActive}
                  isPending={
                    !subscription.isActive && !subscription.activationDate
                  }
                  expiryDate={
                    subscription.expiryDate
                      ? new Date(subscription.expiryDate)
                      : null
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Plan</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {subscription.plan}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Status</p>
                    <p className="text-lg font-semibold">
                      {subscription.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Start Date</p>
                    <p className="text-lg font-semibold flex items-center text-blue-900">
                      <CalendarDays className="w-4 h-4 mr-2 text-orange-500" />
                      {formatDate(subscription.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Expiry Date</p>
                    <p className="text-lg font-semibold flex items-center text-blue-900">
                      <CalendarDays className="w-4 h-4 mr-2 text-orange-500" />
                      {subscription.expiryDate
                        ? formatDate(subscription.expiryDate)
                        : "N/A"}
                    </p>
                  </div>
                </div>
                {!subscription.isActive &&
                  subscription.activationDate === null && (
                    <div className="mt-4 p-4 bg-orange-100 rounded-md">
                      <p className="text-orange-800">
                        Your subscription is pending activation. Please complete
                        the payment process to activate your subscription.
                      </p>
                    </div>
                  )}
                <div className="mt-6">
                  <Button
                    asChild
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                  >
                    <Link href="/dashboard/credit-health">
                      See Credit Health Report
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-blue-800">No active subscription.</p>
                <Button
                  asChild
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Link href="/pricing">Subscribe Now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;
