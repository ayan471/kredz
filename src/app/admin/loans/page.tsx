import { PrismaClient } from "@prisma/client";
import { columns, LoanApplication } from "./columns";
import { DataTable } from "../data-table";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

async function getLoanApplications(): Promise<LoanApplication[]> {
  const applications = await prisma.loanApplication.findMany({
    select: {
      id: true,
      userId: true,
      fullName: true,
      phoneNo: true,
      amtRequired: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
}

export default async function AdminLoansPage() {
  const loanApplications = await getLoanApplications();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Loan Applications</h1>
      <DataTable columns={columns} data={loanApplications} />
    </div>
  );
}
