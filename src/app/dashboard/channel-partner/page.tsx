import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

async function getChannelPartnerData(userId: string) {
  // This is a placeholder. You'll need to create a ChannelPartner model in your Prisma schema
  return await prisma.channelPartner.findUnique({
    where: { userId },
  });
}

export default async function ChannelPartnerPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const channelPartner = await getChannelPartnerData(userId);

  if (!channelPartner) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Channel Partner Dashboard</h1>
        <Card>
          <CardContent>
            <p>You are not a channel partner yet.</p>
            <Link
              href="/become-channel-partner"
              className="text-blue-500 hover:underline"
            >
              Become a Channel Partner
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Channel Partner Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Partner Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {user?.firstName} {user?.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user?.emailAddresses[0].emailAddress}
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            {user?.phoneNumbers[0]?.phoneNumber || "Not provided"}
          </p>
          <p>
            <strong>Referral ID:</strong> {channelPartner.referralId}
          </p>
          {/* Add ID card display logic here */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Lead Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Leads Added:</strong> {channelPartner.leadsAdded}
          </p>
          <p>
            <strong>Successful Leads:</strong> {channelPartner.leadsSuccessful}
          </p>
          <p>
            <strong>Rejected Leads:</strong> {channelPartner.leadsRejected}
          </p>
          <p>
            <strong>Pending Leads:</strong> {channelPartner.leadsPending}
          </p>
          {/* Add logic to display lead details */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Total Earnings:</strong> ${channelPartner.totalEarnings}
          </p>
          <p>
            <strong>Total Withdrawn:</strong> ${channelPartner.totalWithdrawn}
          </p>
          <p>
            <strong>Pending Settlement:</strong> $
            {channelPartner.pendingSettlement}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Customized Link</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Share this link to promote our products and services:</p>
          <p className="text-blue-500">{`https://example.com/ref/${channelPartner.referralId}`}</p>
        </CardContent>
      </Card>
    </div>
  );
}
