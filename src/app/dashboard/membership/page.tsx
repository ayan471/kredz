import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

async function getUserMembership(userId: string) {
  return await prisma.loanMembership.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export default async function MembershipPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const membership = await getUserMembership(userId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Membership</h1>
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
        </CardHeader>
        <CardContent>
          {membership ? (
            <>
              <p>
                <strong>Plan:</strong> {membership.membershipPlan}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {membership.createdAt.toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <p>You don't have an active membership.</p>
              <Link
                href="/purchase-membership"
                className="text-blue-500 hover:underline"
              >
                Purchase Membership
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
