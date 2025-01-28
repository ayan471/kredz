import { PrismaClient } from "@prisma/client";
import { columns } from "./columns";

import { DownloadCSV } from "./download-csv";
import { DataTable } from "../data-table";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

async function getCreditBuilderLoanApplications() {
  const applications = await prisma.creditBuilderLoanApplication.findMany({
    select: {
      id: true,
      userId: true,
      fullName: true,
      mobileNumber: true,
      loanAmountRequired: true,
      eligibleAmount: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      emiTenure: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
}

export default async function AdminCreditBuilderLoansPage() {
  const loanApplications = await getCreditBuilderLoanApplications();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Credit Builder Loan Applications
        </h1>
        <DownloadCSV data={loanApplications} />
      </div>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={loanApplications} />
      </div>
    </div>
  );
}
