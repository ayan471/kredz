import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUserLoans(userId: string) {
  return await prisma.loanApplication.findMany({
    where: {
      userId,
      status: {
        not: "Incomplete",
      },
    },
    include: { eligibility: true },
  });
}

export default async function LoansPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const loans = await getUserLoans(userId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Loans</h1>
      {loans.length > 0 ? (
        loans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <CardTitle>Loan Application: {loan.prpseOfLoan}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Amount Required:</strong> {loan.amtRequired}
              </p>
              <p>
                <strong>Status:</strong> {loan.status}
              </p>
              {loan.eligibility && (
                <p>
                  <strong>EMI Tenure:</strong> {loan.eligibility.emiTenure}
                </p>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p>You have no completed loan applications.</p>
      )}
    </div>
  );
}
