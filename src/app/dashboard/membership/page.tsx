import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  Calendar,
  User,
  Phone,
  FileText,
  DollarSign,
  Briefcase,
  PieChart,
} from "lucide-react";
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
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* <h1 className="text-4xl font-bold mb-8 text-center">My Membership</h1> */}
      {loanApplication && loanApplication.membershipPlan ? (
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-2xl flex items-center justify-between">
                <span>Membership Status</span>
                <BadgeCheck className="w-8 h-8" />
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <div className="bg-secondary p-4 rounded-lg text-center">
                    <h2 className="text-2xl font-bold mb-2">Your Plan</h2>
                    <div className="text-4xl font-extrabold text-primary">
                      {loanApplication.membershipPlan}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <p>
                    <span className="font-medium">Start Date:</span>{" "}
                    {new Date(loanApplication.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <p>
                    <span className="font-medium">Full Name:</span>{" "}
                    {loanApplication.fullName}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {loanApplication.phoneNo}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <p>
                    <span className="font-medium">PAN:</span>{" "}
                    {loanApplication.panNo}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <p>
                    <span className="font-medium">Aadhar:</span>{" "}
                    {loanApplication.aadharNo}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-primary" />
                <span>Loan Application Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  <span className="font-medium">Amount Required:</span> ₹
                  {parseInt(loanApplication.amtRequired).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Purpose:</span>{" "}
                  {loanApplication.prpseOfLoan}
                </p>
                <p>
                  <span className="font-medium">Credit Score:</span>{" "}
                  {loanApplication.creditScore}
                </p>
                <p>
                  <span className="font-medium">Current EMIs:</span>{" "}
                  {loanApplication.currEmis || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <Briefcase className="w-6 h-6 text-primary" />
                <span>Employment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  <span className="font-medium">Employment Type:</span>{" "}
                  {loanApplication.empType}
                </p>
                <p>
                  <span className="font-medium">Monthly Income:</span> ₹
                  {parseInt(loanApplication.monIncome).toLocaleString()}
                </p>
                {loanApplication.EmpOthers && (
                  <p>
                    <span className="font-medium">Additional Info:</span>{" "}
                    {loanApplication.EmpOthers}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <PieChart className="w-6 h-6 text-primary" />
                <span>Loan Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-lg">
                  <span className="font-medium">Current Status:</span>{" "}
                  {loanApplication.status}
                </p>
                {/* <Button asChild>
                  <Link href="/apply-loan">Apply for Another Loan</Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-xl">
                You don't have an active membership or loan application.
              </p>
              <Button asChild size="lg">
                <Link href="/apply-loan">Apply for Loan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
