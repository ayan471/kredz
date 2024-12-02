import { PrismaClient } from "@prisma/client";

import { columns, LoanApplication } from "./columns";
import { DataTable } from "../data-table";

export const dynamic = "force-dynamic";

export default async function LoansPage() {
  const prisma = new PrismaClient();
  const applications = await prisma.loanApplication.findMany({
    select: {
      id: true,
      userId: true,
      fullName: true,
      phoneNo: true,
      panNo: true,
      aadharNo: true,
      amtRequired: true,
      prpseOfLoan: true,
      creditScore: true,
      createdAt: true,
      updatedAt: true,
      status: true,
    },
  });

  const formattedApplications: LoanApplication[] = applications.map((app) => ({
    ...app,
    status: (app.status as LoanApplication["status"]) || "In Progress",
    creditScore: app.creditScore || null,
  }));

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Loan Applications</h1>
      <DataTable columns={columns} data={formattedApplications} />
    </div>
  );
}
