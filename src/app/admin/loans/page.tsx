import { PrismaClient } from "@prisma/client";
import { columns, type LoanApplication } from "./columns";
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
      membershipActive: true,
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Loan Applications
          </h1>
          <DownloadCSV data={loanApplications} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
          <DataTable columns={columns} data={loanApplications} />
        </div>
      </div>
    </div>
  );
}
