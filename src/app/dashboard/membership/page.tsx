import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserMembership } from "@/actions/loanApplicationActions";

export default async function MembershipPage() {
  const { userId } = auth();
  if (!userId) {
    console.log("No user ID found, redirecting to sign-in");
    redirect("/sign-in");
  }

  console.log("Fetching membership for user ID:", userId);
  const loanApplication = await getUserMembership(userId);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">My Membership</h1>
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
        </CardHeader>
        <CardContent>
          {loanApplication && loanApplication.membershipPlan ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong className="font-medium">Plan:</strong>{" "}
                  {loanApplication.membershipPlan}
                </p>
                <p>
                  <strong className="font-medium">Start Date:</strong>{" "}
                  {loanApplication.createdAt.toLocaleDateString()}
                </p>
                <p>
                  <strong className="font-medium">Full Name:</strong>{" "}
                  {loanApplication.fullName}
                </p>
                <p>
                  <strong className="font-medium">Phone:</strong>{" "}
                  {loanApplication.phoneNo}
                </p>
                <p>
                  <strong className="font-medium">PAN:</strong>{" "}
                  {loanApplication.panNo}
                </p>
                <p>
                  <strong className="font-medium">Aadhar:</strong>{" "}
                  {loanApplication.aadharNo}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Loan Application Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <strong className="font-medium">Amount Required:</strong> ₹
                    {loanApplication.amtRequired}
                  </p>
                  <p>
                    <strong className="font-medium">Purpose:</strong>{" "}
                    {loanApplication.prpseOfLoan}
                  </p>
                  <p>
                    <strong className="font-medium">Credit Score:</strong>{" "}
                    {loanApplication.creditScore}
                  </p>
                  <p>
                    <strong className="font-medium">Employment Type:</strong>{" "}
                    {loanApplication.empType}
                  </p>
                  <p>
                    <strong className="font-medium">Monthly Income:</strong> ₹
                    {loanApplication.monIncome}
                  </p>
                  <p>
                    <strong className="font-medium">Current EMIs:</strong>{" "}
                    {loanApplication.currEmis || "N/A"}
                  </p>
                </div>
              </div>
              {/* <div className="mt-4">
                <Button asChild>
                  <Link href="/apply-loan">Apply for Another Loan</Link>
                </Button>
              </div> */}
            </div>
          ) : (
            <div className="space-y-4">
              <p>You don't have an active membership or loan application.</p>
              <p className="text-sm text-gray-500">
                Debug info: User ID: {userId}
              </p>
              <Button asChild>
                <Link href="/apply-loan">Apply for Loan</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
