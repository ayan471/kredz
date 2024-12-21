import { PrismaClient } from "@prisma/client";
import { columns, LoanApplication } from "./columns";
import { DataTable } from "../data-table";
import { DownloadCSV } from "./download-csv";

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
      approvedAmount: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      tenure: true,
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Loan Applications</h1>
        <DownloadCSV data={loanApplications} />
      </div>
      <DataTable columns={columns} data={loanApplications} />
    </div>
  );
}
